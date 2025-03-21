
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Mock user and profile data
const MOCK_USER: User = {
  id: "mock-user-id-123",
  email: "demo@example.com",
};

const MOCK_PROFILE: Profile = {
  id: "mock-user-id-123",
  username: "Demo User",
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check local storage for user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("mockUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setProfile(MOCK_PROFILE);
    }
    setLoading(false);
  }, []);

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Registration successful! You can now log in.");
    } catch (error: any) {
      console.error('Error registering:', error);
      toast.error("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set mock user
      setUser(MOCK_USER);
      setProfile(MOCK_PROFILE);
      localStorage.setItem("mockUser", JSON.stringify(MOCK_USER));
      
      navigate("/dashboard");
      toast.success("Welcome back!");
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setUser(null);
      setProfile(null);
      localStorage.removeItem("mockUser");
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error("Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
