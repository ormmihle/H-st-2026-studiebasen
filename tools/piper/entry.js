// Inngang for bunten: gjør Piper tilgjengelig som window.PiperTTS.
import { TtsSession, PATH_MAP } from "@mintplex-labs/piper-tts-web";
window.PiperTTS = { TtsSession, PATH_MAP };
