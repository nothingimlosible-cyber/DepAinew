export const config = { runtime: 'edge' };

export default async function handler(req) {
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });

  try {
    const { pesan } = await req.json();

    if (!process.env.DEEPSEEK_API_KEY) {
      return json({ error: 'DEEPSEEK_API_KEY belum diatur di Vercel' });
    }

    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Kamu adalah asisten AI. Jawab singkat dan jelas.' },
          { role: 'user', content: pesan }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await res.json();

    if (data.error) {
      return json({ error: 'DeepSeek Error: ' + data.error.message });
    }

    return json({ jawaban: data.choices[0].message.content });

  } catch (err) {
    return json({ error: 'Server Error: ' + err.message });
  }
}
