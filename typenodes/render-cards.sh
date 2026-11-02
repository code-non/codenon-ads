#!/usr/bin/env bash
# Renders every card face in cards.html to png/cards/<id>.png (2022x1276, 600 dpi at CR80 trim, transparent corners).
# Usage: bash render-cards.sh          (all faces)
#        bash render-cards.sh d3       (only faces whose id starts with d3)
cd "$(dirname "$0")"
BROWSER="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
[ -x "$BROWSER" ] || BROWSER="/c/Program Files/Google/Chrome/Application/chrome.exe"
mkdir -p png/cards
for id in $(grep -oE 'id="d[0-9]+[a-z]?-(front|back)"' cards.html | cut -d'"' -f2 | grep "^${1:-d}"); do
  size=1011,638; grep -q "id=\"$id\" data-portrait" cards.html && size=638,1011
  "$BROWSER" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --default-background-color=00000000 --virtual-time-budget=6000 --window-size=$size \
    --screenshot="$(cygpath -w "$PWD/png/cards/$id.png")" "file:///$(cygpath -m "$PWD/cards.html")#$id" >/dev/null 2>&1
  echo "png/cards/$id.png"
done
