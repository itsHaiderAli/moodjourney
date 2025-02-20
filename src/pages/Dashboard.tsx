
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { toast } from "sonner";

// Dummy data for the mood chart
const moodData = [
  { date: "2024-02-14", mood: 8 },
  { date: "2024-02-15", mood: 6 },
  { date: "2024-02-16", mood: 9 },
  { date: "2024-02-17", mood: 7 },
  { date: "2024-02-18", mood: 8 },
  { date: "2024-02-19", mood: 9 },
  { date: "2024-02-20", mood: 8 },
].map(item => ({
  ...item,
  date: format(new Date(item.date), "MMM dd"),
}));

const Dashboard = () => {
  const { user } = useAuth();
  const [mood, setMood] = useState("happy");
  const [intensity, setIntensity] = useState([5]);
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mood logged successfully!");
    setNote("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.email}</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mood Logging Form */}
        <Card>
          <CardHeader>
            <CardTitle>Log Your Mood</CardTitle>
            <CardDescription>How are you feeling right now?</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Mood</label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="happy">😊 Happy</SelectItem>
                    <SelectItem value="sad">😢 Sad</SelectItem>
                    <SelectItem value="angry">😠 Angry</SelectItem>
                    <SelectItem value="excited">🤩 Excited</SelectItem>
                    <SelectItem value="calm">😌 Calm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Intensity</label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  max={10}
                  step={1}
                />
                <div className="text-sm text-muted-foreground text-center">
                  {intensity[0]} / 10
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="Add any notes about your mood..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Log Mood
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Mood Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Mood Trends</CardTitle>
            <CardDescription>Your mood patterns over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
