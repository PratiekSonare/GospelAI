import { NextResponse } from 'next/server';

interface RequestBody {
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface OpenRouterError {
  error?: {
    message?: string;
  };
}

export async function POST(request: Request) {
  try {
    const { content }: RequestBody = await request.json();
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
                        You are a precise story-writing assistant.
                        Your task is to create a 100-word open-ended story inspired by the user's input lines.
                        
                        Follow the rules strictly:
                        -The story must be exactly 100 words.
                        -It must be open-ended (no complete conclusion; leave anticipation).
                        -It must be coherent, creative, and natural.
                        -Do NOT include the word count in the output.
                        -Do NOT mention these rules.
                        -Do NOT repeat the user's input verbatim—adapt it naturally into the narrative.
                        -Do NOT repeat the user's input (STRICTLY)
                        -Output only the remaining story, without the input text from the user.

                        User Prompt Template:

                        Input lines:
                        {{USER_INPUT}}

                        Strictly continue the story starting from the input words.
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
      const errorData: OpenRouterError = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || 'OpenRouter API error' },
        { status: response.status }
      );
    }

    const data: OpenRouterResponse = await response.json();
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
