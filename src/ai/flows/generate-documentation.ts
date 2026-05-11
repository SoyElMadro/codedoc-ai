'use server';
/**
 * @fileOverview A code documentation generator AI agent.
 *
 * - generateDocumentation - A function that generates documentation for code.
 * - GenerateDocumentationInput - The input type for the generateDocumentation function.
 * - GenerateDocumentationOutput - The return type for the generateDocumentation function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateDocumentationInputSchema = z.object({
  code: z.string().describe('The code to generate documentation for.'),
});
export type GenerateDocumentationInput = z.infer<typeof GenerateDocumentationInputSchema>;

const GenerateDocumentationOutputSchema = z.object({
  documentation: z.string().describe('The generated markdown documentation.'),
});
export type GenerateDocumentationOutput = z.infer<typeof GenerateDocumentationOutputSchema>;

export async function generateDocumentation(input: GenerateDocumentationInput): Promise<GenerateDocumentationOutput> {
  return generateDocumentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDocumentationPrompt',
  input: {
    schema: z.object({
      code: z.string().describe('The code to generate documentation for.'),
    }),
  },
  output: {
    schema: z.object({
      documentation: z.string().describe('The generated documentation for the code.'),
    }),
  },
  prompt: `
You are an expert software documentation generator.

Analyze the provided code and generate:
- A clear explanation
- Function descriptions
- Parameter descriptions
- Return values
- Usage examples if applicable

Code:
{{code}}`,
});

const generateDocumentationFlow = ai.defineFlow<
  typeof GenerateDocumentationInputSchema,
  typeof GenerateDocumentationOutputSchema
>(
  {
    name: 'generateDocumentationFlow',
    inputSchema: GenerateDocumentationInputSchema,
    outputSchema: GenerateDocumentationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
