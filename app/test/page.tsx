"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/header/ThemeToggle";

export default function TestPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Theme Toggle Test</h1>
            <ThemeToggle />
          </div>
          
          <div className="space-y-8">
            <div className="p-6 rounded-lg bg-card text-card-foreground border border-border">
              <h2 className="text-xl font-semibold mb-4">Card Component</h2>
              <p className="text-muted-foreground">This is text with muted foreground color.</p>
            </div>
            
            <div className="p-6 rounded-lg bg-muted text-muted-foreground">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Muted Component</h2>
              <p>This is text with muted foreground color in a muted background.</p>
            </div>
            
            <div className="p-6 rounded-lg bg-accent text-accent-foreground">
              <h2 className="text-xl font-semibold mb-4">Accent Component</h2>
              <p>This is text with accent foreground color.</p>
            </div>
            
            <div className="p-6 rounded-lg bg-primary text-primary-foreground">
              <h2 className="text-xl font-semibold mb-4">Primary Component</h2>
              <p>This is text with primary foreground color.</p>
            </div>
            
            <div className="p-6 rounded-lg bg-secondary text-secondary-foreground">
              <h2 className="text-xl font-semibold mb-4">Secondary Component</h2>
              <p>This is text with secondary foreground color.</p>
            </div>
            
            <div className="p-6 rounded-lg bg-destructive text-destructive-foreground">
              <h2 className="text-xl font-semibold mb-4">Destructive Component</h2>
              <p>This is text with destructive foreground color.</p>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}