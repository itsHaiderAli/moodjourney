
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MoodGoal } from "@/types/mood";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { format, parseISO, isAfter, addDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Award, Calendar, Check, Plus, Trash } from "lucide-react";

// Sample goals data
const sampleGoals: MoodGoal[] = [
  {
    id: "1",
    user_id: "mock-user-id",
    title: "Improve overall mood",
    description: "Focus on self-care and relaxation",
    target_mood: 7,
    start_date: new Date().toISOString(),
    end_date: addDays(new Date(), 7).toISOString(),
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    user_id: "mock-user-id",
    title: "Reduce stress from work",
    description: "Practice meditation daily",
    target_mood: 8,
    start_date: new Date().toISOString(),
    end_date: addDays(new Date(), 14).toISOString(),
    completed: false,
    created_at: subDays(new Date(), 2).toISOString(),
    updated_at: subDays(new Date(), 2).toISOString()
  }
];

function subDays(date: Date, days: number) {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

interface GoalCardProps {
  goal: MoodGoal;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  averageMood: number;
}

const GoalCard = ({ goal, onComplete, onDelete, averageMood }: GoalCardProps) => {
  const progress = goal.target_mood
    ? Math.min(100, Math.round((averageMood / goal.target_mood) * 100))
    : 0;
  
  const endDate = goal.end_date ? parseISO(goal.end_date) : null;
  const isOverdue = endDate ? isAfter(new Date(), endDate) : false;

  return (
    <Card className={`${goal.completed ? "bg-muted/30" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{goal.title}</CardTitle>
          <div className="flex items-center space-x-1">
            {goal.completed && <Award className="h-5 w-5 text-primary" />}
          </div>
        </div>
        <CardDescription>
          {goal.start_date && (
            <span className="flex items-center text-xs">
              <Calendar className="mr-1 h-3 w-3" />
              {format(parseISO(goal.start_date), "MMM dd")}
              {goal.end_date && ` - ${format(parseISO(goal.end_date), "MMM dd")}`}
              {isOverdue && !goal.completed && (
                <span className="ml-2 text-red-500">Overdue</span>
              )}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {goal.description && <p className="text-sm mb-3">{goal.description}</p>}
        {goal.target_mood && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Target Mood: {goal.target_mood}/10</span>
              <span>Current: {averageMood.toFixed(1)}/10</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        {!goal.completed ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => onComplete(goal.id)}
          >
            <Check className="mr-1 h-3 w-3" /> Mark Complete
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">
            Completed
          </span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-destructive"
          onClick={() => onDelete(goal.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const GoalManager = ({ averageMood }: { averageMood: number }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<MoodGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetMood, setTargetMood] = useState<number[]>([7]);
  const [duration, setDuration] = useState(7); // days
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      
      // Try to get stored goals from localStorage
      const storedGoals = localStorage.getItem("moodGoals");
      let goalsData = storedGoals ? JSON.parse(storedGoals) : sampleGoals;
      
      // First time, initialize with sample data and save to localStorage
      if (!storedGoals) {
        localStorage.setItem("moodGoals", JSON.stringify(sampleGoals));
      }
      
      setGoals(goalsData);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async () => {
    if (!title.trim()) return;
    
    try {
      const start_date = new Date().toISOString();
      const end_date = addDays(new Date(), duration).toISOString();
      
      // Create new goal
      const newGoal: MoodGoal = {
        id: `local-${Date.now()}`,
        user_id: user?.id || "mock-user-id",
        title: title.trim(),
        description: description.trim() || "",
        target_mood: targetMood[0],
        start_date,
        end_date,
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to goals array
      const updatedGoals = [newGoal, ...goals];
      setGoals(updatedGoals);
      
      // Save to localStorage
      localStorage.setItem("moodGoals", JSON.stringify(updatedGoals));
      
      setTitle("");
      setDescription("");
      setTargetMood([7]);
      setDuration(7);
      setDialogOpen(false);
      toast.success("Goal created successfully!");
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal");
    }
  };

  const completeGoal = async (id: string) => {
    try {
      // Update goal status
      const updatedGoals = goals.map(goal => 
        goal.id === id ? { ...goal, completed: true, updated_at: new Date().toISOString() } : goal
      );
      
      setGoals(updatedGoals);
      
      // Save to localStorage
      localStorage.setItem("moodGoals", JSON.stringify(updatedGoals));
      
      toast.success("Goal marked as complete!");
    } catch (error) {
      console.error("Error completing goal:", error);
      toast.error("Failed to update goal");
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      // Remove goal
      const updatedGoals = goals.filter(goal => goal.id !== id);
      setGoals(updatedGoals);
      
      // Save to localStorage
      localStorage.setItem("moodGoals", JSON.stringify(updatedGoals));
      
      toast.success("Goal deleted successfully!");
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mood Goals</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a target for your mood and track your progress
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Goal Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Improve my mood for a week"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your goal..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Mood Level (1-10)</label>
                <Slider
                  value={targetMood}
                  onValueChange={setTargetMood}
                  max={10}
                  step={1}
                />
                <div className="text-sm text-muted-foreground text-center">
                  {targetMood[0]} / 10
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (Days)</label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 7)}
                  min={1}
                  max={365}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                type="button" 
                onClick={createGoal}
                disabled={!title.trim()}
              >
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading goals...</p>
      ) : goals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onComplete={completeGoal}
              onDelete={deleteGoal}
              averageMood={averageMood}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No goals set yet. Create your first goal to start tracking your progress.
        </p>
      )}
    </div>
  );
};

export default GoalManager;
