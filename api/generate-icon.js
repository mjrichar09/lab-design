// Vercel serverless function: POST {name, detail} -> {svg}
// Proxies Groq chat completions so GROQ_API_KEY never reaches the browser.
// Zero npm dependencies (Node 18+ global fetch). Env vars:
//   GROQ_API_KEY  (required) — from console.groq.com
//   GROQ_MODEL    (optional) — defaults below; swap here if Groq deprecates it

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-120b';
const MAX_NAME = 120, MAX_DETAIL = 400, MAX_SVG = 8000;

const SYSTEM_PROMPT = `You draw schematic equipment icons for an architectural floor-plan tool.
Return ONLY a single inline SVG element and nothing else - no markdown, no code fences, no explanation.

Hard requirements:
- Root element exactly: <svg viewBox="0 0 100 100" preserveAspectRatio="none"> ... </svg>
- TOP-DOWN / PLAN VIEW (bird's-eye), because this is a floor plan - never a side or 3D view.
- Blueprint-style line art: strokes only, thin uniform lines (stroke-width 1.5-2.5),
  fill="none" on shapes (fill="currentColor" allowed only for tiny solid detail dots).
- Use stroke="currentColor" on every stroked element so the app can recolor the icon
  per theme and per equipment category. Do NOT use hard-coded hex colors.
- Allowed elements only: rect, circle, ellipse, line, polyline, polygon, path, g.
- FORBIDDEN: text, script, foreignObject, image, use, style, animations, comments,
  and any href/xlink:href or url() reference.
- Keep the center of the icon relatively uncluttered (a name label is overlaid there).
- Fill most of the 100x100 box; simple, legible, recognizable from the equipment name.`;

function extractSvg(text) {
  const m = String(text || '').match(/<svg[\s\S]*?<\/svg>/i);
  if (!m) return null;
  const s = m[0];
  if (s.length > MAX_SVG) return null;
  // Hard server-side reject of unsafe payloads (client sanitizes again).
  if (/<script|<foreignObject|<image|<use|<text|<!--|<!DOCTYPE|javascript:|url\s*\(/i.test(s)) return null;
  if (/(?:xlink:)?href\s*=/i.test(s)) return null;
  return s;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }
  const key = process.env.GROQ_API_KEY;
  if (!key) { res.status(500).json({ error: 'Server not configured (GROQ_API_KEY missing)' }); return; }

  let body = req.body;
  if (!body || typeof body === 'string') { try { body = JSON.parse(body || '{}'); } catch { body = {}; } }
  const name = String(body.name || '').slice(0, MAX_NAME).trim();
  const detail = String(body.detail || '').slice(0, MAX_DETAIL).trim();
  if (!name && !detail) { res.status(400).json({ error: 'Nothing to draw' }); return; }

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;
  let r;
  try {
    r = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 1500,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Equipment: ${name}\nExtra detail: ${detail || '(none)'}` }
        ]
      })
    });
  } catch {
    res.status(502).json({ error: 'Groq unreachable' });
    return;
  }

  if (!r.ok) {
    const t = await r.text().catch(() => '');
    res.status(502).json({ error: `Groq error ${r.status}`, detail: t.slice(0, 300) });
    return;
  }
  const data = await r.json().catch(() => null);
  const raw = data && data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content : '';
  const svg = extractSvg(raw);
  if (!svg) { res.status(422).json({ error: 'Model did not return usable SVG — try again' }); return; }
  res.status(200).json({ svg, model });
};
