# Fraction Bakery

A 4th grade math practice game: fractions (Math in Focus 4A, Chapter 6) plus the Speed Oven for times tables and division fluency. One HTML file, no accounts, no backend required to play.

The Speed Oven tracks every fact (7 × 8 stored once for both orders) with a Leitner-style box for multiplication and one for division. Answered fast (under 4 s, 5 s for division) moves the box up; wrong or timed out drops it to 0, shows the answer, has her say and type it, and re-queues the fact two questions later. A fact counts as "known" at box 3. Progress and session rows go to the same Google Sheet as the fraction stations (station "Times Tables" or "Oven Rush").

- `index.html` is the source page (artifact format, no doctype).
- `build.py` wraps it into `docs/index.html`, which GitHub Pages serves.
- `apps-script.gs` is the optional "home base": paste it into a Google Sheet's Apps Script editor and deploy it as a web app. The game then logs every finished level to the sheet and syncs progress by player name across devices.

## Rebuild after editing

```
python build.py "<apps script web app url>"
git add -A && git commit -m "update" && git push
```

GitHub Pages publishes from the `docs/` folder on `main`.
