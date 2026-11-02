# Cards

NFC card designs, CR80 (85.6 × 54 mm, the same size as ATM and credit cards). This branch has no history in common with `main` (the ads); it collects every card set, and each set is worked on in its own branch first.

| Folder | What's in it | Worked on in |
|---|---|---|
| `typenodes/` | TYPE: NODES client cards: members, cafés, gyms, events, tiers | `cards-typenodes-design` |
| `codenon/` | CODE: NON founder business cards: 18 Null & Void pairs | `cards-codenon-design` |

Open a folder's `cards.html` in a browser to see every design. `bash <folder>/render-cards.sh` re-renders the PNGs. The CODE: NON page also has a founder-name switcher, a titles toggle and PDF export (card size or A4 proof); ready-made PDFs are in `codenon/pdf/`.

Start a new set with:

```sh
git switch cards
git switch -c cards-<name>
```

then put its files in a `<name>/` folder and merge the branch back into `cards`. Branch names use a dash, not a slash: Git can't have both `cards` and `cards/<name>` as branch names.
