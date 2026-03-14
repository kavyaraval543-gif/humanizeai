export async function POST(request) {
  const { text, mode } = await request.json();

  if (!text || text.trim().length === 0) {
    return Response.json({ error: 'No text provided' }, { status: 400 });
  }

  const prompts = {
    light: `Rewrite the following text to sound like a real human wrote it. Follow every rule below:
- Use informal transitions like "honestly", "look", "here's the thing", "to be fair"
- Mix very short sentences with longer ones
- Use contractions everywhere (it's, we're, that's, don't, they've)
- Start some sentences with "And" or "But"
- Avoid all formal phrases like "furthermore", "moreover", "it is worth noting", "in conclusion"
- Write like someone typing a thoughtful message, not an essay

IMPORTANT - Human imperfections (do this naturally, not obviously):
- For every 150 words, add exactly 1 small spelling mistake a fast typist would make (like "recieve", "definately", "thier", "occured", "seperate")
- For every 150 words, add exactly 1 minor grammar slip real humans make (like missing a comma, "it's" vs "its" confusion, a mild run-on sentence)
- These mistakes should feel accidental and natural, not obvious

Return only the rewritten text, nothing else.`,

    medium: `Rewrite the following text so it sounds authentically human-written. Follow every rule:
- Write like a real person thinking out loud, not a polished essay
- Use very short sentences sometimes. Even fragments. For emphasis.
- Add personal asides like "and honestly?", "which is wild", "right?", "I think"
- Use informal connectors: "but yeah", "so basically", "the thing is", "look"
- Randomly vary paragraph length
- Start sentences with "And", "But", "So" occasionally
- Use contractions always
- Use everyday words ("use" not "utilize", "help" not "facilitate", "show" not "demonstrate")
- Avoid ALL formal academic phrasing

IMPORTANT - Human imperfections (weave in naturally):
- For every 120 words, include 1 realistic spelling mistake a human makes when typing fast (examples: "recieve", "definately", "occured", "seperate", "teh", "becuase")
- For every 120 words, include 1 natural grammar slip (examples: missing comma before "but", "less" instead of "fewer", a mild run-on sentence, "their" vs "there" once)
- Spread mistakes evenly, never cluster them together
- Mistakes must feel like genuine typos

Return only the rewritten text, nothing else.`,

    heavy: `Completely rewrite the following text so it's impossible to detect as AI-written. Follow every rule strictly:
- Write like a smart human typing casually but intelligently
- Use very irregular sentence lengths, some 3 words, some 30 words
- Start some sentences with "And", "But", "So", "Look", "Honestly"
- Add real human thinking: "I mean", "honestly", "here's the thing", "which makes sense when you think about it"
- Use em dashes, ellipses... and parentheses (like this) naturally
- Make paragraphs uneven and unstructured
- Include rhetorical questions like "right?" or "makes sense?"
- Use everyday vocabulary throughout
- Sound like a smart person writing a blog or LinkedIn post
- Zero formal academic transitions whatsoever

CRITICAL - Human imperfections (essential, do carefully):
- For every 100 words, add exactly 1 spelling mistake a fast typist makes (examples: "recieve", "definately", "occured", "seperate", "teh", "becuase", "enviroment", "relevent")
- For every 100 words, add exactly 1 grammar slip humans commonly make (examples: missing comma, "less people" instead of "fewer people", mild comma splice, "it's" vs "its" confusion)
- Distribute mistakes evenly across the whole text
- Mistakes must look like genuine fast-typing errors
- Do NOT make mistakes in the first or last sentence

Return only the rewritten text, nothing else.`
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

  if (data.error) return Response.json({ error: data.error.message }, { status: 500 });
  return Response.json({ result: data.choices[0].message.content });
}
