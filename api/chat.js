export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { personaContext, chatHistory, userMessage, model, maxTokens, temperature } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: personaContext },
        ...(chatHistory || []),
        { role: 'user', content: userMessage },
      ],
      max_tokens: maxTokens || 512,
      temperature: temperature || 0.7,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    return res.status(response.status).json({ error: data });
  }
  res.status(200).json({ message: data.choices?.[0]?.message?.content?.trim() || '' });
}