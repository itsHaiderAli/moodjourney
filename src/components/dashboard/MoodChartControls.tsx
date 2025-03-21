
import { Button } from "@/components/ui/button";
import { LineChart, LayoutDashboard, BarChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeRangeControlProps {
  timeRange: 'all' | '7days' | '30days' | '90days';
  setTimeRange: (value: 'all' | '7days' | '30days' | '90days') => void;
}

export const TimeRangeControl = ({ timeRange, setTimeRange }: TimeRangeControlProps) => (
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
);

interface ChartTypeControlsProps {
  chartType: 'area' | 'line' | 'bar';
  setChartType: (value: 'area' | 'line' | 'bar') => void;
}

export const ChartTypeControls = ({ chartType, setChartType }: ChartTypeControlsProps) => (
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
        <LineChart className="h-4 w-4 mr-1" />
        Line
      </span>
    </Button>
    <Button 
      variant={chartType === 'bar' ? 'default' : 'outline'} 
      size="sm" 
      onClick={() => setChartType('bar')}
    >
      <span className="flex items-center">
        <BarChart className="h-4 w-4 mr-1" />
        Bar
      </span>
    </Button>
  </div>
);
