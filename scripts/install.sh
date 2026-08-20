#!/usr/bin/env bash
# 把本仓库的 skills 安装/更新到 DSH 的 skill 发现目录。
#
# 默认目标: ~/.agents/skills (用户级,所有项目可见)
# 其他目标: --target <dir>  (例如项目根 .agents/skills,仅该项目可见)
#
# 默认模式: 软链 (更新 = git pull,DSH 热加载即时生效,无需重启)
# 复制模式: --copy  (Windows / 想拥有独立副本时用;更新 = git pull 后重跑本脚本)
#
# 用法:
#   bash scripts/install.sh                 # 软链到 ~/.agents/skills
#   bash scripts/install.sh --copy          # 复制到 ~/.agents/skills
#   bash scripts/install.sh --target .agents/skills
set -euo pipefail

MODE="symlink"
TARGET="${DSH_SKILLS_TARGET:-$HOME/.agents/skills}"

while [ $# -gt 0 ]; do
  case "$1" in
    --copy) MODE="copy"; shift ;;
    --target) TARGET="$2"; shift 2 ;;
    --help|-h)
      echo "用法: $0 [--copy] [--target <dir>]"
      echo "  --copy        复制而非软链"
      echo "  --target <dir> 安装目标目录(默认 \$HOME/.agents/skills)"
      exit 0
      ;;
    *) echo "未知参数: $1 (--help 查看用法)"; exit 1 ;;
  esac
done

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$HERE/skills"
[ -d "$SRC" ] || { echo "未找到 skills/ 目录(先运行 scripts/update.sh)"; exit 1; }

mkdir -p "$TARGET"
installed=0
for dir in "$SRC"/*/; do
  [ -f "$dir/SKILL.md" ] || continue
  name="$(basename "$dir")"
  dest="$TARGET/$name"
  rm -rf "$dest"  # 幂等:覆盖旧的复制/软链
  if [ "$MODE" = "copy" ]; then
    cp -R "$dir" "$dest"
  else
    ln -s "$dir" "$dest"
  fi
  installed=$((installed + 1))
done

echo "已安装 $installed 个技能到 $TARGET ($MODE 模式)"
if [ "$MODE" = "symlink" ]; then
  echo "提示: 更新 = cd $HERE && git pull(DSH 热加载,无需重启)"
else
  echo "提示: 更新 = git pull 后重跑本脚本"
fi
