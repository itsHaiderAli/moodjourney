
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { MoodTag } from "@/types/mood";
import TagsInput from "@/components/TagsInput";
import { format } from "date-fns";
import { Heart, Brain, Zap, Coffee, Sun, Cloud, Moon } from "lucide-react";

interface MoodTrackerProps {
  onSubmitSuccess: () => void;
}

const MoodTracker = ({ onSubmitSuccess }: MoodTrackerProps) => {
  const { user } = useAuth();
  const [mood, setMood] = useState("happy");
  const [intensity, setIntensity] = useState([5]);
  const [energyLevel, setEnergyLevel] = useState([7]);
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<MoodTag[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  const moodIcons = {
    happy: <Sun className="h-5 w-5 text-yellow-500" />,
    sad: <Cloud className="h-5 w-5 text-blue-400" />,
    angry: <Zap className="h-5 w-5 text-red-500" />,
    excited: <Heart className="h-5 w-5 text-pink-500" />,
    calm: <Moon className="h-5 w-5 text-indigo-400" />,
    anxious: <Brain className="h-5 w-5 text-purple-500" />,
    tired: <Coffee className="h-5 w-5 text-brown-500" />,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to log your mood");
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get existing entries
      const storedEntries = localStorage.getItem("moodEntries") || "[]";
      const entries = JSON.parse(storedEntries);
      
      // Add new entry
      const newEntry = {
        id: `local-${Date.now()}`,
        date: format(new Date(), "MMM dd"),
        mood: intensity[0],
        energy: energyLevel[0],
        mood_name: mood,
        note: note,
        tags: selectedTags,
        created_at: new Date().toISOString()
      };
      
      // Add to beginning of array
      entries.unshift(newEntry);
      
      // Save back to localStorage
      localStorage.setItem("moodEntries", JSON.stringify(entries));
      
      toast.success("Mood logged successfully!");
      
      onSubmitSuccess();
      
      setNote("");
      setIntensity([5]);
      setEnergyLevel([7]);
      setSelectedTags([]);
    } catch (error) {
      console.error('Error logging mood:', error);
      toast.error("Failed to log mood. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your mood">
                  {mood && (
                    <div className="flex items-center">
                      <span className="mr-2">{moodIcons[mood as keyof typeof moodIcons]}</span>
                      <span className="capitalize">{mood}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="happy" className="hover:bg-accent">
                  <div className="flex items-center">
                    <Sun className="mr-2 h-4 w-4 text-yellow-500" />
                    😊 Happy
                  </div>
                </SelectItem>
                <SelectItem value="sad" className="hover:bg-accent">
                  <div className="flex items-center">
                    <Cloud className="mr-2 h-4 w-4 text-blue-400" />
                    😢 Sad
                  </div>
                </SelectItem>
                <SelectItem value="angry" className="hover:bg-accent">
                  <div className="flex items-center">
                    <Zap className="mr-2 h-4 w-4 text-red-500" />
                    😠 Angry
                  </div>
                </SelectItem>
                <SelectItem value="excited" className="hover:bg-accent">
                  <div className="flex items-center">
                    <Heart className="mr-2 h-4 w-4 text-pink-500" />
                    🤩 Excited
                  </div>
                </SelectItem>
                <SelectItem value="calm" className="hover:bg-accent">
                  <div className="flex items-center">
                    <Moon className="mr-2 h-4 w-4 text-indigo-400" />
                    😌 Calm
                  </div>
                </SelectItem>
                <SelectItem value="anxious" className="hover:bg-accent">
                  <div className="flex items-center">
                    <Brain className="mr-2 h-4 w-4 text-purple-500" />
                    😰 Anxious
                  </div>
                </SelectItem>
                <SelectItem value="tired" className="hover:bg-accent">
                  <div className="flex items-center">
                    <Coffee className="mr-2 h-4 w-4 text-amber-700" />
                    😴 Tired
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Mood Intensity</label>
            <div className="px-1">
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={10}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Low</span>
                <span>{intensity[0]}/10</span>
                <span>High</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Energy Level</label>
            <div className="px-1">
              <Slider
                value={energyLevel}
                onValueChange={setEnergyLevel}
                max={10}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Low</span>
                <span>{energyLevel[0]}/10</span>
                <span>High</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags & Triggers</label>
            <TagsInput 
              selectedTags={selectedTags} 
              onTagsChange={setSelectedTags} 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              placeholder="Add any notes about your mood..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <Button type="submit" className="w-full hover-scale" disabled={submitting}>
            {submitting ? "Logging..." : "Log Mood"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
