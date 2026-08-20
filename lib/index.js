// dsh-mattpocock-skills — DeepSeek Harness 插件
//
// 把 mattpocock/skills(https://github.com/mattpocock/skills,MIT)的 35 个
// SKILL.md 技能以 runtime skill 的形式注册进 DSH 的 ctx.skills 注册表。
//
// 设计要点:
//   - 不 import 任何 @deepseek-ai/* 运行时包,只调用标准的 ctx.skills.register()
//     API,因此不依赖 DSH 内部版本,插件极其稳定。
//   - skill 内容来自随包发布的 ./skills 目录;更新 = 发布新版本 + dsh plugin update。
//   - 尊重上游 frontmatter 的 disable-model-invocation / user-invocable 语义:
//     默认模型与用户均可调用;上游标记 disable-model-invocation: true 的技能
//     只保留用户触发通道(与 DSH 的 agent/pre-step 注入机制一致)。
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

export const name = 'dsh-mattpocock-skills'

/** 随包发布的扁平化 skills 目录(相对本文件: packages/skills) */
const SKILLS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')

/** 与 DSH dsh-skill-filesystem 相同的 kebab-case 规则 */
const SKILL_NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** 极简 frontmatter 解析(与 DSH 的 parseSkillFile 行为一致) */
function parseFrontmatter(raw) {
  const firstLineEnd = raw.indexOf('\n')
  if (firstLineEnd < 0) return undefined
  if (raw.slice(0, firstLineEnd).replace(/\r$/, '') !== '---') return undefined
  const start = firstLineEnd + 1
  let lineStart = start
  while (lineStart <= raw.length) {
    const nextNewline = raw.indexOf('\n', lineStart)
    const lineEnd = nextNewline < 0 ? raw.length : nextNewline
    if (raw.slice(lineStart, lineEnd).replace(/\r$/, '') === '---') {
      try {
        const data = parseYaml(raw.slice(start, lineStart))
        const body = raw.slice(nextNewline < 0 ? raw.length : nextNewline + 1)
        if (typeof data !== 'object' || data === null || Array.isArray(data)) return undefined
        return { data, body }
      } catch {
        return undefined
      }
    }
    if (nextNewline < 0) return undefined
    lineStart = nextNewline + 1
  }
  return undefined
}

export function apply(ctx) {
  // 防御性守卫:非 DSH 宿主(没有 skills 服务)时安静退出,避免硬崩溃
  if (!ctx.skills || typeof ctx.skills.register !== 'function') {
    ctx.logger?.warn?.('dsh-mattpocock-skills: ctx.skills 服务不可用,插件未注册任何技能')
    return
  }
  const disposers = []
  for (const entry of readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const skillDir = join(SKILLS_DIR, entry.name)
    const skillFile = join(skillDir, 'SKILL.md')
    let stat
    try {
      stat = statSync(skillFile)
    } catch {
      continue // 目录里没有 SKILL.md,跳过
    }
    if (!stat.isFile()) continue

    const raw = readFileSync(skillFile, 'utf8')
    const parsed = parseFrontmatter(raw)
    if (!parsed) continue
    const { data } = parsed

    const skillName = typeof data.name === 'string' ? data.name : ''
    const description = typeof data.description === 'string' ? data.description : ''
    if (!SKILL_NAME_RE.test(skillName) || description.length === 0) continue

    const registration = {
      name: skillName,
      description,
      invocation: {
        // 上游用 disable-model-invocation 控制"模型目录不可见、仅用户触发"
        modelInvocable: data['disable-model-invocation'] !== true,
        userInvocable: data['user-invocable'] !== false,
      },
      // 让模型能按需解析技能目录下的相对资源(agents/*.md 等)
      resourceBase: { kind: 'directory', path: skillDir },
      content: parsed.body.trim(),
    }
    if (typeof data.whenToUse === 'string' && data.whenToUse.length > 0) {
      registration.whenToUse = data.whenToUse
    }
    disposers.push(ctx.skills.register(registration))
  }

  ctx.on('dispose', () => {
    for (const dispose of disposers) dispose()
  })
}
