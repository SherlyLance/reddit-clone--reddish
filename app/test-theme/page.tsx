import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TestThemePage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Theme Test Page</h1>
      <p className="text-muted-foreground">This page tests the theme toggle functionality.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Card Component</CardTitle>
            <CardDescription>Testing card with dark mode support</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">This is the main text content.</p>
            <p className="text-muted-foreground mt-2">This is secondary text content.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Submit</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Testing form elements with dark mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Input Field</label>
              <Input placeholder="Type something..." className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Textarea</label>
              <Textarea placeholder="Enter longer text..." className="mt-1" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Submit Form</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="border border-border p-6 rounded-lg bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Custom Container</h2>
        <p className="text-muted-foreground">
          This container uses theme-aware border and background colors.
        </p>
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="text-muted-foreground">This is a muted background section.</p>
        </div>
      </div>
    </div>
  );
}