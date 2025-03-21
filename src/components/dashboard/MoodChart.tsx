
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { MoodEntry } from "@/types/mood";
import MoodChartRenderer from "./MoodChartRenderer";
import { TimeRangeControl, ChartTypeControls } from "./MoodChartControls";
import { getFilteredMoodData } from "./moodChartUtils";

interface MoodChartProps {
  moodHistory: MoodEntry[];
  loading: boolean;
}

const MoodChart = ({ moodHistory, loading }: MoodChartProps) => {
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [timeRange, setTimeRange] = useState<'all' | '7days' | '30days' | '90days'>('7days');
  
  const filteredData = getFilteredMoodData(moodHistory, timeRange);

  return (
    <Card className="animate-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mood Trends</CardTitle>
            <CardDescription>Your mood patterns over time</CardDescription>
          </div>
          <TimeRangeControl 
            timeRange={timeRange} 
            setTimeRange={setTimeRange} 
          />
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <MoodChartRenderer 
          chartType={chartType} 
          data={filteredData} 
          loading={loading} 
        />
      </CardContent>
      <CardFooter>
        <ChartTypeControls 
          chartType={chartType} 
          setChartType={setChartType} 
        />
      </CardFooter>
    </Card>
  );
};

export default MoodChart;
