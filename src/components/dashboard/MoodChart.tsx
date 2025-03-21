
import { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  ReferenceLine,
  LineChart,
  Line,
  BarChart,
  Bar
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MoodEntry } from "@/types/mood";
import { LineChart as LineChartIcon, LayoutDashboard, BarChart as BarChartIcon } from "lucide-react";

interface MoodChartProps {
  moodHistory: MoodEntry[];
  loading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-primary">Mood: {payload[0].value}</p>
        <p className="text-secondary">Energy: {payload[1].value}</p>
        {payload[0].payload.mood_name && (
          <p className="text-sm text-muted-foreground capitalize">
            Feeling: {payload[0].payload.mood_name}
          </p>
        )}
      </div>
    );
  }

  return null;
};

const MoodChart = ({ moodHistory, loading }: MoodChartProps) => {
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [timeRange, setTimeRange] = useState<'all' | '7days' | '30days' | '90days'>('7days');
  
  // Filter data based on time range
  const getFilteredData = () => {
    if (timeRange === 'all') return moodHistory;
    
    const now = new Date();
    let daysToSubtract;
    
    switch (timeRange) {
      case '7days':
        daysToSubtract = 7;
        break;
      case '30days':
        daysToSubtract = 30;
        break;
      case '90days':
        daysToSubtract = 90;
        break;
      default:
        daysToSubtract = 7;
    }
    
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - daysToSubtract);
    
    return moodHistory.filter(entry => {
      const entryDate = entry.created_at 
        ? new Date(entry.created_at) 
        : new Date(); // Fallback to current date if no created_at
      return entryDate >= cutoffDate;
    });
  };
  
  const filteredData = getFilteredData();
  
  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <p>Loading your mood data...</p>
        </div>
      );
    }
    
    if (moodHistory.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p>No mood data yet. Start logging your moods!</p>
        </div>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'area' && (
          <AreaChart data={filteredData}>
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
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={5} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <Area 
              type="monotone" 
              dataKey="mood" 
              name="Mood"
              stroke="hsl(var(--primary))" 
              fillOpacity={1} 
              fill="url(#colorMood)" 
            />
            <Area 
              type="monotone" 
              dataKey="energy" 
              name="Energy"
              stroke="hsl(var(--secondary))" 
              fillOpacity={1} 
              fill="url(#colorEnergy)" 
            />
          </AreaChart>
        )}
        
        {chartType === 'line' && (
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={5} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="mood" 
              name="Mood"
              stroke="hsl(var(--primary))" 
            />
            <Line 
              type="monotone" 
              dataKey="energy" 
              name="Energy"
              stroke="hsl(var(--secondary))" 
            />
          </LineChart>
        )}
        
        {chartType === 'bar' && (
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="mood" 
              name="Mood"
              fill="hsl(var(--primary))" 
            />
            <Bar 
              dataKey="energy" 
              name="Energy"
              fill="hsl(var(--secondary))" 
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="animate-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mood Trends</CardTitle>
            <CardDescription>Your mood patterns over time</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="7days" className="hover:bg-accent">Last 7 days</SelectItem>
              <SelectItem value="30days" className="hover:bg-accent">Last 30 days</SelectItem>
              <SelectItem value="90days" className="hover:bg-accent">Last 90 days</SelectItem>
              <SelectItem value="all" className="hover:bg-accent">All data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        {renderChart()}
      </CardContent>
      <CardFooter>
        <div className="flex space-x-2">
          <Button 
            variant={chartType === 'area' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setChartType('area')}
          >
            <span className="flex items-center">
              <LayoutDashboard className="h-4 w-4 mr-1" />
              Area
            </span>
          </Button>
          <Button 
            variant={chartType === 'line' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setChartType('line')}
          >
            <span className="flex items-center">
              <LineChartIcon className="h-4 w-4 mr-1" />
              Line
            </span>
          </Button>
          <Button 
            variant={chartType === 'bar' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setChartType('bar')}
          >
            <span className="flex items-center">
              <BarChartIcon className="h-4 w-4 mr-1" />
              Bar
            </span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MoodChart;
