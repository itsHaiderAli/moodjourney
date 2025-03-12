
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Activity, Smile } from "lucide-react";

interface MoodStatsProps {
  averageMood: number;
  totalEntries: number;
  currentStreak: number;
}

const MoodStats = ({ averageMood, totalEntries, currentStreak }: MoodStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="hover-scale">
        <CardHeader className="p-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm">Average Mood</CardTitle>
          </div>
          <p className="text-2xl font-bold">{averageMood}</p>
        </CardHeader>
      </Card>
      <Card className="hover-scale">
        <CardHeader className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm">Entries</CardTitle>
          </div>
          <p className="text-2xl font-bold">{totalEntries}</p>
        </CardHeader>
      </Card>
      <Card className="hover-scale">
        <CardHeader className="p-4">
          <div className="flex items-center space-x-2">
            <Smile className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm">Streak</CardTitle>
          </div>
          <p className="text-2xl font-bold">{currentStreak}</p>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MoodStats;
