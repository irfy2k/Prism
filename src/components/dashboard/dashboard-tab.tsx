"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Task, Habit, Transaction, MoodRating } from "@/lib/types";
import { SummaryCards } from "./summary-cards";
import { AiAdvice } from "./ai-advice";
import { MoodTracker } from "./mood-tracker";
import { startOfDay } from "date-fns";
import { Greeting } from "./greeting";

export function DashboardTab({ userName }: { userName: string }) {
  const [tasks] = useLocalStorage<Task[]>("tasks", []);
  const [habits] = useLocalStorage<Habit[]>("habits", []);
  const [transactions] = useLocalStorage<Transaction[]>("transactions", []);
  const [moods, setMoods] = useLocalStorage<MoodRating[]>('moods', []);

  const addMoodRating = (rating: number) => {
    const newMood: MoodRating = {
      date: startOfDay(new Date()).toISOString(),
      rating: rating,
    };
    // Avoid duplicates for the same day
    setMoods(prev => {
      const filtered = prev.filter(m => startOfDay(new Date(m.date)).getTime() !== startOfDay(new Date(newMood.date)).getTime());
      return [...filtered, newMood].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  };

  return (
    <div className="grid gap-6">
      <Greeting userName={userName} />
      <SummaryCards tasks={tasks} habits={habits} transactions={transactions} />
      <MoodTracker moods={moods} onAddMood={addMoodRating} />
      <AiAdvice tasks={tasks} habits={habits} transactions={transactions} moods={moods} />
    </div>
  );
}
