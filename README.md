# Studiebasen

Mine studienotater som en lokal nettside, bygget med [MkDocs](https://www.mkdocs.org/) og temaet [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

## Kom i gang

Krever Python 3.9 eller nyere.

```bash
pip install -r requirements.txt
mkdocs serve
```

Åpne <http://127.0.0.1:8000>. Siden oppdateres automatisk når du lagrer en fil.

Vil du ha en ferdig mappe du kan åpne uten å kjøre noe, bygg siden og åpne `site/index.html`:

```bash
mkdocs build
```

> `requirements.txt` låser MkDocs til versjon 1.x, fordi MkDocs 2.0 ikke fungerer med Material-temaet.
>
> Søket virker bare via `mkdocs serve`, ikke når `site/index.html` åpnes direkte fra disk. Matteformler og diagrammer lastes fra nettet, så de krever internett.

## Struktur

```
studiebasen/
├── mkdocs.yml            # meny, tema og utvidelser
├── requirements.txt
├── docs/
│   ├── index.md          # forsiden
│   ├── legg-til-fag.md
│   ├── stylesheets/      # egne farger (risikomatrise, fagkort)
│   ├── javascripts/      # oppsett for matteformler
│   └── ttm4185/          # ett fag = én mappe
│       ├── index.md
│       ├── del-*.md      # forelesningsnotater
│       ├── ...
│       └── pdf/          # PDF-er, holdes utenfor Git
└── site/                 # bygget nettside, holdes utenfor Git
```

## PDF-er

Forelesninger og eksamensoppgaver er opphavsrettslig beskyttet og ligger derfor ikke i Git. Legg dem i `docs/<fag>/pdf/` med de originale filnavnene, så virker lenkene i notatene. Se `docs/ttm4185/pdf/LES-MEG.txt` for hvilke filer som hører hjemme der.

## Legg til et fag

Se [docs/legg-til-fag.md](docs/legg-til-fag.md), eller siden «Legg til fag» i menyen.

## GitHub

Bruk et **privat** repo:

```bash
git remote add origin git@github.com:<brukernavn>/studiebasen.git
git push -u origin main
```
