"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface StartupPromptProps {
    onNameSubmit: (name: string) => void;
}

export function StartupPrompt({ onNameSubmit }: StartupPromptProps) {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onNameSubmit(name.trim());
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-sm shadow-2xl shadow-primary/10">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome to Prism</CardTitle>
                    <CardDescription>Let's get started. What should I call you?</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input 
                            id="name"
                            placeholder="Enter your name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-center"
                            autoFocus
                        />
                        <Button type="submit" disabled={!name.trim()}>
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
