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
      Generate a multiple-choice quiz in strict JSON format based on the provided text passage. Follow these rules:

      - Total Questions: ${N}
      - Difficulty Distribution:
        - 50% Easy (Basic recall and factual understanding)
        - 33% Medium (Comprehension and minor application)
        - 10% Hard (Deep analysis and critical thinking)
        - 7% Out-of-the-Box (Conceptual depth & real-world application)

      Each question must have:
      - A clear and concise question.
      - Four answer choices (one correct answer and three plausible distractors).
      - No additional explanations or extra text—only return valid JSON.

      Text Content:
      ${query}

      Strict JSON Output Format:
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

      Instructions:
      - Ensure strictly valid JSON with no explanations, comments, or extra formatting.
      - Do not wrap the JSON in backticks or markdown formatting.
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
        response_format: { type: 'json_object' },
      });

      //   TODO :: we are getting response as string, we need to parse it to JSON to extract quiz items
      if (completion && completion.choices && completion.choices.length > 0) {
        try {
          const responseContent = completion.choices[0]?.message?.content;
          if (responseContent) {
            let responseContent =
              completion.choices[0]?.message?.content?.trim(); // Trim leading/trailing spaces

            // Remove backticks if they exist
            if (responseContent?.startsWith('```json')) {
              responseContent = responseContent
                .replace(/```json|```/g, '')
                .trim();
            }
            const parsedData = responseContent && JSON.parse(responseContent);
            return parsedData;
          } else {
            console.error('Empty response content.');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      } else {
        console.error('Invalid API response:', completion);
      }

      return null;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }
}
