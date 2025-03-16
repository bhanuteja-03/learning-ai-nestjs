import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class DeepseekService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: 'REPLACE WITH DEEPSEEK KEY FROM NOTES',
      //   defaultHeaders: {
      //     'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
      //     'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
      //   },
    });
  }

  async chat(query: string, N: string): Promise<string | null> {
    const prompt = `
      I will provide a passage of text and the number of questions needed. Generate a multiple-choice quiz in **strict JSON format**, ensuring the difficulty levels are distributed as follows:

        - **50% Easy Questions** (Basic recall and factual understanding)
        - **33% Medium Questions** (Requires comprehension and minor application)
        - **10% Hard Questions** (Requires deep analysis and critical thinking)
        - **7% Out-of-the-Box Questions** (Encourage conceptual depth and real-world application)

        The total number of questions required is **${N}**.

        Ensure each question has:
        - **Four answer choices**, with **one correct answer**.
        - **Plausible distractors** that require understanding to differentiate from the correct answer.
        - **No additional explanations or text—strictly return valid JSON.**

        **Text Content:**  
        ${query}

        **Output Format Example:**  
        (If N = ${N}, generate this many questions with the correct distribution)

        Return strictly valid JSON formatted as:
        {
            "quiz": [
            {
                "difficulty": "easy",
                "question": "Sample easy question?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option B"
            },
            {
                "difficulty": "medium",
                "question": "Sample medium question?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option C"
            },
            {
                "difficulty": "hard",
                "question": "Sample hard question?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option A"
            },
            {
                "difficulty": "out-of-the-box",
                "question": "Sample out-of-the-box question?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option D"
            }
            ]
        }
        
        Return **strictly valid JSON without any explanations**.
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      //   TODO :: we are getting response as string, we need to parse it to JSON to extract quiz items

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }
}
