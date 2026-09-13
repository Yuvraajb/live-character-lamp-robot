# Live Character Lamp Robot

A live, expressive character built around the supplied fictional 5-DOF lamp
robot, for the Human Computer Lab software challenge (see
[CHALLENGE.md](CHALLENGE.md), [SUBMISSION.md](SUBMISSION.md)).

It watches you through the laptop camera, listens through the mic, and
responds with coordinated motion, light, voice, sound effects, and music —
all running in a single browser tab, no server or API key required.

**Live demo:** https://yuvraajbhatterstarterpack.vercel.app
**Technical note:** [TECHNICAL_NOTE.pdf](TECHNICAL_NOTE.pdf) (architecture, protocol, measurements, known limitations — 2 pages)

## Quick start

The fastest path is the live demo link above — open it in **Google Chrome**,
allow camera and microphone access, then click anywhere on the page once (a
one-time browser requirement to unlock audio). Look at the camera to wake
the lamp up.

To run it locally instead (identical behavior — it's a static page):

```bash
git clone <this-repo-url>
cd yuvraaj_bhatter_starter_pack
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in Chrome.

## Setup on the Ubuntu 24.04 target

This is a browser app, not a native install — the only real dependency is
Chrome itself. On a clean Ubuntu 24.04 laptop (4 cores, 8 GB RAM, no GPU,
camera + mic + speakers, Wi-Fi):

```bash
# 1. Install real Google Chrome (not chromium-browser — see "Why Chrome" below)
curl -O https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt update && sudo apt install -y ./google-chrome-stable_current_amd64.deb

# 2. (Recommended) install a local TTS voice — a bare Ubuntu image ships none,
#    so spoken replies would otherwise be silent (captions still work either way)
sudo apt install -y espeak-ng

# 3a. Easiest: just open the live demo
google-chrome https://yuvraajbhatterstarterpack.vercel.app

# 3b. Or run from a local clone (no internet needed except for the CDN
#     libraries loaded on first run, and Chrome's speech-recognition calls)
git clone <this-repo-url> && cd yuvraaj_bhatter_starter_pack
python3 -m http.server 8080 &
google-chrome http://localhost:8080/
```

Grant camera and microphone permission when Chrome prompts. Click anywhere
on the page once to enable audio. That's the whole install.

### Why Chrome, specifically

Spoken interaction uses the Web Speech API's `SpeechRecognition`, which in
Chromium is wired to Google's cloud speech service via an embedded API key.
Stock `apt install chromium-browser` does **not** ship that key, so voice
input silently does nothing on it. Real Google Chrome does. Everything else
(vision, motion, light, scene memory, on-screen captions) works in any
Chromium-based browser; only the microphone path needs official Chrome.

### If replies are silent

Web Speech `speechSynthesis` on Linux defers to the OS speech stack, which a
bare Ubuntu image doesn't have. The page detects this and shows a one-time
caption ("No system TTS voice detected…") instead of failing silently —
`sudo apt install espeak-ng` (step 2 above) fixes it. Captions are always
shown regardless, so the interaction is followable either way.

## Using it

1. Open the page, grant camera/mic access, click once anywhere to enable sound.
2. Look at the camera. The lamp wakes up, turns to face you, and greets you
   out loud with a light pulse and a little musical sting.
3. Talk to it. A few things it understands:
   - "hi" / "how are you" / "bye" — small talk
   - Hold an object up to the camera, then ask **"what do you see?"**,
     **"what color is the `<object>`?"**, or **"where's the `<object>`?"**
   - **"look at the `<object>`"** / **"point at the `<object>`"** / **"find
     the `<object>`"** — goal-directed: it turns, actively scans the live
     camera feed, and reports whether it found it (COCO-SSD recognizes ~20
     common object classes — mugs, bottles, phones, books, keyboards, etc.)
4. Look away (or step out of frame) and it disengages back to an idle,
   sleeping pose after about a second.

## Dependencies

No build step, no package manager — everything is a pinned CDN `<script>` in
`robot/viewer/index.html`:

| Library | Version | Purpose |
|---|---|---|
| three.js | 0.128.0 | 3D rendering of the URDF-derived robot model |
| three.js STLLoader / OrbitControls | 0.128.0 | Lamp-shade mesh loading, dev camera orbit |
| TensorFlow.js | 4.20.0 | In-browser ML runtime (WebGL/WASM backend) |
| @tensorflow-models/blazeface | 0.1.0 | Face detection + landmarks (engagement) |
| @tensorflow-models/coco-ssd | 2.2.3 | Object detection (scene memory) |

Browser-native APIs used, no install required: `getUserMedia` (camera),
`SpeechRecognition` / `speechSynthesis` (Web Speech), Web Audio API
(synthesized SFX/music + the recorded lamp-hum loop).

## Repository layout

```
CHALLENGE.md, SUBMISSION.md   — the brief, as supplied
README.md                     — this file
TECHNICAL_NOTE.md / .pdf      — the 2-page technical note (submission deliverable)
index.html                    — redirects to robot/viewer/ for a clean root URL
robot/
  dummy_lamp_5dof.urdf        — supplied robot model (unmodified)
  dummy-lamp.png              — supplied reference image
  assets/
    lamp_shade.stl            — supplied mesh, loaded by the viewer
    freesound_community-...mp3 — ambient fluorescent-hum loop (filename implies
                                  Freesound as the source; exact sound page and
                                  license are unverified — confirm before
                                  distributing, see README note below)
  viewer/
    index.html                — the entire application (single file)
```

## Known limitations

See "Known limitations" in [TECHNICAL_NOTE.md](TECHNICAL_NOTE.md) — the
short version: the "attention" signal is head pose, not true eye gaze; the
webcam is fixed to the laptop bezel rather than head-mounted like the URDF's
`camera_link`; goal parsing covers ~20 object classes via a regex layer, not
open vocabulary; and voice input is Chrome-only. All disclosed deliberately,
not discovered by the grader.
