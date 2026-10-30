"""Starter Studiebasen lokalt i nettleseren.

Kjør med dobbeltklikk, eller fra terminalen: py start.py (Windows) / python3 start.py.

Skriptet gjør fire ting:
  1. lager et eget Python-miljø i mappen .venv første gang, så Studiebasen ikke deler
     pakker med andre prosjekter på maskinen. Er Python-versjonen for ny for MkDocs
     (3.15 eller nyere), brukes en eldre versjon via py-launcheren hvis du har den,
  2. installerer MkDocs fra requirements.txt i det miljøet hvis det mangler,
  3. finner en ledig port (helst 8765), så siden ikke kolliderer med andre lokale servere,
  4. åpner nettleseren og starter nettsiden med «mkdocs serve».
"""

import os
import shutil
import socket
import subprocess
import sys
import threading
import webbrowser
from pathlib import Path

MAPPE = Path(__file__).resolve().parent
MILJO = MAPPE / ".venv"
VERT = "127.0.0.1"
FORETRUKKET_PORT = 8765  # egen port, så Studiebasen ikke kolliderer med andre prosjekter på 8000
# PyYAML (som MkDocs trenger) har ennå ikke ferdigbygde pakker for Python 3.15 på Windows.
NYESTE_STOTTEDE = (3, 14)


def miljo_python() -> Path:
    if os.name == "nt":
        return MILJO / "Scripts" / "python.exe"
    return MILJO / "bin" / "python"


def har_mkdocs(python: Path) -> bool:
    sjekk = subprocess.run(
        [str(python), "-c", "import mkdocs, material"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return sjekk.returncode == 0


def versjon(python: list[str]) -> tuple[int, int] | None:
    svar = subprocess.run(
        [*python, "-c", "import sys; print(sys.version_info[0], sys.version_info[1])"],
        capture_output=True,
        text=True,
    )
    if svar.returncode != 0:
        return None
    hoved, minor = svar.stdout.split()
    return int(hoved), int(minor)


def python_for_miljo() -> list[str]:
    """Python-en som .venv skal lages med: den som kjører skriptet, eller en eldre via py-launcheren."""
    if sys.version_info[:2] <= NYESTE_STOTTEDE:
        return [sys.executable]
    if os.name == "nt" and shutil.which("py"):
        for minor in range(NYESTE_STOTTEDE[1], 9, -1):
            kandidat = ["py", f"-3.{minor}"]
            if versjon(kandidat) == (3, minor):
                print(f"Python {sys.version_info[0]}.{sys.version_info[1]} er for ny for MkDocs, så Studiebasen bruker Python 3.{minor}.")
                return kandidat
    print(
        f"Python {sys.version_info[0]}.{sys.version_info[1]} er trolig for ny for MkDocs. "
        "Installer Python 3.14 fra python.org hvis installasjonen feiler."
    )
    return [sys.executable]


def klargjor_miljo() -> Path | None:
    python = miljo_python()
    onsket = python_for_miljo()
    har, vil_ha = (versjon([str(python)]) if python.exists() else None), versjon(onsket)
    if har and vil_ha and har != vil_ha:
        print("Studiebasens Python-miljø (.venv) har feil Python-versjon, så det lages på nytt...")
        shutil.rmtree(MILJO)
    if not python.exists():
        print("Lager et eget Python-miljø for Studiebasen (.venv). Dette skjer bare første gang...")
        laget = subprocess.run([*onsket, "-m", "venv", str(MILJO)])
        if laget.returncode != 0 or not python.exists():
            print("Klarte ikke å lage Python-miljøet. Se feilmeldingen over.")
            return None
    if not har_mkdocs(python):
        print("Installerer MkDocs i Studiebasens eget miljø. Dette tar et minutt...")
        installert = subprocess.run(
            [str(python), "-m", "pip", "install", "-r", "requirements.txt"],
            cwd=MAPPE,
        )
        if installert.returncode != 0:
            print("Installasjonen feilet. Se feilmeldingen over.")
            return None
    return python


def ledig_port(start: int = FORETRUKKET_PORT, antall: int = 50) -> int | None:
    for port in range(start, start + antall):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind((VERT, port))
            except OSError:
                continue
            return port
    return None


def main() -> int:
    python = klargjor_miljo()
    if python is None:
        return 1

    port = ledig_port()
    if port is None:
        print(f"Fant ingen ledig port mellom {FORETRUKKET_PORT} og {FORETRUKKET_PORT + 49}.")
        return 1
    adresse = f"http://{VERT}:{port}"
    if port != FORETRUKKET_PORT:
        print(f"Port {FORETRUKKET_PORT} er opptatt av et annet program, så Studiebasen bruker {port} i stedet.")

    print(f"\nStudiebasen kjører på {adresse}")
    print("Lukk vinduet eller trykk Ctrl+C for å stoppe.\n")
    threading.Timer(3, webbrowser.open, args=[adresse]).start()

    try:
        return subprocess.run(
            [str(python), "-m", "mkdocs", "serve", "-a", f"{VERT}:{port}"],
            cwd=MAPPE,
            # Skjul Material-temaets advarsel om MkDocs 2.0; requirements.txt låser MkDocs under 2.
            env={**os.environ, "NO_MKDOCS_2_WARNING": "1"},
        ).returncode
    except KeyboardInterrupt:
        return 0


if __name__ == "__main__":
    kode = main()
    if kode != 0:
        input("Trykk Enter for å lukke.")
    sys.exit(kode)
