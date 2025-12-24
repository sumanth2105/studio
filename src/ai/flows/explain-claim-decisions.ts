'use server';

/**
 * @fileOverview This file contains the Genkit flow for generating explanations for claim approvals and rejections.
 *
 * - explainClaimDecision - A function that generates explanations for claim decisions based on input data.
 * - ExplainClaimDecisionInput - The input type for the explainClaimDecision function.
 * - ExplainClaimDecisionOutput - The return type for the explainClaimDecision function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainClaimDecisionInputSchema = z.object({
  holderTrustScore: z
    .number()
    .describe('The trust score of the insurance holder (0-100).'),
  hospitalTrustScore: z
    .number()
    .describe('The trust score of the hospital (0-100).'),
  policyActive: z.boolean().describe('Whether the insurance policy is active.'),
  claimAmount: z.number().describe('The amount of the claim.'),
  safetyCap: z.number().describe('The predefined safety cap for auto-approval.'),
  fraudFlags: z.boolean().describe('Whether there are any fraud flags raised.'),
  autoApprove: z
    .boolean()
    .describe(
      'Whether the claim was auto-approved or not. True if auto-approved, false otherwise.'
    ),
  medicalDocuments: z
    .string()
    .describe('A text summary of the medical documents.'),
  bills: z.string().describe('A text summary of the bills.'),
  doctorNotes: z.string().describe('A text summary of the doctor notes.'),
});

export type ExplainClaimDecisionInput = z.infer<
  typeof ExplainClaimDecisionInputSchema
>;

const ExplainClaimDecisionOutputSchema = z.object({
  explanation: z.string().describe('The explanation for the claim decision.'),
});

export type ExplainClaimDecisionOutput = z.infer<
  typeof ExplainClaimDecisionOutputSchema
>;

export async function explainClaimDecision(
  input: ExplainClaimDecisionInput
): Promise<ExplainClaimDecisionOutput> {
  return explainClaimDecisionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainClaimDecisionPrompt',
  input: {schema: ExplainClaimDecisionInputSchema},
  output: {schema: ExplainClaimDecisionOutputSchema},
  prompt: `You are an AI assistant that generates explanations for insurance claim decisions.

  Based on the following information, explain why the claim was approved or rejected. Be concise and easy to understand.  Include key factors that influenced the decision.

  Holder Trust Score: {{{holderTrustScore}}}
  Hospital Trust Score: {{{hospitalTrustScore}}}
  Policy Active: {{{policyActive}}}
  Claim Amount: {{{claimAmount}}}
  Safety Cap: {{{safetyCap}}}
  Fraud Flags: {{{fraudFlags}}}
  Auto Approve: {{{autoApprove}}}
  Medical Documents: {{{medicalDocuments}}}
  Bills: {{{bills}}}
  Doctor Notes: {{{doctorNotes}}}

  Explanation:`,
});

const explainClaimDecisionFlow = ai.defineFlow(
  {
    name: 'explainClaimDecisionFlow',
    inputSchema: ExplainClaimDecisionInputSchema,
    outputSchema: ExplainClaimDecisionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
