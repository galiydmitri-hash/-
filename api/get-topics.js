import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const topics = await sql`SELECT id, title, main, secondary FROM topics ORDER BY created_at ASC`;
    
    return res.status(200).json(topics);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
