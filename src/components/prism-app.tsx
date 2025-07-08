
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, CheckCircle, Repeat, Landmark } from "lucide-react";
import { DashboardTab } from "@/components/dashboard/dashboard-tab";
import { TasksTab } from "@/components/tasks/tasks-tab";
import { HabitsTab } from "@/components/habits/habits-tab";
import { FinanceTab } from "@/components/finance/finance-tab";

export function PrismApp({ userName }: { userName: string }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <div className="w-full max-w-5xl">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-primary/20 bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-primary"
          >
            <path
              d="M12 2L2 8V16L12 22L22 16V8L12 2Z"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M22 8L12 13L2 8"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M12 22V13"
              stroke="hsl(var(--accent))"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

          <h1 className="text-2xl font-black text-foreground font-headline">Prism</h1>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-4">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="dashboard" className="py-2"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</TabsTrigger>
              <TabsTrigger value="tasks" className="py-2"><CheckCircle className="mr-2 h-4 w-4" />Tasks</TabsTrigger>
              <TabsTrigger value="habits" className="py-2"><Repeat className="mr-2 h-4 w-4" />Habits</TabsTrigger>
              <TabsTrigger value="finance" className="py-2"><Landmark className="mr-2 h-4 w-4" />Finance</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-95 data-[state=active]:slide-in-from-top-2 data-[state=active]:duration-500">
              <DashboardTab userName={userName} />
            </TabsContent>
            <TabsContent value="tasks" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-95 data-[state=active]:slide-in-from-top-2 data-[state=active]:duration-500">
              <TasksTab />
            </TabsContent>
            <TabsContent value="habits" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-95 data-[state=active]:slide-in-from-top-2 data-[state=active]:duration-500">
              <HabitsTab />
            </TabsContent>
            <TabsContent value="finance" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-95 data-[state=active]:slide-in-from-top-2 data-[state=active]:duration-500">
              <FinanceTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
