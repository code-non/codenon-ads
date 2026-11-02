#!/usr/bin/env bash
# Renders every card face in cards.html to PNG (2022x1276, 600 dpi at CR80 trim, transparent corners).
# Usage: bash render-cards.sh            (all faces, founder named Alteisen -> png/cards/)
#        bash render-cards.sh n1         (only faces whose id starts with n1)
#        bash render-cards.sh n 2        (founder faces with name #2, Persönlichkeit -> png/cards/persoenlichkeit/)
cd "$(dirname "$0")"
BROWSER="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
[ -x "$BROWSER" ] || BROWSER="/c/Program Files/Google/Chrome/Application/chrome.exe"
SLUGS=(alteisen weissritter persoenlichkeit)
n=${2:-0}
out=png/cards; [ "$n" != 0 ] && out=png/cards/${SLUGS[$n]}
mkdir -p "$out"
for id in $(grep -oE 'id="[a-z]+[0-9]+[a-z]?-(front|back)"' cards.html | cut -d'"' -f2 | grep "^${1:-}"); do
  size=1011,638; grep -q "id=\"$id\" data-portrait" cards.html && size=638,1011
  "$BROWSER" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --default-background-color=00000000 --virtual-time-budget=6000 --window-size=$size \
    --screenshot="$(cygpath -w "$PWD/$out/$id.png")" "file:///$(cygpath -m "$PWD/cards.html")?n=$n#$id" >/dev/null 2>&1
  echo "$out/$id.png"
done
