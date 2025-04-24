// src/ai/flows/improve-documentation.ts
'use server';

/**
 * @fileOverview A flow that suggests improvements to code documentation.
 *
 * - improveDocumentation - A function that takes code and existing documentation and suggests improvements.
 * - ImproveDocumentationInput - The input type for the improveDocumentation function.
 * - ImproveDocumentationOutput - The return type for the improveDocumentation function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const ImproveDocumentationInputSchema = z.object({
  code: z.string().describe('The code to improve documentation for.'),
  existingDocumentation: z
    .string()
    .describe('The existing documentation for the code.'),
});

export type ImproveDocumentationInput = z.infer<
  typeof ImproveDocumentationInputSchema
>;

const ImproveDocumentationOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('Suggestions for improving the code documentation.'),
});

export type ImproveDocumentationOutput = z.infer<
  typeof ImproveDocumentationOutputSchema
>;

export async function improveDocumentation(
  input: ImproveDocumentationInput
): Promise<ImproveDocumentationOutput> {
  return improveDocumentationFlow(input);
}

const improveDocumentationPrompt = ai.definePrompt({
  name: 'improveDocumentationPrompt',
  input: {
    schema: z.object({
      code: z.string().describe('The code to improve documentation for.'),
      existingDocumentation: z
        .string()
        .describe('The existing documentation for the code.'),
    }),
  },
  output: {
    schema: z.object({
      suggestions: z
        .string()
        .describe('Suggestions for improving the code documentation.'),
    }),
  },
  prompt: `You are an AI documentation expert. Review the existing documentation and code, and give suggestions on how to improve it. Focus on clarity, completeness, and correctness.

Code:
{{code}}

Existing Documentation:
{{existingDocumentation}}

Suggestions:
`,
});

const improveDocumentationFlow = ai.defineFlow<
  typeof ImproveDocumentationInputSchema,
  typeof ImproveDocumentationOutputSchema
>({
  name: 'improveDocumentationFlow',
  inputSchema: ImproveDocumentationInputSchema,
  outputSchema: ImproveDocumentationOutputSchema,
},
async input => {
  const { output } = await improveDocumentationPrompt(input);
  return output!;
});
