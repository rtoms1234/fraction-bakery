# Fraction Bakery

A fractions practice game for 4th grade (Math in Focus 4A, Chapter 6). One HTML file, no accounts, no backend required to play.

- `index.html` is the source page (artifact format, no doctype).
- `build.py` wraps it into `docs/index.html`, which GitHub Pages serves.
- `apps-script.gs` is the optional "home base": paste it into a Google Sheet's Apps Script editor and deploy it as a web app. The game then logs every finished level to the sheet and syncs progress by player name across devices.

## Rebuild after editing

```
python build.py "<apps script web app url>"
git add -A && git commit -m "update" && git push
```

GitHub Pages publishes from the `docs/` folder on `main`.
