
import { TooltipProps } from "recharts";

const MoodChartTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
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

export default MoodChartTooltip;
