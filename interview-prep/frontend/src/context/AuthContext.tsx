import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, LoginPayload, RegisterPayload } from "../types";
import { authService } from "../services/auth.service";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, restore session from localStorage and verify token is still valid
  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          const freshUser = await authService.getMe();
          setUser(freshUser);
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const persistSession = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const login = async (payload: LoginPayload) => {
    const { token, user } = await authService.login(payload);
    persistSession(token, user);
  };

  const register = async (payload: RegisterPayload) => {
    const { token, user } = await authService.register(payload);
    persistSession(token, user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider.");
  return ctx;
};
