
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, BarChart, Calendar, ArrowRight } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto">
        <div className="mb-6 inline-flex items-center justify-center p-2 bg-primary/10 rounded-full">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Track Your Emotional Wellbeing</h1>
        <p className="text-xl text-muted-foreground mb-8">
          MoodScape helps you understand and improve your emotional health through daily mood tracking and analytics.
        </p>
        
        {user ? (
          <Link to="/dashboard">
            <Button size="lg" className="gap-2">
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-24">
        <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
          <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Daily Tracking</h3>
          <p className="text-muted-foreground">Record your mood daily and add notes to track emotional patterns over time.</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
          <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Insightful Analytics</h3>
          <p className="text-muted-foreground">Visualize your moods and uncover patterns to better understand your emotional health.</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
          <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Improve Wellbeing</h3>
          <p className="text-muted-foreground">Set goals and track progress to actively improve your emotional wellness.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
