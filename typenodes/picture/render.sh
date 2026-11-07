#!/usr/bin/env bash
# Renders every ad-*.html in this folder to png/<name>.png with headless Edge (or Chrome).
# Usage: bash render.sh            (all ads)
#        bash render.sh ad-02      (only files whose name starts with ad-02)
cd "$(dirname "$0")"
BROWSER="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
[ -x "$BROWSER" ] || BROWSER="/c/Program Files/Google/Chrome/Application/chrome.exe"
mkdir -p png
for f in ${1:-ad-}*.html; do
  name="${f%.html}"
  h=1350; grep -q 'class="ad story"' "$f" && h=1920
  "$BROWSER" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=6000 --window-size=1080,$h \
    --screenshot="$(cygpath -w "$PWD/png/$name.png")" "file:///$(cygpath -m "$PWD/$f")" >/dev/null 2>&1
  echo "png/$name.png"
done
