// src/ai/flows/dashboard-advice.ts
'use server';

/**
 * @fileOverview Provides personalized advice based on the user's tracked tasks, habits, and finances.
 *
 * - getDashboardAdvice - A function that generates personalized advice for the dashboard.
 * - DashboardAdviceInput - The input type for the getDashboardAdvice function.
 * - DashboardAdviceOutput - The return type for the getDashboardAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DashboardAdviceInputSchema = z.object({
  tasksSummary: z
    .string()
    .describe('A summary of the user tasks, including completed, pending, and overdue tasks.'),
  habitsSummary: z
    .string()
    .describe('A summary of the user habits, including completed habits, missed habits, and streaks.'),
  financesSummary: z
    .string()
    .describe('A summary of the user finances, including income, expenses, and balance.'),
  moodsSummary: z
    .string()
    .describe("A summary of the user's mood ratings for the past week."),
});
export type DashboardAdviceInput = z.infer<typeof DashboardAdviceInputSchema>;

const DashboardAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized advice based on the provided summaries.'),
});
export type DashboardAdviceOutput = z.infer<typeof DashboardAdviceOutputSchema>;

export async function getDashboardAdvice(input: DashboardAdviceInput): Promise<DashboardAdviceOutput> {
  return dashboardAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dashboardAdvicePrompt',
  input: {schema: DashboardAdviceInputSchema},
  output: {schema: DashboardAdviceOutputSchema},
  prompt: `You are a personal advisor for an app called Prism. You provide insights based on user data. Your tone should be encouraging and supportive.

  Based on the following summaries of the user's tasks, habits, finances, and mood, provide concise, personalized advice. Look for connections between the different areas. For example, if expenses are high and mood is low, you could gently suggest looking into it. Do not offer any investment or medical advice. Keep the advice to 2-3 sentences.

  Tasks Summary: {{{tasksSummary}}}
  Habits Summary: {{{habitsSummary}}}
  Finances Summary: {{{financesSummary}}}
  Moods Summary: {{{moodsSummary}}}
  `,
});

const dashboardAdviceFlow = ai.defineFlow(
  {
    name: 'dashboardAdviceFlow',
    inputSchema: DashboardAdviceInputSchema,
    outputSchema: DashboardAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
