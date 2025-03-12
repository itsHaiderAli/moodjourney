
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
import { MoodEntry } from "@/types/mood";
import { toast } from "sonner";
import { format, parseISO, subDays, subWeeks, subMonths } from "date-fns";
import { Download, FileText, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ExportReports = () => {
  const { user } = useAuth();
  const [timeFrame, setTimeFrame] = useState("week");
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeTags, setIncludeTags] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range based on selected time frame
      let startDate;
      const now = new Date();
      
      if (timeFrame === "week") {
        startDate = subWeeks(now, 1);
      } else if (timeFrame === "month") {
        startDate = subMonths(now, 1);
      } else if (timeFrame === "3months") {
        startDate = subMonths(now, 3);
      } else if (timeFrame === "year") {
        startDate = subMonths(now, 12);
      } else {
        startDate = subDays(now, 1);
      }
      
      // Format date for Supabase query
      const startDateStr = startDate.toISOString();
      
      // Fetch mood entries
      const { data: moodEntries, error: moodError } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user?.id)
        .gte("created_at", startDateStr)
        .order("created_at", { ascending: false });
        
      if (moodError) throw moodError;
      
      // Fetch tags if requested
      let entriesWithTags = [...moodEntries];
      
      if (includeTags) {
        const { data: tagRelations, error: tagRelError } = await supabase
          .from("mood_entry_tags")
          .select("mood_entry_id, tag_id");
          
        if (tagRelError) throw tagRelError;
        
        const { data: tags, error: tagsError } = await supabase
          .from("mood_tags")
          .select("*");
          
        if (tagsError) throw tagsError;
        
        // Add tags to each entry
        entriesWithTags = moodEntries.map(entry => {
          const entryTagIds = tagRelations
            .filter(rel => rel.mood_entry_id === entry.id)
            .map(rel => rel.tag_id);
            
          const entryTags = tags.filter(tag => entryTagIds.includes(tag.id));
          
          return {
            ...entry,
            tags: entryTags
          };
        });
      }
      
      return entriesWithTags;
    } catch (error) {
      console.error("Error fetching mood data:", error);
      toast.error("Failed to fetch mood data for export");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = (data: any[]) => {
    // Define headers based on options
    let headers = ["Date", "Mood", "Mood Intensity", "Energy Level"];
    
    if (includeNotes) {
      headers.push("Notes");
    }
    
    if (includeTags) {
      headers.push("Tags");
    }
    
    // Generate CSV content
    let csvContent = headers.join(",") + "\n";
    
    data.forEach(entry => {
      const row = [
        format(parseISO(entry.created_at), "yyyy-MM-dd"),
        entry.mood,
        entry.intensity,
        entry.energy
      ];
      
      if (includeNotes) {
        // Escape any commas in notes
        const safeNote = entry.note ? `"${entry.note.replace(/"/g, '""')}"` : "";
        row.push(safeNote);
      }
      
      if (includeTags && entry.tags) {
        // Join tags with semicolons and wrap in quotes to avoid CSV issues
        const tagsList = entry.tags.map((tag: any) => tag.name).join("; ");
        row.push(`"${tagsList}"`);
      }
      
      csvContent += row.join(",") + "\n";
    });
    
    return csvContent;
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    try {
      const data = await fetchMoodData();
      
      if (!data || data.length === 0) {
        toast.warning("No mood data found for the selected period");
        return;
      }
      
      const csvContent = generateCSV(data);
      const filename = `mood-report-${timeFrame}-${format(new Date(), "yyyy-MM-dd")}.csv`;
      
      downloadCSV(csvContent, filename);
      toast.success("Mood data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export mood data");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Export Your Mood Data
        </CardTitle>
        <CardDescription>
          Download your mood entries for analysis or sharing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Period</label>
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger>
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Export Options</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeNotes" 
                checked={includeNotes} 
                onCheckedChange={(checked) => 
                  setIncludeNotes(checked as boolean)
                }
              />
              <Label htmlFor="includeNotes">Include Notes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeTags" 
                checked={includeTags} 
                onCheckedChange={(checked) => 
                  setIncludeTags(checked as boolean)
                }
              />
              <Label htmlFor="includeTags">Include Tags</Label>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleExport}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing Export...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export as CSV
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportReports;
