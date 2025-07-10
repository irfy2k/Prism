"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo } from 'react';
import { format, startOfMonth } from 'date-fns';
import { safeParseDate } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip as ChartTooltipPrimitive,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

interface FinanceChartsProps {
  transactions: Transaction[];
}

export function FinanceCharts({ transactions }: FinanceChartsProps) {
  const chartData = useMemo(() => {
    const dataByMonth: { [key: string]: { name: string; income: number; expense: number } } = {};
    
    transactions.forEach(t => {
      try {
        const date = safeParseDate(t.date);
        const month = format(startOfMonth(date), 'MMM yyyy');
        if (!dataByMonth[month]) {
          dataByMonth[month] = { name: format(startOfMonth(date),'MMM'), income: 0, expense: 0 };
        }
        dataByMonth[month][t.type] += t.amount;
      } catch (error) {
        console.warn('Invalid date in transaction:', t.date);
        // Skip transactions with invalid dates
      }
    });

    return Object.values(dataByMonth).reverse();
  }, [transactions]);
  
  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(var(--chart-1))",
    },
    expense: {
      label: "Expense",
      color: "hsl(var(--chart-2))",
    },
  }

  if (transactions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Income vs. Expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltipPrimitive
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Legend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
