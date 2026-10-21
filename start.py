"""Starter Studiebasen lokalt på http://127.0.0.1:8000.

Kjør med dobbeltklikk, eller fra terminalen: py start.py (Windows) / python3 start.py.

Skriptet gjør bare tre ting:
  1. installerer MkDocs fra requirements.txt hvis det mangler,
  2. åpner nettleseren,
  3. starter nettsiden lokalt med «mkdocs serve».
"""

import importlib.util
import subprocess
import sys
import threading
import webbrowser
from pathlib import Path

ADRESSE = "http://127.0.0.1:8000"
MAPPE = Path(__file__).resolve().parent


def main() -> int:
    if importlib.util.find_spec("mkdocs") is None:
        print("Installerer MkDocs for første gang. Dette tar et minutt...")
        installert = subprocess.run(
            [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"],
            cwd=MAPPE,
        )
        if installert.returncode != 0:
            print("Installasjonen feilet. Se feilmeldingen over.")
            return 1

    print(f"\nStudiebasen kjører på {ADRESSE}")
    print("Lukk vinduet eller trykk Ctrl+C for å stoppe.\n")
    threading.Timer(3, webbrowser.open, args=[ADRESSE]).start()

    try:
        return subprocess.run(
            [sys.executable, "-m", "mkdocs", "serve", "-a", "127.0.0.1:8000"],
            cwd=MAPPE,
        ).returncode
    except KeyboardInterrupt:
        return 0


if __name__ == "__main__":
    kode = main()
    if kode != 0:
        input("Trykk Enter for å lukke.")
    sys.exit(kode)
