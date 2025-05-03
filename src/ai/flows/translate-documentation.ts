'use server';
/**
 * @fileOverview A documentation translator AI agent.
 *
 * - translateDocumentation - A function that translates documentation into a target language.
 * - TranslateDocumentationInput - The input type for the translateDocumentation function.
 * - TranslateDocumentationOutput - The return type for the translateDocumentation function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const TranslateDocumentationInputSchema = z.object({
  text: z.string().describe('The documentation text to translate.'),
  targetLanguage: z.string().describe('The language code to translate the text into (e.g., "es" for Spanish).'),
});
export type TranslateDocumentationInput = z.infer<typeof TranslateDocumentationInputSchema>;

const TranslateDocumentationOutputSchema = z.object({
  translatedText: z.string().describe('The translated documentation text.'),
});
export type TranslateDocumentationOutput = z.infer<typeof TranslateDocumentationOutputSchema>;

export async function translateDocumentation(
  input: TranslateDocumentationInput
): Promise<TranslateDocumentationOutput> {
  return translateDocumentationFlow(input);
}

const translatePrompt = ai.definePrompt({
  name: 'translateDocumentationPrompt',
  input: {
    schema: TranslateDocumentationInputSchema,
  },
  output: {
    schema: TranslateDocumentationOutputSchema,
  },
  prompt: `You are a documentation translator. Translate the following documentation into {{targetLanguage}}.  
- **Preserve all Markdown syntax** (code fences, headings, lists…).  
- **Do not escape** backticks, ampersands, brackets, or other HTML/Markdown entities.  

"""  
{{text}}  
"""  

Return only the translated text without additional commentary.`,
});


const translateDocumentationFlow = ai.defineFlow<
  typeof TranslateDocumentationInputSchema,
  typeof TranslateDocumentationOutputSchema
>(
  {
    name: 'translateDocumentationFlow',
    inputSchema: TranslateDocumentationInputSchema,
    outputSchema: TranslateDocumentationOutputSchema,
  },
  async (input) => {
    const { output } = await translatePrompt(input);
    return output!;
  }
);
