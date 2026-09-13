// Copy this file to config.local.js (gitignored, never committed) and fill
// in a real key to enable the Gemini-powered layer: open-vocabulary
// conversation, goal understanding, and "remember this" object recall.
// Get a free key at https://aistudio.google.com/apikey -- but the free
// tier for the current Flash model is genuinely small (20 requests/DAY per
// project, confirmed by hitting it during testing), not just rate-limited.
// Fine for local exploration, not for sustained use.
//
// Without this file (or with GEMINI_API_KEY left empty), everything still
// works via the regex/COCO-SSD fallback in robot/viewer/index.html -- this
// is a pure enhancement, not a requirement. See TECHNICAL_NOTE.md §2 & §5.
window.GEMINI_API_KEY = '';
