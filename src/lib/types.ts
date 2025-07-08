import { z } from 'zod';

// Task
export const TaskSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1, 'Task content cannot be empty.'),
  dueDate: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  completed: z.boolean(),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly']).default('none'),
});
export type Task = z.infer<typeof TaskSchema>;
export const AddTaskSchema = TaskSchema.omit({ id: true, completed: true });


// Habit
export const HabitSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Habit name cannot be empty.'),
  type: z.enum(['build', 'break']).default('build'),
  frequency: z.enum(['daily', 'weekly']),
  completions: z.array(z.string()), // Array of ISO date strings
});
export type Habit = z.infer<typeof HabitSchema>;
export const AddHabitSchema = HabitSchema.omit({ id: true, completions: true });

// Transaction
export const TransactionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  date: z.string(),
});
export type Transaction = z.infer<typeof TransactionSchema>;
export const AddTransactionSchema = TransactionSchema.omit({ id: true });

// Mood
export const MoodRatingSchema = z.object({
  date: z.string(), // ISO date string
  rating: z.number().min(1).max(5),
});
export type MoodRating = z.infer<typeof MoodRatingSchema>;
