#!/usr/bin/env bash
# 从上游 mattpocock/skills 同步并扁平化技能,重建 .agents/skills 软链。
# 用法: bash scripts/update.sh          (本地或 CI 均可)
# 环境变量: UPSTREAM_REPO / UPSTREAM_REF 可覆盖上游地址与分支
set -euo pipefail

UPSTREAM_REPO="${UPSTREAM_REPO:-https://github.com/mattpocock/skills.git}"
UPSTREAM_REF="${UPSTREAM_REF:-main}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "==> 拉取上游 $UPSTREAM_REPO ($UPSTREAM_REF)"
git clone --depth 1 --branch "$UPSTREAM_REF" "$UPSTREAM_REPO" "$TMP/upstream" >/dev/null 2>&1
UPSTREAM_COMMIT="$(git -C "$TMP/upstream" rev-parse HEAD)"

echo "==> 扁平化 skills/{category}/{name}/ -> skills/{name}/ (DSH 只扫一层)"
rm -rf "$HERE/skills"
mkdir -p "$HERE/skills"
count=0
shopt -s nullglob
for dir in "$TMP"/upstream/skills/*/*/; do
  [ -f "$dir/SKILL.md" ] || continue
  name="$(basename "$dir")"
  if [ -e "$HERE/skills/$name" ]; then
    echo "!! 分类间重名冲突: $name,跳过(请人工处理)"
    continue
  fi
  cp -R "$dir" "$HERE/skills/$name"
  count=$((count + 1))
done

echo "==> 重建 .agents/skills 软链"
rm -rf "$HERE/.agents/skills"
mkdir -p "$HERE/.agents/skills"
for name in "$HERE"/skills/*/; do
  n="$(basename "$name")"
  ln -s "../../skills/$n" "$HERE/.agents/skills/$n"
done

echo "$UPSTREAM_COMMIT" > "$HERE/UPSTREAM_COMMIT"
echo "==> 完成: $count 个技能,上游 @ $UPSTREAM_COMMIT"
