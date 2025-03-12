
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, ChartBar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry } from "@/types/mood";

interface MoodDialogsProps {
  moodHistory: MoodEntry[];
  averageMood: number;
}

export const MoodCalendar = ({ moodHistory }: { moodHistory: MoodEntry[] }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="hover-scale">
        <Calendar className="mr-2 h-4 w-4" />
        View Calendar
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Mood Calendar</DialogTitle>
        <DialogDescription>
          Your mood entries for the past week
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {moodHistory.map((entry, index) => (
          <div key={index} className="flex items-center justify-between px-4 py-2 bg-secondary/10 rounded-lg">
            <span>{entry.date}</span>
            <div className="flex gap-4">
              <span>Mood: {entry.mood}/10</span>
              <span>Energy: {entry.energy}/10</span>
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

export const AnalyticsDialog = ({ moodHistory, averageMood }: MoodDialogsProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="hover-scale">
        <ChartBar className="mr-2 h-4 w-4" />
        Analytics
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Mood Analytics</DialogTitle>
        <DialogDescription>
          Detailed analysis of your mood patterns
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodHistory}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Weekly Average</CardTitle>
              <p className="text-2xl font-bold">{averageMood}</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Best Day</CardTitle>
              <p className="text-2xl font-bold">
                {moodHistory.length > 0 ? Math.max(...moodHistory.map(entry => entry.mood)) : 0}/10
              </p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Consistency</CardTitle>
              <p className="text-2xl font-bold">
                {((moodHistory.length / 7) * 100).toFixed(0)}%
              </p>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
