<div align="center">

[English](./README.md) · [简体中文](./README.zh.md)

---

# 🧩 dsh-mattpocock-skills

**Matt Pocock 的 35 个"真工程"技能,为 DeepSeek Harness(DSH)封装**

一个仓库,两种安装方式——可移植的 `SKILL.md` 目录包,适用于**任何**智能体
(DSH · Claude Code · Cursor · Codex);以及**一条命令**安装的 DSH npm 插件。
每天自动同步自 [mattpocock/skills](https://github.com/mattpocock/skills)——永不过时,零维护。

[![GitHub stars](https://img.shields.io/github/stars/sherlockmen/dsh-mattpocock-skills-plugin?style=flat-square)](https://github.com/sherlockmen/dsh-mattpocock-skills-plugin)
[![License](https://img.shields.io/github/license/sherlockmen/dsh-mattpocock-skills-plugin?style=flat-square)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/dsh-mattpocock-skills?style=flat-square)](https://www.npmjs.com/package/dsh-mattpocock-skills)
[![Last commit](https://img.shields.io/github/last-commit/sherlockmen/dsh-mattpocock-skills-plugin?style=flat-square)](https://github.com/sherlockmen/dsh-mattpocock-skills-plugin)
[![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-plugin-1e90ff?style=flat-square)](https://github.com/deepseek-ai/deepseek-harness)

</div>

---

## 📖 目录

- [✨ 特性](#-特性)
- [🚀 快速开始](#-快速开始)
- [🔄 保持更新](#-保持更新)
- [🧠 模型能看到哪些技能?](#-模型能看到哪些技能)
- [📦 技能清单](#-技能清单)
- [🗂️ 项目结构](#️-项目结构)
- [🛠️ 开发与同步](#️-开发与同步)
- [❓ 常见问题](#-常见问题)
- [📄 许可与致谢](#-许可与致谢)

---

## ✨ 特性

- **📦 天生可移植** — 纯 `SKILL.md` 文件,跨智能体标准。克隆、软链、fork、魔改,随你。
- **⚡ 一条命令装插件** — `dsh plugin add`,35 个技能全部在运行时注册,零配置。
- **🔄 自动同步,永不过时** — GitHub Action 每天拉取上游,上游变更一天内落地。
- **🔒 零代码改动** — 上游技能原样发布(仅拍平一层,因为 DSH 只扫一层)。
- **🎛️ 尊重上游意图** — 15 个技能模型可直接调用;20 个交互式流程(`grill-me`、`to-spec`……)保持"用户触发",与上游设计完全一致。
- **🛡️ 插件极稳** — 只调用稳定的 `ctx.skills.register()` API,不碰 `@deepseek-ai` 内部实现;无 `skills` 服务时优雅降级。

---

## 🚀 快速开始

### 方式 A:可移植目录包 *(任何智能体,无需 npm)*

```bash
git clone https://github.com/sherlockmen/dsh-mattpocock-skills-plugin.git
cd dsh-mattpocock-skills-plugin

# 软链到 ~/.agents/skills(所有项目可见)——更新 = git pull
bash scripts/install.sh

# 其他用法:
#   bash scripts/install.sh --copy                  # 复制模式(Windows 友好)
#   bash scripts/install.sh --target .agents/skills  # 只装进当前项目
```

DSH 立即发现技能(热加载——无需重启)。

### 方式 B:DSH npm 插件 *(一条命令)*

```bash
dsh plugin --profile <名字> add dsh-mattpocock-skills
```

重启 DSH。插件在运行时注册全部 35 个技能。

> 💡 **提示:** 两种方式任选其一。都装会得到双份技能。

---

## 🔄 保持更新

上游更新频繁;本仓库通过 GitHub Actions **每天自动同步**,你最多落后一天。你这边:

| 安装方式 | 更新命令 |
|---|---|
| 软链(`install.sh` 默认) | `cd <仓库> && git pull`——**立即生效,无需重启** |
| 复制(`install.sh --copy`) | `git pull`,然后重跑 `bash scripts/install.sh --copy` |
| npm 插件 | `dsh plugin --profile <名字> update dsh-mattpocock-skills`,然后重启 |

---

## 🧠 模型能看到哪些技能?

上游把 35 个里的 **20 个**标了 `disable-model-invocation: true`——它们是"人主动触发"的交互式流程。DSH 完整尊重这个语义:

- ✅ **15 个**出现在模型的 skill 目录,例如 `tdd`、`code-review`、`diagnosing-bugs`、`domain-modeling`、`research`、`grilling`、`wizard`。
- 👆 **20 个**不进模型目录,但你在对话里**点名**(例如 *"用 grill-me"*)时,内容会被注入——与上游"故意触发"的设计一致。

想让某个技能对模型可见:删掉它 `SKILL.md` frontmatter 里的 `disable-model-invocation: true` 即可。

> ⚠️ **Claude 特有内容:** 不少技能引用了 `agents/` 子代理 prompt 文件与 Claude Code 机制(`/setup-matt-pocock-skills`、`docs/agents/issue-tracker.md`)。它们在 DSH 里能正常加载——模型可通过技能的 resource 目录读取被引用的文件——但这些流程是按 Claude 的代理模型写的,可能需要小幅适配。

---

## 📦 技能清单

<details>
<summary><b>engineering · 18</b></summary>

`ask-matt` · `code-review` · `codebase-design` · `diagnosing-bugs` · `domain-modeling` · `grill-with-docs` · `implement` · `improve-codebase-architecture` · `prototype` · `research` · `resolving-merge-conflicts` · `setup-matt-pocock-skills` · `tdd` · `to-spec` · `to-tickets` · `triage` · `wayfinder` · `wizard`

</details>

<details>
<summary><b>productivity · 7</b></summary>

`grill-me` · `grilling` · `handoff` · `teach` · `to-questionnaire` · `wait-what` · `writing-for-agents`

</details>

<details>
<summary><b>misc · 4</b></summary>

`git-guardrails-claude-code` · `migrate-to-shoehorn` · `scaffold-exercises` · `setup-pre-commit`

</details>

<details>
<summary><b>in-progress · 6</b></summary>

`claude-handoff` · `loop-me` · `setup-ts-deep-modules` · `writing-beats` · `writing-fragments` · `writing-shape`

</details>

---

## 🗂️ 项目结构

```
.
├── skills/<名字>/SKILL.md        # 扁平化后的技能本体(随 npm 包发布)
├── .agents/skills/<名字>         # 软链 -> ../../skills/<名字>(git 侧约定根)
├── lib/index.js                  # 极薄 Cordis 插件:用 ctx.skills.register() 注册技能
├── lib/index.d.ts                # TypeScript 声明
├── cordis.patch.yml              # DSH profile 组合用的 bundle 补丁
├── scripts/update.sh             # 同步上游 -> 扁平化 -> 重建软链(幂等)
├── scripts/install.sh            # 一键安装/更新到 ~/.agents/skills
├── scripts/check.mjs             # 按 DSH 规则校验 frontmatter
├── UPSTREAM_COMMIT               # 当前快照对应的上游 commit
├── .github/workflows/            # 定时同步 + 手动发版
└── package.json                  # dsh-mattpocock-skills npm 插件
```

---

## 🛠️ 开发与同步

```bash
bash scripts/update.sh           # 拉上游 -> 扁平化 -> 重建软链(幂等)
npm install && npm run check     # 按 DSH 解析规则校验 frontmatter
```

- **`.github/workflows/sync-upstream.yml`** — 每天 + 手动同步;内容没变化不会产生提交。
- **`.github/workflows/release.yml`** — 手动发 npm 版(`patch` / `minor` / `major`);需要在仓库 Secrets 配置有 publish 权限的 `NPM_TOKEN`。npm 包 `package.json` 的 `repository` 字段回链本仓库——这正是 DSH 市场(dshfind / deepseek1024)校验 `repository_backlink` 的依据。

---

## ❓ 常见问题

<details>
<summary><b>为什么这个仓库要"拍平"?</b></summary>

DSH 的文件系统 skill provider **只扫一层**:`<根>/<名字>/SKILL.md`。上游把技能嵌套在 `skills/{分类}/{名字}/SKILL.md`,DSH 发现不了。本仓库只做这一步拍平,其他一律不动。

</details>

<details>
<summary><b>为什么模型看不到某些技能?</b></summary>

它们在上游就带 `disable-model-invocation: true`:交互式流程,设计上由你触发、而非模型自动选择。你在对话里点名时,DSH 会注入其内容。想让它对模型可见,改 frontmatter 即可。

</details>

<details>
<summary><b>目录包和 npm 插件怎么选?</b></summary>

- **目录包** — 跨智能体、可魔改、`git pull` 即时更新。适合折腾党与多智能体环境。
- **npm 插件** — 一条命令、semver 管理、可上市场。适合想在 DSH 里做受管安装的场景。

</details>

<details>
<summary><b>我可以修改技能吗?</b></summary>

可以。用 `install.sh --copy`(或直接改 `skills/<名字>/SKILL.md`)——文件归你。每日自动同步只在上游内容变化时才提交,只要上游文件没变,你的本地修改就不会被覆盖。

</details>

<details>
<summary><b>怎么发布新版本 npm 包?</b></summary>

在仓库 Secrets 里配置 `NPM_TOKEN`(带 publish 权限),然后到 Actions 页运行 **release** 工作流,选择 `patch` / `minor` / `major`。它会先同步上游、升版本、发布、打 tag。

</details>

---

## 📄 许可与致谢

**MIT。** 技能内容 © [Matt Pocock](https://github.com/mattpocock/skills);封装由 [sherlockmen](https://github.com/sherlockmen) 完成。详见 [LICENSE](./LICENSE)。

- 上游项目:[mattpocock/skills](https://github.com/mattpocock/skills)
- 为谁而建:[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
- DSH 技能文档:[docs/subsystems/skills.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.md)

<div align="center">

**⭐ 觉得有用就点个 Star——它让同步保持诚实。⭐**

</div>
