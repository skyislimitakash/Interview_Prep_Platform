import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/Button";
import { getErrorMessage } from "../services/api";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl text-paper mb-2">Praxis</h1>
          <p className="text-paper-muted text-sm">Practice with intention.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-ink-raised hairline rounded-2xl p-8 flex flex-col gap-5">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-bad">{error}</p>}

          <Button type="submit" isLoading={isLoading} className="w-full mt-1">
            Log in
          </Button>
        </form>

        <p className="text-center text-sm text-paper-muted mt-6">
          New here?{" "}
          <Link to="/register" className="text-accent hover:text-accent-hover">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
