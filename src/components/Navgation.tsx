import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-lg group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">
                WHO Health Data
              </h1>
              <p className="text-xs text-muted-foreground">
                Global Vaccination Insights
              </p>
            </div>
          </Link>

          <div className="flex gap-2">
            <Button variant={true ? "default" : "ghost"} asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant={true ? "default" : "ghost"} asChild>
              <Link href="/about">About</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
