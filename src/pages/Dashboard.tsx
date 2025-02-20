
import { useState, useEffect } from "react";
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
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Activity, Brain, Calendar, ChartBar, Heart, Smile, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MoodEntry {
  date: string;
  mood: number;
  energy: number;
  note?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [mood, setMood] = useState("happy");
  const [intensity, setIntensity] = useState([5]);
  const [energyLevel, setEnergyLevel] = useState([7]);
  const [note, setNote] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [averageMood, setAverageMood] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Initialize with some recent data
  useEffect(() => {
    generateInitialMoodData();
  }, []);

  const generateInitialMoodData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, "MMM dd"),
        mood: Math.floor(Math.random() * 5) + 5, // Random mood between 5-10
        energy: Math.floor(Math.random() * 5) + 4, // Random energy between 4-9
      };
    }).reverse();

    setMoodHistory(last7Days);
    updateStats(last7Days);
  };

  const updateStats = (history: MoodEntry[]) => {
    const avgMood = history.reduce((sum, entry) => sum + entry.mood, 0) / history.length;
    setAverageMood(Number(avgMood.toFixed(1)));
    setTotalEntries(history.length);
    setCurrentStreak(calculateStreak(history));
  };

  const calculateStreak = (history: MoodEntry[]) => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < history.length; i++) {
      if (i === 0 || history[i].date !== format(subDays(today, i), "MMM dd")) {
        break;
      }
      streak++;
    }
    return streak;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: MoodEntry = {
      date: format(new Date(), "MMM dd"),
      mood: intensity[0],
      energy: energyLevel[0],
      note: note,
    };

    const updatedHistory = [newEntry, ...moodHistory.slice(0, 6)];
    setMoodHistory(updatedHistory);
    updateStats(updatedHistory);

    toast.success("Mood logged successfully!");
    setNote("");
    setIntensity([5]);
    setEnergyLevel([7]);
  };

  const MoodCalendar = () => (
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

  const AnalyticsDialog = () => (
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
                  {Math.max(...moodHistory.map(entry => entry.mood))}/10
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm">Consistency</CardTitle>
                <p className="text-2xl font-bold">
                  {((totalEntries / 7) * 100).toFixed(0)}%
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.email}</h1>
          <p className="text-muted-foreground">Track and manage your emotional wellbeing</p>
        </div>
        <div className="flex items-center space-x-4">
          <MoodCalendar />
          <AnalyticsDialog />
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
            </CardContent>
          </Card>

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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
