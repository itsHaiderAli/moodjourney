
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
import { MoodEntry } from "@/types/mood";
import MoodChartTooltip from "./MoodChartTooltip";

interface MoodChartRendererProps {
  chartType: 'area' | 'line' | 'bar';
  data: MoodEntry[];
  loading: boolean;
}

const MoodChartRenderer = ({ chartType, data, loading }: MoodChartRendererProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading your mood data...</p>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No mood data yet. Start logging your moods!</p>
      </div>
    );
  }
  
  // The issue is likely with the ResponsiveContainer's children
  // ResponsiveContainer expects a single child element, so we need to use a fragment or conditional rendering
  return (
    <ResponsiveContainer width="100%" height="100%">
      {/* Rendering a single chart based on the chartType */}
      {chartType === 'area' ? (
        <AreaChart data={data}>
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
          <Tooltip content={<MoodChartTooltip />} />
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
      ) : chartType === 'line' ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 10]} />
          <Tooltip content={<MoodChartTooltip />} />
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
      ) : (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 10]} />
          <Tooltip content={<MoodChartTooltip />} />
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

export default MoodChartRenderer;
