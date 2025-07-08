"use client";

import { useMemo } from "react";
import type { MoodRating } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfDay, subDays, eachDayOfInterval } from 'date-fns';
import { Smile, Frown, Meh, Laugh, Angry } from 'lucide-react';

interface MoodTrackerProps {
  moods: MoodRating[];
  onAddMood: (rating: number) => void;
}

const moodOptions = [
  { rating: 1, icon: Angry, label: 'Awful', color: 'text-red-500' },
  { rating: 2, icon: Frown, label: 'Bad', color: 'text-orange-500' },
  { rating: 3, icon: Meh, label: 'Okay', color: 'text-yellow-500' },
  { rating: 4, icon: Smile, label: 'Good', color: 'text-green-500' },
  { rating: 5, icon: Laugh, label: 'Great', color: 'text-teal-500' },
];

export function MoodTracker({ moods, onAddMood }: MoodTrackerProps) {
  const today = startOfDay(new Date());
  const hasRatedToday = useMemo(() => {
    return moods.some(mood => startOfDay(parseISO(mood.date)).getTime() === today.getTime());
  }, [moods, today]);

  const chartData = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });

    const moodsByDate = new Map(moods.map(m => [startOfDay(parseISO(m.date)).getTime(), m.rating]));

    return last7Days.map(day => ({
      name: format(day, 'MMM d'),
      date: day,
      rating: moodsByDate.get(day.getTime()) || 0,
    }));
  }, [moods, today]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (data.rating === 0) return null;

      const moodOption = moodOptions.find(mo => mo.rating === data.rating);
      return (
        <div className="p-2 bg-background/90 backdrop-blur-sm border rounded-lg shadow-lg">
          <p className="font-bold">{label}</p>
          {moodOption && (
            <p className={`flex items-center gap-2 ${moodOption.color}`}>
              <moodOption.icon className="h-4 w-4" />
              <span>Rating: {data.rating}/5 ({moodOption.label})</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Mood</CardTitle>
        <CardDescription>
          {hasRatedToday ? 'Your mood trend over the last 7 days.' : "How are you feeling today?"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasRatedToday && (
          <div className="p-4 bg-muted/50 rounded-lg">
             <h4 className="text-center font-medium mb-4">Rate Your Day</h4>
            <div className="flex justify-around items-center">
              {moodOptions.map(({ rating, icon: Icon, label, color }) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="icon"
                  className={`h-14 w-14 flex-col gap-1 rounded-full transition-all duration-200 ease-in-out hover:scale-110 ${color} hover:${color} hover:bg-accent`}
                  onClick={() => onAddMood(rating)}
                  aria-label={`Rate day as ${label}`}
                >
                  <Icon className="h-7 w-7" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {moods.length > 0 ? (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickCount={6} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', radius: 4 }} />
                  <Bar dataKey="rating" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
               </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
           <p className="text-sm text-center text-muted-foreground py-4">
             {hasRatedToday ? 'Your mood chart will appear here tomorrow.' : 'Track your mood daily to see your trends.'}
           </p>
        )}
      </CardContent>
    </Card>
  );
}
