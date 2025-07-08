"use client";

import type { Transaction } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({ transactions, onDeleteTransaction }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>You have no transactions yet.</p>
        <p>Add an income or expense to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell>
                {t.type === 'income' ? (
                  <ArrowUpCircle className="h-5 w-5 text-positive" />
                ) : (
                  <ArrowDownCircle className="h-5 w-5 text-destructive" />
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{t.category}</Badge>
              </TableCell>
              <TableCell>{format(new Date(t.date), 'MMM d, yyyy')}</TableCell>
              <TableCell className={cn("text-right font-medium", t.type === 'income' ? 'text-positive' : 'text-destructive')}>
                {t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </TableCell>
              <TableCell className="text-right">
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteTransaction(t.id)}
                    aria-label={`Delete transaction`}
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
