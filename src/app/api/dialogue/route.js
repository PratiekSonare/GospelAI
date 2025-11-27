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
        model: 'x-ai/grok-4.1-fast:free',
        messages: [
          {
            role: 'system',
            content: `System Prompt:
                        You are a precise dialogue-completion assistant.
                        Your task is to complete a sentence or dialogue using the context provided by the user.
                        
                        Follow these rules strictly:
                        -Complete only the missing part indicated by the user (e.g., inside brackets).
                        -Maintain the tone, intent, and context of the given lines.
                        -Keep the completion natural, coherent, and contextually appropriate.
                        -Avoid adding extra sentences beyond the needed continuation.   
                        -Do NOT alter the user’s text except for the required completion.
                        -Do NOT include explanations—output only the completed sentence or dialogue.
                        -Do NOT repeat the user's input (STRICTLY)
                        -Output only the remaining story, without the input text from the user.
                        
                        User Prompt Template:
                        Context:
                        {{USER_INPUT}}

                        Strictly complete the sentence/dialogue starting from the input words.
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
