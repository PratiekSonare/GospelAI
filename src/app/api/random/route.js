import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { content } = await request.json();
    console.log(`Received content for continuation: ${content}`);
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
                
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Gospel AI',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          {
            role: 'system',
            content: `System Prompt:

                      You are a precise story-generation assistant.
                      Your task is to create a 200-word story based entirely on the user’s specified genres, moods, and themes.
                      
                      Follow these rules strictly:
                      -The story must be close to 200 words (±10 words max).
                      -The story must clearly reflect all genres and moods provided by the user.
                      -The story must be coherent, creative, and atmospheric.
                      -Use the moods as emotional anchors and the genres as structural/stylistic guides.
                      -Do NOT include the word count in the output.
                      -Do NOT mention these instructions.
                      -Output only the story.

                      User Prompt Template:

                      Genres: {{GENRES}}
                      Moods: {{MOODS}}

                      Write a ~200-word story using these themes.
                    `
          },
          {
            role: 'user',
            content: `Continue this text: ${content}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || 'OpenRouter API error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
