'use server';
/**
 * @fileOverview An AI agent that breaks down a high-level goal into smaller, actionable tasks.
 *
 * - breakdownGoal - A function that handles the goal breakdown process.
 * - BreakdownGoalInput - The input type for the breakdownGoal function.
 * - BreakdownGoalOutput - The return type for the breakdownGoal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BreakdownGoalInputSchema = z.object({
  goal: z.string().describe('The high-level goal to be broken down.'),
});
export type BreakdownGoalInput = z.infer<typeof BreakdownGoalInputSchema>;

const BreakdownGoalOutputSchema = z.object({
  subTasks: z.array(z.string()).describe('A list of smaller, actionable sub-tasks.'),
});
export type BreakdownGoalOutput = z.infer<typeof BreakdownGoalOutputSchema>;

export async function breakdownGoal(input: BreakdownGoalInput): Promise<BreakdownGoalOutput> {
  return breakdownGoalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'breakdownGoalPrompt',
  input: {schema: BreakdownGoalInputSchema},
  output: {schema: BreakdownGoalOutputSchema},
  prompt: `You are an expert project manager in an app called Prism. A user will provide you with a high-level goal. Your task is to break it down into a list of smaller, actionable, and specific sub-tasks. The sub-tasks should be clear and concise. Do not add any introductory text, just provide the list of sub-tasks.

Goal: {{{goal}}}`,
});

const breakdownGoalFlow = ai.defineFlow(
  {
    name: 'breakdownGoalFlow',
    inputSchema: BreakdownGoalInputSchema,
    outputSchema: BreakdownGoalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
