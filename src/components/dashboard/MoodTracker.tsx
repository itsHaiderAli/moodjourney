
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
import { supabase } from "@/integrations/supabase/client";
import { MoodTag } from "@/types/mood";
import TagsInput from "@/components/TagsInput";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to log your mood");
      return;
    }
    
    try {
      setSubmitting(true);
      
      // First create the mood entry
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
      
      // If there are selected tags, create the relationships
      if (selectedTags.length > 0 && data && data[0]) {
        const entryId = data[0].id;
        const tagRelations = selectedTags.map(tag => ({
          mood_entry_id: entryId,
          tag_id: tag.id
        }));
        
        const { error: tagError } = await supabase
          .from('mood_entry_tags')
          .insert(tagRelations);
          
        if (tagError) throw tagError;
      }
      
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
