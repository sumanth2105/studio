'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting anomalous bills (duplicate items, inflated costs).
 *
 * - detectAnomalousBills - A function that detects anomalies in medical bills.
 * - DetectAnomalousBillsInput - The input type for the detectAnomalousBills function.
 * - DetectAnomalousBillsOutput - The return type for the detectAnomalousBills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomalousBillsInputSchema = z.object({
  billDataUri: z
    .string()
    .describe(
      "A medical bill, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectAnomalousBillsInput = z.infer<typeof DetectAnomalousBillsInputSchema>;

const DetectAnomalousBillsOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether the bill is anomalous or not.'),
  explanation: z
    .string()
    .describe('The explanation of why the bill is considered anomalous.'),
});
export type DetectAnomalousBillsOutput = z.infer<typeof DetectAnomalousBillsOutputSchema>;

export async function detectAnomalousBills(
  input: DetectAnomalousBillsInput
): Promise<DetectAnomalousBillsOutput> {
  return detectAnomalousBillsFlow(input);
}

const detectAnomalousBillsPrompt = ai.definePrompt({
  name: 'detectAnomalousBillsPrompt',
  input: {schema: DetectAnomalousBillsInputSchema},
  output: {schema: DetectAnomalousBillsOutputSchema},
  prompt: `You are an expert fraud detection specialist for medical insurance claims. Review the following medical bill and determine if it contains any anomalies, such as duplicate items or inflated costs. Return whether the bill is anomalous or not and include a detailed explanation.

Medical Bill: {{media url=billDataUri}}`,
});

const detectAnomalousBillsFlow = ai.defineFlow(
  {
    name: 'detectAnomalousBillsFlow',
    inputSchema: DetectAnomalousBillsInputSchema,
    outputSchema: DetectAnomalousBillsOutputSchema,
  },
  async input => {
    const {output} = await detectAnomalousBillsPrompt(input);
    return output!;
  }
);
