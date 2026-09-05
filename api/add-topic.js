import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, title, main, secondary } = req.body;
    const sql = neon(process.env.DATABASE_URL);
    
    // Записываем новую тему в базу данных
    await sql`
      INSERT INTO topics (id, title, main, secondary) 
      VALUES (${id}, ${title}, ${main}, ${secondary})
    `;
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
