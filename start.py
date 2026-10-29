"""Starter Studiebasen lokalt i nettleseren.

Kjør med dobbeltklikk, eller fra terminalen: py start.py (Windows) / python3 start.py.

Skriptet gjør fire ting:
  1. lager et eget Python-miljø i mappen .venv første gang, så Studiebasen ikke deler
     pakker med andre prosjekter på maskinen,
  2. installerer MkDocs fra requirements.txt i det miljøet hvis det mangler,
  3. finner en ledig port (helst 8765), så siden ikke kolliderer med andre lokale servere,
  4. åpner nettleseren og starter nettsiden med «mkdocs serve».
"""

import os
import socket
import subprocess
import sys
import threading
import venv
import webbrowser
from pathlib import Path

MAPPE = Path(__file__).resolve().parent
MILJO = MAPPE / ".venv"
VERT = "127.0.0.1"
FORETRUKKET_PORT = 8765  # egen port, så Studiebasen ikke kolliderer med andre prosjekter på 8000


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


def klargjor_miljo() -> Path | None:
    python = miljo_python()
    if not python.exists():
        print("Lager et eget Python-miljø for Studiebasen (.venv). Dette skjer bare første gang...")
        venv.create(MILJO, with_pip=True)
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
        ).returncode
    except KeyboardInterrupt:
        return 0


if __name__ == "__main__":
    kode = main()
    if kode != 0:
        input("Trykk Enter for å lukke.")
    sys.exit(kode)
