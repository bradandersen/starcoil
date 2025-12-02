import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { StarPattern, generateStarPatterns } from "@/lib/star-logic";
import { StarCoil } from "@/components/star-coil";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { AlertCircle, FileText, Settings, Menu } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const formSchema = z.object({
  points: z.coerce.number()
    .min(6, "Minimum 6 points required")
    .max(360, "Maximum 360 points allowed") // Limit to prevent browser freezing
    .refine((val) => {
      const half = val / 2;
      // "1/2 of that number should be an odd number"
      // This means val/2 must be odd. 
      // So (val/2) % 2 !== 0
      return Math.floor(half) === half && half % 2 !== 0;
    }, {
      message: "Half of the points must be an odd number (e.g. 10 -> 5 is odd). Try 10, 14, 18, 22, 30, 90...",
    }),
});

export default function Home() {
  const [generatedPatterns, setGeneratedPatterns] = useState<StarPattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<StarPattern | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      points: 90,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const patterns = generateStarPatterns(values.points);
    setGeneratedPatterns(patterns);
    if (patterns.length > 0) {
      setSelectedPattern(patterns[0]);
    } else {
      setSelectedPattern(null);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (generatedPatterns.length === 0) return;

      // Only handle if we're not typing in the input
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        
        const currentIndex = selectedPattern 
          ? generatedPatterns.findIndex(p => p.id === selectedPattern.id)
          : -1;
        
        let nextIndex = currentIndex;
        
        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < generatedPatterns.length - 1 ? currentIndex + 1 : currentIndex;
          if (currentIndex === -1) nextIndex = 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        }

        if (nextIndex !== currentIndex || currentIndex === -1) {
          const nextPattern = generatedPatterns[nextIndex];
          setSelectedPattern(nextPattern);
          
          // Scroll into view
          const element = document.getElementById(`pattern-btn-${nextPattern.id}`);
          element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generatedPatterns, selectedPattern]);

  const SidebarContent = () => (
    <div className="h-full flex flex-col gap-6 p-4 bg-sidebar text-sidebar-foreground">
      <div>
        <h1 className="font-mono text-xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5" />
          STARCOIL_GEN
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-mono">v1.0.0 // CLIENT_SIDE</p>
      </div>

      <div className="space-y-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="points" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Number of Points
            </label>
            <div className="flex gap-2">
              <Input 
                id="points" 
                type="number" 
                {...form.register("points")} 
                className="font-mono"
              />
              <Button type="submit">Generate</Button>
            </div>
            {form.formState.errors.points && (
               <Alert variant="destructive" className="mt-2 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs ml-2">
                  {form.formState.errors.points.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </form>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          GENERATED FILES
        </h3>
        <Card className="flex-1 rounded-md border bg-muted/30 shadow-none overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 w-full p-2">
            {generatedPatterns.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-8 font-mono">
                NO_DATA_GENERATED
                <br/>
                awaiting_input...
              </div>
            ) : (
              <div className="space-y-1">
                {generatedPatterns.map((pattern) => (
                  <button
                    id={`pattern-btn-${pattern.id}`}
                    key={pattern.id}
                    onClick={() => setSelectedPattern(pattern)}
                    className={`w-full text-left px-3 py-2 text-xs font-mono rounded-sm transition-colors truncate
                      ${selectedPattern?.id === pattern.id 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                      }
                    `}
                  >
                    {pattern.filename}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center md:p-4">
      <div className="w-full md:w-auto flex flex-col md:flex-row bg-background md:border md:shadow-2xl md:rounded-xl overflow-hidden" style={{ height: '810px' }}>
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b flex justify-between items-center bg-card shrink-0">
          <span className="font-mono font-bold">STARCOIL</span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-80 border-r bg-card flex-col h-full">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center relative h-full">
          <div className="w-full h-full flex flex-col items-center justify-center p-[5px] overflow-hidden">
            {selectedPattern ? (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <StarCoil pattern={selectedPattern} size={800} />
              </div>
            ) : (
              <div className="text-center text-muted-foreground max-w-md p-8">
                <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/30 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                  <Settings className="w-8 h-8 opacity-20" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Ready to Generate</h2>
                <p className="text-sm">Enter a point value on the left (e.g. 90) to generate star coil patterns.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
