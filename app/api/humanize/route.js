export async function POST(request) {
  const { text, mode } = await request.json();
 
  if (!text || text.trim().length === 0) {
    return Response.json({ error: 'No text provided' }, { status: 400 });
  }
 
  const prompts = {
    light: "Lightly rewrite the following text to sound more natural and human. Keep most of the structure but smooth out robotic phrasing, vary sentence rhythm slightly, and add natural transitions where needed. Preserve the original meaning completely. Return only the rewritten text.",
    medium: "Rewrite the following text so it sounds like it was written by a thoughtful human. Use varied sentence lengths, natural transitions, occasional contractions, and a conversational but professional tone. Remove repetitive or overly formal phrasing. Preserve the original meaning completely. Return only the rewritten text.",
    heavy: "Completely rewrite the following text in a natural, engaging human voice. Restructure sentences freely, use vivid but simple language, add personality and warmth where appropriate, and eliminate all signs of AI-generated writing. Preserve the core meaning. Return only the rewritten text."
  };
 
  const systemPrompt = prompts[mode] || prompts.medium;
 
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2048,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ]
    })
  });
 
  const data = await response.json();
 
  if (data.error) {
    return Response.json({ error: data.error.message }, { status: 500 });
  }
 
  return Response.json({ result: data.choices[0].message.content });
}
 
