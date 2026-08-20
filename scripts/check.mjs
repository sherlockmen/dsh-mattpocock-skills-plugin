// 校验 skills/ 目录下所有 SKILL.md 是否符合 DSH 的解析规则。
// 用法: npm install && npm run check   (需要 node >= 18)
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')
const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// 与 DSH dsh-skill-filesystem 的 parseFrontmatter 行为一致
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
      const data = parseYaml(raw.slice(start, lineStart))
      return { data, body: raw.slice(nextNewline < 0 ? raw.length : nextNewline + 1) }
    }
    if (nextNewline < 0) return undefined
    lineStart = nextNewline + 1
  }
  return undefined
}

let total = 0, modelInvocable = 0, userTriggered = 0
const problems = []
for (const entry of readdirSync(ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  total++
  const file = join(ROOT, entry.name, 'SKILL.md')
  const raw = readFileSync(file, 'utf8')
  const parsed = parseFrontmatter(raw)
  if (!parsed) { problems.push(`${entry.name}: 无有效 frontmatter`); continue }
  const { data } = parsed
  const name = typeof data.name === 'string' && data.name.length > 0 ? data.name : undefined
  const description = typeof data.description === 'string' && data.description.length > 0 ? data.description : undefined
  if (!name || !NAME_RE.test(name)) { problems.push(`${entry.name}: 无效 name (${data.name})`); continue }
  if (!description) { problems.push(`${entry.name}: 缺少 description`); continue }
  if (data['disable-model-invocation'] === true) userTriggered++
  else modelInvocable++
}

console.log(`技能总数: ${total}`)
console.log(`模型可调用: ${modelInvocable} | 用户触发: ${userTriggered}`)
if (problems.length > 0) {
  console.error('校验失败:')
  for (const p of problems) console.error(` - ${p}`)
  process.exit(1)
}
console.log('✅ 全部通过 DSH 解析规则')
