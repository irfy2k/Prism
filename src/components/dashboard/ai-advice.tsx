"use client";

import { useState, useEffect, useCallback } from "react";
import type { Task, Habit, Transaction, MoodRating } from "@/lib/types";
import { getDashboardAdvice } from "@/ai/flows/dashboard-advice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw } from "lucide-react";
import { isToday, parseISO, subDays } from "date-fns";

interface AiAdviceProps {
  tasks: Task[];
  habits: Habit[];
  transactions: Transaction[];
  moods: MoodRating[];
}

export function AiAdvice({ tasks, habits, transactions, moods }: AiAdviceProps) {
  const [advice, setAdvice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAdvice = useCallback(async () => {
    if (tasks.length === 0 && habits.length === 0 && transactions.length === 0 && moods.length === 0) {
      setAdvice("Start adding tasks, habits, or financial transactions to get personalized advice.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const tasksSummary = `Total tasks: ${tasks.length}. Completed: ${tasks.filter(t => t.completed).length}. Pending: ${tasks.filter(t => !t.completed).length}.`;
      
      const habitsSummary = `Total habits: ${habits.length}. Habits completed today: ${habits.filter(h => h.type === 'build' && h.completions.some(c => isToday(parseISO(c)))).length}.`;

      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const financesSummary = `Total income: ${totalIncome.toFixed(2)}. Total expenses: ${totalExpenses.toFixed(2)}. Current balance: ${(totalIncome - totalExpenses).toFixed(2)}.`;
      
      const recentMoods = moods.filter(m => parseISO(m.date) >= subDays(new Date(), 7));
      const averageMood = recentMoods.length > 0 ? (recentMoods.reduce((sum, m) => sum + m.rating, 0) / recentMoods.length).toFixed(1) : 'not available';
      const moodsSummary = `Over the last 7 days, the average mood was ${averageMood}/5. Total moods tracked this week: ${recentMoods.length}.`;
      
      const result = await getDashboardAdvice({ tasksSummary, habitsSummary, financesSummary, moodsSummary });
      setAdvice(result.advice);
    } catch (e) {
      console.error(e);
      setError("Could not generate advice at this time. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [tasks, habits, transactions, moods]);

  useEffect(() => {
    fetchAdvice();
  }, [fetchAdvice]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Your Daily Insight</CardTitle>
        <div className="flex items-center gap-2">
           <Button
              variant="ghost"
              size="icon"
              onClick={fetchAdvice}
              disabled={isLoading}
              className="h-7 w-7"
              aria-label="Refresh advice"
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          <Lightbulb className="h-5 w-5 text-accent" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{advice}</p>
        )}
      </CardContent>
    </Card>
  );
}
