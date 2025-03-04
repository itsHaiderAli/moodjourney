
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";

export function ThemeToggle() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      disabled
    >
      <Moon className="h-5 w-5" />
      <span className="sr-only">Dark theme</span>
    </Button>
  );
}
