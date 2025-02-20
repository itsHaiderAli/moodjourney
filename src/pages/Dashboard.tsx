
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
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Brain, Calendar, ChartBar, Heart, Smile, User } from "lucide-react";

// Dummy data for the mood chart
const moodData = [
  { date: "2024-02-14", mood: 8, energy: 7 },
  { date: "2024-02-15", mood: 6, energy: 5 },
  { date: "2024-02-16", mood: 9, energy: 8 },
  { date: "2024-02-17", mood: 7, energy: 6 },
  { date: "2024-02-18", mood: 8, energy: 7 },
  { date: "2024-02-19", mood: 9, energy: 9 },
  { date: "2024-02-20", mood: 8, energy: 8 },
].map(item => ({
  ...item,
  date: format(new Date(item.date), "MMM dd"),
}));

const Dashboard = () => {
  const { user } = useAuth();
  const [mood, setMood] = useState("happy");
  const [intensity, setIntensity] = useState([5]);
  const [energyLevel, setEnergyLevel] = useState([7]);
  const [note, setNote] = useState("");
  const [activities, setActivities] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mood logged successfully!");
    setNote("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.email}</h1>
          <p className="text-muted-foreground">Track and manage your emotional wellbeing</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="hover-scale">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button variant="outline" className="hover-scale">
            <ChartBar className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mood Logging Form */}
        <Card className="animate-in">
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
                <label className="text-sm font-medium">Mood Intensity</label>
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
                <label className="text-sm font-medium">Energy Level</label>
                <Slider
                  value={energyLevel}
                  onValueChange={setEnergyLevel}
                  max={10}
                  step={1}
                />
                <div className="text-sm text-muted-foreground text-center">
                  {energyLevel[0]} / 10
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
              
              <Button type="submit" className="w-full hover-scale">
                Log Mood
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Mood Trends Chart */}
        <div className="space-y-6">
          <Card className="animate-in">
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
              <CardDescription>Your mood patterns over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodData}>
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
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card className="hover-scale">
              <CardHeader className="p-4">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Average Mood</CardTitle>
                </div>
                <p className="text-2xl font-bold">7.8</p>
              </CardHeader>
            </Card>
            <Card className="hover-scale">
              <CardHeader className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Entries</CardTitle>
                </div>
                <p className="text-2xl font-bold">24</p>
              </CardHeader>
            </Card>
            <Card className="hover-scale">
              <CardHeader className="p-4">
                <div className="flex items-center space-x-2">
                  <Smile className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Streak</CardTitle>
                </div>
                <p className="text-2xl font-bold">5</p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
