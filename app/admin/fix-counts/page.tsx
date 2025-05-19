"use client";

import { FixMemberCountsButton } from "@/components/admin/FixMemberCountsButton";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, CheckCircle } from "lucide-react";

interface ResultItem {
  id: string;
  title: string;
  previousCount: number;
  newCount: number;
}

interface ResultData {
  success: boolean;
  message: string;
  updatedCount: number;
  results?: ResultItem[];
}

export default function FixMemberCountsPage() {
  const [results, setResults] = useState<ResultData | null>(null);
  
  const handleResults = (data: ResultData) => {
    setResults(data);
  };
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Community Member Count Utility</h1>
      
      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Fix All Community Member Counts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              This tool will update member counts for all communities to match the actual number of members.
              This is especially useful for fixing communities where users joined before the member count feature was implemented.
            </p>
            
            <div className="flex items-center gap-2 p-4 bg-muted rounded-md mb-4">
              <InfoIcon className="h-5 w-5 text-blue-500" />
              <span className="text-sm">
                Running this tool will scan all communities and fix any incorrect member counts.
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <FixMemberCountsButton onSuccess={handleResults} />
            </div>
          </CardContent>
        </Card>
        
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTitle>{results.message}</AlertTitle>
                <AlertDescription>
                  {results.updatedCount} communities were updated to match their actual member counts.
                </AlertDescription>
              </Alert>
              
              {results.results && results.results.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Updated Communities:</h3>
                  <div className="overflow-auto max-h-64 border rounded-md">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Community</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Previous Count</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">New Count</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Difference</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {results.results.map((result, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{result.title}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{result.previousCount}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{result.newCount}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              <span className={result.newCount > result.previousCount ? 'text-green-500' : 'text-red-500'}>
                                {result.newCount - result.previousCount > 0 ? '+' : ''}
                                {result.newCount - result.previousCount}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 