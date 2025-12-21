'use server';

/**
 * @fileOverview An AI agent for evaluating the reliability of app users.
 *
 * - evaluateUserReliability - A function that evaluates the reliability of a user.
 * - EvaluateUserReliabilityInput - The input type for the evaluateUserReliability function.
 * - EvaluateUserReliabilityOutput - The return type for the evaluateUserReliability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateUserReliabilityInputSchema = z.object({
  userProfile: z.string().describe('A detailed description of the user profile, including their workout habits, goals, and community interactions.'),
  pastReviews: z.string().describe('A summary of past reviews and feedback from other users regarding this user.'),
});
export type EvaluateUserReliabilityInput = z.infer<typeof EvaluateUserReliabilityInputSchema>;

const EvaluateUserReliabilityOutputSchema = z.object({
  reliabilityScore: z.number().describe('A numerical score (0-100) representing the user reliability, based on their profile and past reviews.'),
  reasoning: z.string().describe('A brief explanation of why the user received the given reliability score.'),
});
export type EvaluateUserReliabilityOutput = z.infer<typeof EvaluateUserReliabilityOutputSchema>;

export async function evaluateUserReliability(input: EvaluateUserReliabilityInput): Promise<EvaluateUserReliabilityOutput> {
  return evaluateUserReliabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateUserReliabilityPrompt',
  input: {schema: EvaluateUserReliabilityInputSchema},
  output: {schema: EvaluateUserReliabilityOutputSchema},
  prompt: `You are an AI assistant specializing in evaluating the reliability of users in a fitness app called FitConnect.

You will receive a user profile and a summary of past reviews from other users. Based on this information, you will assess the user's reliability and provide a numerical score between 0 and 100, where 100 represents the highest reliability.

Consider factors such as consistency in workout habits, positive feedback from other users, and adherence to community guidelines.

User Profile: {{{userProfile}}}
Past Reviews: {{{pastReviews}}}

Please provide a reliability score and a brief explanation of your reasoning.

Output format: { \"reliabilityScore\": number, \"reasoning\": string }`,
});

const evaluateUserReliabilityFlow = ai.defineFlow(
  {
    name: 'evaluateUserReliabilityFlow',
    inputSchema: EvaluateUserReliabilityInputSchema,
    outputSchema: EvaluateUserReliabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
