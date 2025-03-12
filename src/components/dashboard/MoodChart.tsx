
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoodEntry } from "@/types/mood";

interface MoodChartProps {
  moodHistory: MoodEntry[];
  loading: boolean;
}

const MoodChart = ({ moodHistory, loading }: MoodChartProps) => {
  return (
    <Card className="animate-in">
      <CardHeader>
        <CardTitle>Mood Trends</CardTitle>
        <CardDescription>Your mood patterns over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading your mood data...</p>
          </div>
        ) : moodHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p>No mood data yet. Start logging your moods!</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={moodHistory}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="mood" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorMood)" 
              />
              <Area 
                type="monotone" 
                dataKey="energy" 
                stroke="hsl(var(--secondary))" 
                fillOpacity={1} 
                fill="url(#colorEnergy)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodChart;
