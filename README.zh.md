# dsh-mattpocock-skills

把 [Matt Pocock 的 agent skills](https://github.com/mattpocock/skills)(MIT)封装成 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)(DSH)可用的技能包,同时提供**两种形态**:

1. **可移植的 SKILL.md 目录包**(`skills/` + `.agents/skills/`)——任何认识 `SKILL.md` 约定的智能体都能用(DSH、Claude Code、Cursor、Codex……);
2. **npm 插件**(`dsh-mattpocock-skills`)——一条命令装进 DSH profile,`dsh plugin update` 即可更新。

本仓库**不改上游任何代码**:它是 `mattpocock/skills` 的"扁平化 + 自动同步快照",外加一个极薄的注册插件。

---

## 为什么要扁平化

DSH 的文件系统 skill provider **只扫一层**:`<根>/<名字>/SKILL.md` 或 `<根>/<名字>.md`(见 [docs/subsystems/skills.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.md))。上游把技能嵌套在 `skills/{分类}/{名字}/SKILL.md`,DSH 发现不了。本仓库把它拍平成 `skills/{名字}/SKILL.md`——除此之外**不做任何改动**。

全部 35 个技能都通过 DSH 解析规则(kebab-case `name` + `description` frontmatter;`disable-model-invocation` 被完整尊重)。

---

## 目录结构

```
.
├── skills/<名字>/SKILL.md      # 扁平化后的技能本体(同时随 npm 包发布)
├── .agents/skills/<名字>       # 软链 -> ../../skills/<名字>(git 侧约定根)
├── lib/index.js                # 极薄 Cordis 插件:用 ctx.skills.register() 注册技能
├── cordis.patch.yml            # profile 组合用的 bundle 补丁
├── scripts/update.sh           # 同步上游 -> 扁平化 -> 重建软链
├── scripts/install.sh          # 一键安装/更新到 ~/.agents/skills
├── scripts/check.mjs           # 按 DSH 规则校验 frontmatter
├── UPSTREAM_COMMIT             # 当前快照对应的上游 commit
└── .github/workflows/          # 定时同步 + 手动发版
```

---

## 安装

### 方式 A:目录包(不需要 npm,任何智能体通用)

```bash
git clone https://github.com/sherlockmen/dsh-mattpocock-skills-plugin.git
cd dsh-mattpocock-skills-plugin
bash scripts/install.sh            # 软链到 ~/.agents/skills(所有项目可见)
# 或: bash scripts/install.sh --copy            # 复制模式(Windows 友好)
# 或: bash scripts/install.sh --target .agents/skills   # 只装进当前项目
```

DSH 会自动发现技能(热加载,无需重启)。

### 方式 B:npm 插件(仅 DSH,一条命令)

```bash
dsh plugin --profile <名字> add dsh-mattpocock-skills
```

重启 DSH。插件会在运行时注册全部 35 个技能。

---

## 更新

上游更新频繁。本仓库通过 GitHub Actions **每天自动同步一次**,所以延迟最多一天。你这边:

| 安装方式 | 更新命令 |
|---|---|
| 软链(`install.sh` 默认) | `cd <仓库> && git pull`——**立即生效,无需重启** |
| 复制(`install.sh --copy`) | `git pull` 后重跑 `bash scripts/install.sh --copy` |
| npm 插件 | `dsh plugin --profile <名字> update dsh-mattpocock-skills`,然后重启 |

不追求实时同步,何时拉取/发版由你决定。

---

## 模型能看到哪些技能?

上游把 35 个里的 **20 个**标了 `disable-model-invocation: true`——它们是交互式流程(grilling、spec/ticket 流等),设计上就是"人主动触发"。DSH 完整尊重这个语义:

- **15 个**出现在模型的 skill 目录: `code-review`、`codebase-design`、`diagnosing-bugs`、`domain-modeling`、`git-guardrails-claude-code`、`grilling`、`migrate-to-shoehorn`、`prototype`、`research`、`resolving-merge-conflicts`、`scaffold-exercises`、`setup-pre-commit`、`tdd`、`wizard`、`writing-for-agents`。
- **20 个**不进模型目录,但你在对话里**点名**(例如"用 grill-me")时,DSH 会把内容注入——正好符合上游的设计意图。想让某个技能对模型可见:编辑 `skills/<名字>/SKILL.md`,删掉 frontmatter 里的 `disable-model-invocation: true` 即可。

### 注意事项

- 不少技能引用了 Claude 特有机制(`agents/` 子代理 prompt 文件、`/setup-matt-pocock-skills`、`docs/agents/issue-tracker.md`)。它们在 DSH 里能正常加载(模型可通过技能的 resource 目录读取被引用的文件),但这些流程是按 Claude Code 的代理模型写的,可能需要小幅适配。
- `misc/` 与 `in-progress/` 原样收录;上游的 Claude Code 插件清单里并没有包含它们。

---

## 技能清单

**engineering(18):** ask-matt, code-review, codebase-design, diagnosing-bugs, domain-modeling, grill-with-docs, implement, improve-codebase-architecture, prototype, research, resolving-merge-conflicts, setup-matt-pocock-skills, tdd, to-spec, to-tickets, triage, wayfinder, wizard

**productivity(7):** grill-me, grilling, handoff, teach, to-questionnaire, wait-what, writing-for-agents

**misc(4):** git-guardrails-claude-code, migrate-to-shoehorn, scaffold-exercises, setup-pre-commit

**in-progress(6):** claude-handoff, loop-me, setup-ts-deep-modules, writing-beats, writing-fragments, writing-shape

---

## 开发

```bash
bash scripts/update.sh      # 拉上游 -> 扁平化 -> 重建软链(幂等)
npm install && npm run check  # 按 DSH 规则校验 frontmatter
```

- `.github/workflows/sync-upstream.yml` — 每天 + 手动同步;内容没变化不会产生提交。
- `.github/workflows/release.yml` — 手动发 npm 版(`patch`/`minor`/`major`);需要在仓库 Secrets 配置有 publish 权限的 `NPM_TOKEN`。npm 包 `package.json` 的 `repository` 字段回链本仓库——这正是 DSH 市场(dshfind / deepseek1024)校验 `repository_backlink` 的依据。

---

## 许可与致谢

MIT。技能内容 © Matt Pocock([mattpocock/skills](https://github.com/mattpocock/skills));封装由 sherlockmen 完成。详见 [LICENSE](./LICENSE)。
