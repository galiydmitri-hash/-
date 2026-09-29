export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Ти — експерт з історії України. Користувач пише: "${prompt}". Якщо запит стосується пошуку, створення або додавання історичної теми, обов'язково викликай функцію create_topic. Передай у title коротку назву, у main — основну суть події/діяча, у secondary — детальний контекст (причини, хронологію, результати). Якщо це просто запитання або привітання — відповідай звичайним текстом.`
                }
              ]
            }
          ],
          tools: [
            {
              functionDeclarations: [
                {
                  name: 'create_topic',
                  description: 'Створює нову картку з історичною темою',
                  parameters: {
                    type: 'OBJECT',
                    properties: {
                      title: {
                        type: 'STRING',
                        description: 'Заголовок теми (наприклад, "Люблінська унія 1569")'
                      },
                      main: {
                        type: 'STRING',
                        description: 'Основна інформація (2-3 речення)'
                      },
                      secondary: {
                        type: 'STRING',
                        description: 'Детальна інформація, причини, ключові дати та наслідки'
                      }
                    },
                    required: ['title', 'main', 'secondary']
                  }
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0];

    if (candidate?.functionCall) {
      return res.status(200).json({
        functionCall: {
          name: candidate.functionCall.name,
          args: candidate.functionCall.args
        }
      });
    }

    return res.status(200).json({
      text: candidate?.text || 'Не вдалося обробити запит.'
    });

  } catch (error) {
    console.error('AI API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}