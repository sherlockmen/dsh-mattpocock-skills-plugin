# dsh-mattpocock-skills

[Matt Pocock's agent skills](https://github.com/mattpocock/skills) (MIT), packaged for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) as **both**:

1. a portable **SKILL.md directory bundle** (`skills/` + `.agents/skills/`) — works in any agent that understands the `SKILL.md` convention (DSH, Claude Code, Cursor, Codex, …), and
2. an **npm plugin** (`dsh-mattpocock-skills`) — one-command install into a DSH profile, updateable via `dsh plugin update`.

No code is modified upstream: this repo is a **flattened, auto-synced snapshot** of `mattpocock/skills` plus a thin registration plugin.

---

## Why flattening?

DSH's filesystem skill provider scans **one level deep** only: `<root>/<name>/SKILL.md` or `<root>/<name>.md` ([docs/subsystems/skills.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.md)). The upstream repo nests skills as `skills/{category}/{name}/SKILL.md`, which DSH would not discover. This repo flattens that to `skills/{name}/SKILL.md` — nothing else is changed.

All 35 skills pass DSH's parsing rules (kebab-case `name` + `description` frontmatter; `disable-model-invocation` is honored).

---

## Directory layout

```
.
├── skills/<name>/SKILL.md      # canonical flattened skills (also shipped inside the npm package)
├── .agents/skills/<name>       # symlinks -> ../../skills/<name> (git-side convention root)
├── lib/index.js                # thin Cordis plugin: registers skills via ctx.skills.register()
├── cordis.patch.yml            # bundle patch for profile composition
├── scripts/update.sh           # sync upstream -> flatten -> rebuild symlinks
├── scripts/install.sh          # one-command install/update into ~/.agents/skills
├── scripts/check.mjs           # validate frontmatter against DSH rules
├── UPSTREAM_COMMIT             # pinned upstream commit of the current snapshot
└── .github/workflows/          # sync-upstream (daily) + release (manual npm publish)
```

---

## Install

### Option A — directory bundle (no npm, works in any agent)

```bash
git clone https://github.com/sherlockmen/dsh-mattpocock-skills-plugin.git
cd dsh-mattpocock-skills-plugin
bash scripts/install.sh            # symlink into ~/.agents/skills (all projects)
# or: bash scripts/install.sh --copy          # copy (Windows-friendly)
# or: bash scripts/install.sh --target .agents/skills   # one project only
```

DSH picks up the skills automatically (hot-reload, no restart).

### Option B — npm plugin (DSH only, one command)

```bash
dsh plugin --profile <name> add dsh-mattpocock-skills
```

Restart DSH. The plugin registers all 35 skills at runtime.

---

## Update

Upstream updates often. This repo auto-syncs **daily** via GitHub Actions, so the latency is at most one day. Your side:

| Your install mode | Update command |
|---|---|
| Symlink (`install.sh` default) | `cd <repo> && git pull` — **takes effect immediately**, no restart |
| Copy (`install.sh --copy`) | `git pull` then re-run `bash scripts/install.sh --copy` |
| npm plugin | `dsh plugin --profile <name> update dsh-mattpocock-skills`, restart |

No real-time sync is required; you decide when to pull/publish.

---

## Which skills are visible to the model?

Upstream marks **20 of 35** skills `disable-model-invocation: true` — they are interactive workflows (grilling, spec/ticket flows, …) meant to be triggered deliberately. DSH honors this:

- **15 skills** appear in the model's skill catalog: `code-review`, `codebase-design`, `diagnosing-bugs`, `domain-modeling`, `git-guardrails-claude-code`, `grilling`, `migrate-to-shoehorn`, `prototype`, `research`, `resolving-merge-conflicts`, `scaffold-exercises`, `setup-pre-commit`, `tdd`, `wizard`, `writing-for-agents`.
- **20 skills** stay out of the model catalog, but DSH injects their content when **you** name them in a prompt (e.g. "use grill-me") — matching upstream's intent. To make one model-visible, edit its `SKILL.md` frontmatter and remove `disable-model-invocation: true` (or delete that line in `skills/<name>/SKILL.md`).

### Caveats

- Many skills reference Claude-specific mechanics (`agents/` sub-agent prompt files, `/setup-matt-pocock-skills`, `docs/agents/issue-tracker.md`). They still load fine in DSH — the model can read the referenced files via the skill's resource directory — but those flows were written for Claude Code's agent model and may need light adaptation.
- `misc/` and `in-progress/` skills are included as-is; upstream does not ship them in its Claude Code plugin manifest.

---

## Skills

**engineering (18):** ask-matt, code-review, codebase-design, diagnosing-bugs, domain-modeling, grill-with-docs, implement, improve-codebase-architecture, prototype, research, resolving-merge-conflicts, setup-matt-pocock-skills, tdd, to-spec, to-tickets, triage, wayfinder, wizard

**productivity (7):** grill-me, grilling, handoff, teach, to-questionnaire, wait-what, writing-for-agents

**misc (4):** git-guardrails-claude-code, migrate-to-shoehorn, scaffold-exercises, setup-pre-commit

**in-progress (6):** claude-handoff, loop-me, setup-ts-deep-modules, writing-beats, writing-fragments, writing-shape

---

## Development

```bash
bash scripts/update.sh      # pull upstream, flatten, rebuild symlinks (idempotent)
npm install && npm run check  # validate frontmatter against DSH rules
```

- `.github/workflows/sync-upstream.yml` — daily + manual sync; commits only when content changed.
- `.github/workflows/release.yml` — manual npm release (`patch`/`minor`/`major`); requires a `NPM_TOKEN` secret with publish scope. The npm `package.json` `repository` field points back at this repo, which is what DSH's marketplace (`dshfind`, `deepseek1024`) checks as a `repository_backlink` for installable listings.

---

## License & attribution

MIT. Skill content © Matt Pocock ([mattpocock/skills](https://github.com/mattpocock/skills)); packaging by sherlockmen. See [LICENSE](./LICENSE).
