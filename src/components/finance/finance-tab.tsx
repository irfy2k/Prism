"use client";

import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddTransactionDialog } from './add-transaction-dialog';
import { FinanceCharts } from './finance-charts';
import { TransactionList } from './transaction-list';
import { useMemo } from 'react';
import { safeParseDate } from '@/lib/utils';

export function FinanceTab() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev].sort((a,b) => {
      const dateA = safeParseDate(a.date).getTime();
      const dateB = safeParseDate(b.date).getTime();
      
      return dateB - dateA;
    }));
  };
  
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    };
  }, [transactions]);

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-positive">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-destructive">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-foreground' : 'text-destructive'}`}>{balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
          </CardContent>
        </Card>
      </div>

      <FinanceCharts transactions={transactions} />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Recent Transactions</CardTitle>
          <AddTransactionDialog onAddTransaction={addTransaction} />
        </CardHeader>
        <CardContent>
          <TransactionList transactions={transactions} onDeleteTransaction={deleteTransaction} />
        </CardContent>
      </Card>
    </div>
  );
}
