
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="glass-card p-8 rounded-xl animate-in">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.email}</h1>
        <p className="text-muted-foreground">
          Your mood tracking dashboard is coming soon. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
