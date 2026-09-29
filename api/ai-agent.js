const MODEL = 'gemini-2.5-flash';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt) return res.status(400).json({ error: 'Введіть запит.' });
  if (prompt.length > 8000) return res.status(413).json({ error: 'Запит задовгий (максимум 8000 символів).' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY не налаштовано.' });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text:
            `Ти — помічник з історії України. Запит користувача: ${prompt}\n` +
            'Якщо користувач просить знайти, створити або додати історичну тему, виклич create_topic. ' +
            'У title дай коротку назву, у main — головну суть у 2–3 реченнях, у secondary — контекст, причини, ключові дати та наслідки. ' +
            'Для звичайних запитань і привітань відповідай текстом українською. Не вигадуй факти.' }] }],
          tools: [{
            functionDeclarations: [{
              name: 'create_topic',
              description: 'Створює картку з історичною темою',
              parameters: {
                type: 'OBJECT',
                properties: {
                  title: { type: 'STRING', description: 'Коротка назва теми' },
                  main: { type: 'STRING', description: 'Основна інформація у 2–3 реченнях' },
                  secondary: { type: 'STRING', description: 'Контекст, причини, дати та наслідки' }
                },
                required: ['title', 'main', 'secondary']
              }
            }]
          }]
        })
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('Gemini API error:', data.error?.message || response.status);
      return res.status(502).json({ error: 'Сервіс AI не зміг обробити запит. Спробуйте пізніше.' });
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const call = parts.find(part => part.functionCall)?.functionCall;
    if (call) {
      return res.status(200).json({ functionCall: { name: call.name, args: call.args } });
    }
    const text = parts.map(part => part.text).filter(Boolean).join('\n').trim();
    return res.status(200).json({ text: text || 'Не вдалося отримати відповідь.' });
  } catch (error) {
    console.error('AI API request failed:', error);
    return res.status(500).json({ error: 'Внутрішня помилка сервера.' });
  }
}
