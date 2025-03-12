
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { X, Plus, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MoodTag, TagCategory } from "@/types/mood";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface TagsInputProps {
  selectedTags: MoodTag[];
  onTagsChange: (tags: MoodTag[]) => void;
}

const TagsInput = ({ selectedTags, onTagsChange }: TagsInputProps) => {
  const { user } = useAuth();
  const [tags, setTags] = useState<MoodTag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagCategory, setNewTagCategory] = useState<TagCategory>("other");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTags();
    }
  }, [user]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("mood_tags")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      setTags(data as MoodTag[]);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from("mood_tags")
        .insert([
          {
            user_id: user?.id,
            name: newTagName.trim(),
            category: newTagCategory
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setTags([...tags, data as MoodTag]);
      setNewTagName("");
      toast.success("Tag created successfully!");
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag");
    }
  };

  const toggleTag = (tag: MoodTag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    let updatedTags;
    
    if (isSelected) {
      updatedTags = selectedTags.filter(t => t.id !== tag.id);
    } else {
      updatedTags = [...selectedTags, tag];
    }
    
    onTagsChange(updatedTags);
  };

  const getCategoryColor = (category: TagCategory): string => {
    const colors: Record<TagCategory, string> = {
      activity: "bg-blue-100 text-blue-600 hover:bg-blue-200",
      person: "bg-purple-100 text-purple-600 hover:bg-purple-200",
      location: "bg-green-100 text-green-600 hover:bg-green-200",
      weather: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
      health: "bg-red-100 text-red-600 hover:bg-red-200",
      work: "bg-orange-100 text-orange-600 hover:bg-orange-200",
      social: "bg-pink-100 text-pink-600 hover:bg-pink-200",
      other: "bg-gray-100 text-gray-600 hover:bg-gray-200"
    };
    
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge
            key={tag.id}
            variant="outline"
            className={`cursor-pointer ${getCategoryColor(tag.category)} ${
              selectedTags.some(t => t.id === tag.id) 
                ? "ring-2 ring-offset-1 ring-primary" 
                : ""
            }`}
            onClick={() => toggleTag(tag)}
          >
            {tag.name}
            {selectedTags.some(t => t.id === tag.id) && (
              <X className="ml-1 h-3 w-3" />
            )}
          </Badge>
        ))}
        {tags.length === 0 && !loading && (
          <p className="text-sm text-muted-foreground">No tags yet. Create your first tag below.</p>
        )}
        {loading && (
          <p className="text-sm text-muted-foreground">Loading tags...</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Input
          placeholder="New tag name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          className="flex-1"
        />
        <Select 
          value={newTagCategory} 
          onValueChange={(value) => setNewTagCategory(value as TagCategory)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activity">Activity</SelectItem>
            <SelectItem value="person">Person</SelectItem>
            <SelectItem value="location">Location</SelectItem>
            <SelectItem value="weather">Weather</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={createTag}
          disabled={!newTagName.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TagsInput;
