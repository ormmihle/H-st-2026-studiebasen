# Legg til et nytt fag

Hvert fag er en egen mappe under `docs/`. Slik legger du til et nytt:

1. Lag en mappe, for eksempel `docs/exphil/`.
2. Lag `docs/exphil/index.md` med en kort oversikt over faget.
3. Legg notatene som egne `.md`-filer i samme mappe.
4. Legg PDF-er i `docs/exphil/pdf/`. Den mappen holdes utenfor Git automatisk.
5. Legg faget inn under `nav:` i `mkdocs.yml`:

```yaml
nav:
  - Forside: index.md
  - Ex.phil.:
      - exphil/index.md
      - Etikk: exphil/etikk.md
```

6. Legg til et fagkort på [forsiden](index.md).

!!! tip "Se endringene mens du skriver"
    Kjør `mkdocs serve` i prosjektmappen og åpne <http://127.0.0.1:8000>. Siden oppdateres hver gang du lagrer en fil.

## Nyttig Markdown

| Hva | Skriv |
|---|---|
| Boks med tips | `!!! tip "Tittel"` og innrykket tekst under |
| Sammenleggbar boks | `??? note "Tittel"` |
| Formel i teksten | `\( A = \mu / (\lambda + \mu) \)` |
| Formel på egen linje | `\[ ... \]` |
| Avkrysningsliste | `- [ ] gjøremål` |
