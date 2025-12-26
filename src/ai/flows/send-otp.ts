'use server';

/**
 * @fileOverview This file defines a Genkit flow for sending an OTP via Twilio.
 *
 * - sendOtp - A function that sends a one-time password to a phone number.
 * - SendOtpInput - The input type for the sendOtp function.
 * - SendOtpOutput - The return type for the sendOtp function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import twilio from 'twilio';

const SendOtpInputSchema = z.object({
  to: z.string().describe('The phone number to send the OTP to.'),
});
export type SendOtpInput = z.infer<typeof SendOtpInputSchema>;

const SendOtpOutputSchema = z.object({
  success: z.boolean().describe('Whether the OTP was sent successfully.'),
  message: z.string().describe('A message indicating the status.'),
  otp: z.string().optional().describe('The OTP that was sent (for demo/testing purposes).'),
});
export type SendOtpOutput = z.infer<typeof SendOtpOutputSchema>;

export async function sendOtp(input: SendOtpInput): Promise<SendOtpOutput> {
  return sendOtpFlow(input);
}

const sendOtpFlow = ai.defineFlow(
  {
    name: 'sendOtpFlow',
    inputSchema: SendOtpInputSchema,
    outputSchema: SendOtpOutputSchema,
  },
  async (input) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_FROM_PHONE;

    if (!accountSid || !authToken || !fromPhone) {
      console.error('Twilio environment variables are not set.');
      return {
        success: false,
        message: 'Twilio configuration is missing.',
      };
    }

    const client = twilio(accountSid, authToken);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // In a real app, you would not send the actual phone number to an unknown service.
      // And you would handle international formats. For this demo, we assume a valid number.
      // Also, we are sending the OTP back for demo purposes. In production, you would store
      // it (e.g., in a session or temporary database) and have a separate verifyOtp flow.
      await client.messages.create({
        body: `Your Suraksha Kavach verification code is: ${otp}`,
        from: fromPhone,
        to: input.to,
      });

      return {
        success: true,
        message: `OTP sent to ${input.to}`,
        otp: otp, // For demo purposes, so we can use it on the frontend.
      };
    } catch (error: any) {
      console.error('Twilio error:', error);
      return {
        success: false,
        message: `Failed to send OTP: ${error.message}`,
      };
    }
  }
);
