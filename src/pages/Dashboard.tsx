
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Heart, FileText, Flag } from "lucide-react";
import MoodTracking from "@/components/dashboard/MoodTracking";
import GoalManager from "@/components/GoalManager";
import ExportReports from "@/components/ExportReports";
import { MoodCalendar, AnalyticsDialog } from "@/components/dashboard/MoodDialogs";
import { useMoodData } from "@/hooks/useMoodData";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("track");
  const { moodHistory, averageMood } = useMoodData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.username || user?.email}</h1>
          <p className="text-muted-foreground">Track and manage your emotional wellbeing</p>
        </div>
        <div className="flex items-center space-x-4">
          <MoodCalendar moodHistory={moodHistory} />
          <AnalyticsDialog moodHistory={moodHistory} averageMood={averageMood} />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="track" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            Track Mood
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center">
            <Flag className="mr-2 h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="track">
          <MoodTracking />
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-6">
          <GoalManager averageMood={averageMood} />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <div className="max-w-md mx-auto">
            <ExportReports />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
