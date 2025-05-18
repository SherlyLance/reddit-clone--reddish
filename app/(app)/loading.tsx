import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <Loader2 className="h-16 w-16 text-red-600 animate-spin mb-4" /> 
        <p className="text-xl font-semibold text-foreground">
          Eat Reddish Until Loading...
        </p>
      </div>
    </div>
  );
}
