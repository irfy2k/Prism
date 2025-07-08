"use client";

import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Habit } from '@/lib/types';
import { AddHabitDialog } from './add-habit-dialog';
import { HabitTracker } from './habit-tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function HabitsTab() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);

  const addHabit = (habit: Omit<Habit, 'id' | 'completions'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      completions: [],
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };
  
  const toggleHabitCompletion = (id: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        // For 'break' habits, a "completion" is a slip-up.
        // For 'build' habits, it's a success.
        // The logic is the same: toggle presence of the date.
        const newCompletions = habit.completions.includes(date)
          ? habit.completions.filter(c => c !== date)
          : [...habit.completions, date];
        return { ...habit, completions: newCompletions.sort() };
      }
      return habit;
    }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Habits</CardTitle>
        <AddHabitDialog onAddHabit={addHabit} />
      </CardHeader>
      <CardContent>
        {habits.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p>You are not tracking any habits yet.</p>
            <p>Click "Add Habit" to build new routines!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habits.map(habit => (
              <HabitTracker 
                key={habit.id} 
                habit={habit}
                onDelete={deleteHabit}
                onToggleCompletion={toggleHabitCompletion}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
