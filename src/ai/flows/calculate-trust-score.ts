
'use server';

/**
 * @fileOverview This file defines a Genkit flow for calculating a dynamic trust score for an insurance holder.
 *
 * - calculateTrustScore - A function that calculates the trust score based on user data.
 * - CalculateTrustScoreInput - The input type for the calculateTrustScore function.
 * - CalculateTrustScoreOutput - The return type for the calculateTrustScore function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateTrustScoreInputSchema = z.object({
  verification: z.object({
    aadhaar: z.boolean(),
    pan: z.boolean(),
    mobile: z.boolean(),
    policyDocument: z.boolean(),
    bankProof: z.boolean(),
    uploadedRequiredDocuments: z.boolean(),
  }),
  policy: z.object({
    status: z.string(),
    tenureMonths: z.number(),
    premiumOverdueDays: z
      .number()
      .describe('Number of days the last premium is overdue. 0 if not overdue.'),
  }),
  paymentHistory: z.object({
    onTimeRatio: z.number(),
  }),
  claimHistory: z.object({
    totalClaims: z.number(),
    rejectedClaims: z.number(),
  }),
  fraudIndicators: z.object({
    pastFraudAlerts: z.boolean(),
    activeInvestigation: z.boolean(),
  }),
});

export type CalculateTrustScoreInput = z.infer<
  typeof CalculateTrustScoreInputSchema
>;

const CalculateTrustScoreOutputSchema = z.object({
  score: z.number().describe('The calculated trust score between 20 and 90.'),
  category: z
    .string()
    .describe(
      'The risk category (e.g., Highly Trusted, Trusted, Moderate Risk, High Risk).'
    ),
  explanation: z
    .array(z.string())
    .describe(
      'An array of 3-5 bullet points explaining the key factors that influenced the score.'
    ),
  suggestions: z
    .array(z.string())
    .describe(
      'An array of 2-3 actionable suggestions for the user to improve their score.'
    ),
});

export type CalculateTrustScoreOutput = z.infer<
  typeof CalculateTrustScoreOutputSchema
>;

export async function calculateTrustScore(
  input: CalculateTrustScoreInput
): Promise<CalculateTrustScoreOutput> {
  return calculateTrustScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateTrustScorePrompt',
  input: { schema: z.object({ jsonData: z.string() }) },
  output: { schema: CalculateTrustScoreOutputSchema },
  prompt: `You are a sophisticated risk assessment engine for an insurance platform. Your task is to analyze the provided JSON data for a policyholder and determine their Trust Score.

  The score should be between 20 and 90.

  Analyze the data holistically. The weightage of factors is as follows:
  - Identity & Document Verification: High Importance. Completeness here is a strong positive signal. Especially consider if 'uploadedRequiredDocuments' is true.
  - Payment History & Delays: High Importance. A 'premiumOverdueDays' greater than 30 is a significant negative factor. Consistent on-time payments boost the score.
  - Policy Health & Tenure: Medium Importance. A long-standing, active policy is favorable.
  - Claim History: Medium Importance. A low number of claims, especially rejected ones, is positive.
  - Fraud Indicators: Critical Importance. Any positive fraud indicators should heavily penalize the score.

  **IMPORTANT FINAL RULE:** The final calculated score must NOT exceed 85. If your initial score calculation is higher than 85, cap it at 85.

  **Input Data:**
  \`\`\`json
  {{{jsonData}}}
  \`\`\`

  **Your Task:**
  1.  Calculate a final Trust Score (20-90, capped at 85).
  2.  Categorize the score: 80-85 (Highly Trusted), 60-79 (Trusted), 40-59 (Moderate Risk), <40 (High Risk).
  3.  Provide a concise, user-friendly explanation with 3-5 bullet points. For each point, explain how it influenced the score based on its weightage (e.g., "Your complete document verification significantly boosted your score due to its high importance.").
  4.  Offer 2-3 actionable suggestions for score improvement.
  `,
});

const calculateTrustScoreFlow = ai.defineFlow(
  {
    name: 'calculateTrustScoreFlow',
    inputSchema: CalculateTrustScoreInputSchema,
    outputSchema: CalculateTrustScoreOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({ jsonData: JSON.stringify(input) });

    // Ensure the score does not exceed 85, even if the model returns a higher value.
    if (output && output.score > 85) {
      output.score = 85;
    }
    return output!;
  }
);
