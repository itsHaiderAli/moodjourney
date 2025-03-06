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
import { format, subDays, parseISO } from "date-fns";
import { toast } from "sonner";
import { Activity, Brain, Calendar, ChartBar, Heart, Smile, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface MoodEntry {
  id?: string;
  date: string;
  mood: number;
  energy: number;
  note?: string;
  mood_name?: string;
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [mood, setMood] = useState("happy");
  const [intensity, setIntensity] = useState([5]);
  const [energyLevel, setEnergyLevel] = useState([7]);
  const [note, setNote] = useState("");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [averageMood, setAverageMood] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    }
  }, [user]);

  const fetchMoodEntries = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedData = data.map(entry => ({
        id: entry.id,
        date: format(parseISO(entry.created_at), "MMM dd"),
        mood: entry.intensity,
        energy: entry.energy,
        note: entry.note,
        mood_name: entry.mood
      }));

      setMoodHistory(formattedData);
      updateStats(formattedData);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      toast.error("Failed to load mood entries");
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (history: MoodEntry[]) => {
    if (history.length === 0) return;
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to log your mood");
      return;
    }
    
    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from('mood_entries')
        .insert([
          { 
            user_id: user.id,
            mood: mood,
            intensity: intensity[0],
            energy: energyLevel[0],
            note: note
          }
        ])
        .select();

      if (error) throw error;
      
      toast.success("Mood logged successfully!");
      
      fetchMoodEntries();
      
      setNote("");
      setIntensity([5]);
      setEnergyLevel([7]);
    } catch (error) {
      console.error('Error logging mood:', error);
      toast.error("Failed to log mood. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
                  {moodHistory.length > 0 ? Math.max(...moodHistory.map(entry => entry.mood)) : 0}/10
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
          <h1 className="text-3xl font-bold">Welcome back, {profile?.username || user?.email}</h1>
          <p className="text-muted-foreground">Track and manage your emotional wellbeing</p>
        </div>
        <div className="flex items-center space-x-4">
          <MoodCalendar />
          <AnalyticsDialog />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
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
              
              <Button type="submit" className="w-full hover-scale" disabled={submitting}>
                {submitting ? "Logging..." : "Log Mood"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
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
