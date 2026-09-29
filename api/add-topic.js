import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, title, main, secondary } = req.body || {};
  if (![id, title, main, secondary].every(value => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ error: 'Потрібні id, title, main та secondary.' });
  }
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL не налаштовано.' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO topics (id, title, main, secondary)
      VALUES (${id.trim()}, ${title.trim()}, ${main.trim()}, ${secondary.trim()})
    `;
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error('Database insert error:', error);
    return res.status(500).json({ error: 'Не вдалося зберегти тему.' });
  }
}
