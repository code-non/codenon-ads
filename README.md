# Cards

Base branch for NFC card designs. It has no history in common with `main` (the ads); every card set branches off from here.

| Branch | What's in it |
|---|---|
| `cards` | This README. The root for every card branch. |
| `cards-typenodes-design` | TYPE: NODES NFC cards: 12 designs, front + back, with QR codes |
| `cards-codenon-design` | CODE: NON cards (not started yet) |

Start a new set with:

```sh
git switch cards
git switch -c cards-<name>
```

Branch names use a dash, not a slash: Git can't have both `cards` and `cards/<name>` as branch names.
