// Vercel serverless function: POST layout JSON -> {text} plain-English AI review.
// Proxies Groq chat completions so GROQ_API_KEY never reaches the browser.
// Zero npm dependencies (Node 18+ global fetch). Env vars:
//   GROQ_API_KEY  (required) — from console.groq.com
//   GROQ_MODEL    (optional) — defaults below; shared with generate-icon.js

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-120b';
const MAX_PAYLOAD = 20000;

const SYSTEM_PROMPT = `You are a senior process-architecture reviewer for biopharma upstream cell-culture labs.
You are given a JSON description of a to-scale equipment floor plan: room size, equipment (names, categories, sizes, x/y positions in feet), the daily walking paths with distance per day, and any detected clearance/egress issues.

Review the layout and point out concrete things to consider. Cover:
- Walking efficiency: which paths dominate the daily distance, and which equipment could sit closer together to cut it.
- Clearance & egress: narrow aisles, overlaps, and anything blocking a door/exit (use clearance_issues; name the items).
- Adjacency & process flow: equipment that should be near each other (a bioreactor and its ATF, a scale beside its tank, analytics near sampling) and whether the arrangement supports a sensible clean-to-dirty / unidirectional flow.

Rules:
- Reference equipment by their given names. Be specific and actionable.
- Use only the data provided; do not invent equipment, dimensions, or numbers.
- Be concise: markdown with "## " section headings and "- " bullets, 120-220 words. No preamble, no closing pleasantries.`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }
  const key = process.env.GROQ_API_KEY;
  if (!key) { res.status(500).json({ error: 'Server not configured (GROQ_API_KEY missing)' }); return; }

  let body = req.body;
  if (!body || typeof body === 'string') { try { body = JSON.parse(body || '{}'); } catch { body = {}; } }
  if (!body || !body.equipment) { res.status(400).json({ error: 'Missing layout data' }); return; }

  let payload = JSON.stringify(body);
  if (payload.length > MAX_PAYLOAD) payload = payload.slice(0, MAX_PAYLOAD);

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;
  let r;
  try {
    r = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens: 900,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: 'Layout JSON:\n' + payload }
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
  const text = data && data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content : '';
  if (!text) { res.status(422).json({ error: 'No review returned — try again' }); return; }
  res.status(200).json({ text, model });
};
