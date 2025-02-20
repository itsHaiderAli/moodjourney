
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, Activity, Lock } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center space-y-6 animate-in">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
          <Heart className="h-6 w-6 text-primary mr-2" />
          <span className="text-sm font-medium">Track Your Emotional Journey</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Understand Your Emotions
          <br />
          <span className="text-primary">Shape Your Wellbeing</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          MoodScape helps you track, understand, and visualize your emotional journey.
          Start your path to better emotional awareness today.
        </p>
        
        <div className="flex items-center justify-center space-x-4 pt-4">
          <Link to="/register">
            <Button size="lg" className="hover-scale">
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="hover-scale">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-20">
        <div className="glass-card p-6 rounded-xl animate-in">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
          <p className="text-muted-foreground">
            Visualize your emotional journey with beautiful, interactive charts.
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl animate-in [animation-delay:200ms]">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Daily Insights</h3>
          <p className="text-muted-foreground">
            Get personalized insights about your emotional patterns.
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl animate-in [animation-delay:400ms]">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Private & Secure</h3>
          <p className="text-muted-foreground">
            Your emotional data is private and secure with end-to-end encryption.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
