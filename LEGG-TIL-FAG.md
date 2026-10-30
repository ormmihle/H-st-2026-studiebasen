# Legg til et nytt fag

Hvert fag er en egen mappe under `docs/`. Slik legger du til et nytt:

1. Lag en mappe, for eksempel `docs/tma4432/`.
2. Lag `docs/tma4432/index.md` med en kort oversikt over faget.
3. Legg notatene som egne `.md`-filer i samme mappe.
4. Legg PDF-er i `docs/tma4432/pdf/`. Den mappen holdes utenfor Git automatisk. Lag gjerne en `LES-MEG.txt` der med filnavnene, slik de andre fagene har, så du vet hvilke filer lenkene forventer etter en ny `git clone`.
5. Legg faget inn under `nav:` i `mkdocs.yml`:

```yaml
nav:
  - Forside: index.md
  - Matematikk 4C:
      - tma4432/index.md
      - Laplacetransformen: tma4432/laplace.md
```

6. Legg til et fagkort på [forsiden](docs/index.md).
7. Har faget eksamen, legger du den inn i [eksamensoversikten](docs/eksamener.md), på forsiden og i `eksamener.ics`.

**Se endringene mens du skriver:** start siden med `start.py` og la vinduet stå åpent. Siden oppdateres hver gang du lagrer en fil. Adressen står i vinduet, vanligvis <http://127.0.0.1:8765>.

## Nyttig Markdown

| Hva | Skriv |
|---|---|
| Boks med tips | `!!! tip "Tittel"` og innrykket tekst under |
| Sammenleggbar boks | `??? note "Tittel"` |
| Formel i teksten | `\( A = \mu / (\lambda + \mu) \)` |
| Formel på egen linje | `\[ ... \]` |
| Avkrysningsliste | `- [ ] gjøremål` |
