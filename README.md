<div align="center">

[English](./README.md) · [简体中文](./README.zh.md)

---

# 🧩 dsh-mattpocock-skills

**Matt Pocock's 35 agent skills for real engineering, packaged for DeepSeek Harness (DSH)**

One repo, two install modes — a portable `SKILL.md` bundle that works in **any** agent
(DSH · Claude Code · Cursor · Codex), and a **one-command DSH npm plugin**.
Auto-synced daily from [mattpocock/skills](https://github.com/mattpocock/skills) — no drift, no fuss.

[![GitHub stars](https://img.shields.io/github/stars/sherlockmen/dsh-mattpocock-skills-plugin?style=flat-square)](https://github.com/sherlockmen/dsh-mattpocock-skills-plugin)
[![License](https://img.shields.io/github/license/sherlockmen/dsh-mattpocock-skills-plugin?style=flat-square)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/dsh-mattpocock-skills?style=flat-square)](https://www.npmjs.com/package/dsh-mattpocock-skills)
[![Last commit](https://img.shields.io/github/last-commit/sherlockmen/dsh-mattpocock-skills-plugin?style=flat-square)](https://github.com/sherlockmen/dsh-mattpocock-skills-plugin)
[![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-plugin-1e90ff?style=flat-square)](https://github.com/deepseek-ai/deepseek-harness)

</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🔄 Staying Up-to-Date](#-staying-up-to-date)
- [🧠 Which Skills Does the Model See?](#-which-skills-does-the-model-see)
- [📦 Skill List](#-skill-list)
- [🗂️ Project Structure](#️-project-structure)
- [🛠️ Development & Sync](#️-development--sync)
- [❓ FAQ](#-faq)
- [📄 License & Credits](#-license--credits)

---

## ✨ Features

- **📦 Portable by design** — plain `SKILL.md` files, the cross-agent standard. Clone it, symlink it, fork it, hack it.
- **⚡ One-command DSH plugin** — `dsh plugin add` and all 35 skills are registered at runtime. No config.
- **🔄 Auto-sync, never stale** — a GitHub Action pulls upstream daily; upstream changes land here within a day.
- **🔒 Zero code modification** — upstream skills are shipped verbatim (only flattened one level, because DSH scans a single level).
- **🎛️ Honors upstream intent** — 15 skills are model-invocable; 20 interactive workflows (`grill-me`, `to-spec`, …) stay user-triggered, exactly as upstream designed.
- **🛡️ Robust plugin** — calls only the stable `ctx.skills.register()` API, no `@deepseek-ai` internals, graceful degradation without the `skills` service.

---

## 🚀 Quick Start

### Option A — Portable SKILL.md bundle *(any agent, no npm)*

```bash
git clone https://github.com/sherlockmen/dsh-mattpocock-skills-plugin.git
cd dsh-mattpocock-skills-plugin

# symlink into ~/.agents/skills (all your projects) — updates = git pull
bash scripts/install.sh

# alternatives:
#   bash scripts/install.sh --copy                 # copy mode (Windows-friendly)
#   bash scripts/install.sh --target .agents/skills # install into one project only
```

DSH discovers the skills immediately (hot-reload — no restart).

### Option B — DSH npm plugin *(one command)*

```bash
dsh plugin --profile <name> add dsh-mattpocock-skills
```

Restart DSH. The plugin registers all 35 skills at runtime.

> 💡 **Tip:** pick one install mode. Installing both gives you every skill twice.

---

## 🔄 Staying Up-to-Date

Upstream moves fast; this repo **auto-syncs daily** via GitHub Actions, so you're never more than a day behind. Your side:

| Your install mode | Update command |
|---|---|
| Symlink (`install.sh` default) | `cd <repo> && git pull` — **instant, no restart** |
| Copy (`install.sh --copy`) | `git pull`, then re-run `bash scripts/install.sh --copy` |
| npm plugin | `dsh plugin --profile <name> update dsh-mattpocock-skills`, then restart |

---

## 🧠 Which Skills Does the Model See?

Upstream marks **20 of 35** skills `disable-model-invocation: true` — interactive workflows meant to be triggered deliberately. DSH honors this exactly:

- ✅ **15 skills** appear in the model's skill catalog, e.g. `tdd`, `code-review`, `diagnosing-bugs`, `domain-modeling`, `research`, `grilling`, `wizard`.
- 👆 **20 skills** stay out of the model catalog, but naming one in your prompt (e.g. *"use grill-me"*) injects its content — the same deliberate-trigger flow upstream intends.

To make a skill model-visible, delete `disable-model-invocation: true` from its `SKILL.md` frontmatter.

> ⚠️ **Claude-specific content:** many skills reference `agents/` sub-agent prompt files and Claude Code mechanics (`/setup-matt-pocock-skills`, `docs/agents/issue-tracker.md`). They load fine in DSH — the model can read referenced files via the skill's resource directory — but those flows were written for Claude's agent model and may need light adaptation.

---

## 📦 Skill List

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

## 🗂️ Project Structure

```
.
├── skills/<name>/SKILL.md        # canonical flattened skills (shipped inside the npm package)
├── .agents/skills/<name>         # symlinks -> ../../skills/<name> (git-side convention root)
├── lib/index.js                  # thin Cordis plugin: registers skills via ctx.skills.register()
├── lib/index.d.ts                # TypeScript declarations
├── cordis.patch.yml              # bundle patch for DSH profile composition
├── scripts/update.sh             # sync upstream -> flatten -> rebuild symlinks (idempotent)
├── scripts/install.sh            # one-command install/update into ~/.agents/skills
├── scripts/check.mjs             # validate frontmatter against DSH rules
├── UPSTREAM_COMMIT               # pinned upstream commit of the current snapshot
├── .github/workflows/            # sync-upstream (daily) + release (manual npm publish)
└── package.json                  # the dsh-mattpocock-skills npm plugin
```

---

## 🛠️ Development & Sync

```bash
bash scripts/update.sh           # pull upstream, flatten, rebuild symlinks (idempotent)
npm install && npm run check     # validate frontmatter against DSH parsing rules
```

- **`.github/workflows/sync-upstream.yml`** — daily + manual sync; commits only when content actually changed.
- **`.github/workflows/release.yml`** — manual npm release (`patch` / `minor` / `major`); requires an `NPM_TOKEN` secret with publish scope. The npm `package.json` `repository` field points back to this repo — the exact `repository_backlink` DSH's marketplace (`dshfind` / `deepseek1024`) verifies for installable listings.

---

## ❓ FAQ

<details>
<summary><b>Why is this repo "flattened"?</b></summary>

DSH's filesystem skill provider scans only **one level**: `<root>/<name>/SKILL.md`. Upstream nests skills as `skills/{category}/{name}/SKILL.md`, which DSH would never discover. This repo flattens that — and nothing else.

</details>

<details>
<summary><b>Why can't the model see some skills?</b></summary>

They carry `disable-model-invocation: true` upstream: interactive flows designed to be triggered by you, not auto-selected by the model. DSH injects their content when you name them in a prompt. Edit the frontmatter if you want one model-visible.

</details>

<details>
<summary><b>Directory bundle or npm plugin — which should I use?</b></summary>

- **Bundle** — cross-agent, hackable, instant updates via `git pull`. Best for tinkerers and multi-agent setups.
- **npm plugin** — one command, semver-managed, market-placeable. Best if you want managed installs in DSH.

</details>

<details>
<summary><b>Can I modify a skill?</b></summary>

Yes. Use `install.sh --copy` (or edit `skills/<name>/SKILL.md` directly) — files are yours. The daily auto-sync only commits when upstream content changes, so local edits survive as long as the upstream file doesn't change.

</details>

<details>
<summary><b>How do I publish a new npm version?</b></summary>

Add an `NPM_TOKEN` secret (publish scope) to the repo, then run the **release** workflow from the Actions tab and pick `patch` / `minor` / `major`. It syncs upstream first, bumps the version, publishes, and tags.

</details>

---

## 📄 License & Credits

**MIT.** Skill content © [Matt Pocock](https://github.com/mattpocock/skills); packaging by [sherlockmen](https://github.com/sherlockmen). See [LICENSE](./LICENSE).

- Upstream: [mattpocock/skills](https://github.com/mattpocock/skills)
- Built for: [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
- DSH skills docs: [docs/subsystems/skills.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.md)

<div align="center">

**⭐ Star this repo if you find it useful — it keeps the sync honest. ⭐**

</div>
