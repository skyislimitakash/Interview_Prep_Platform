import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/Button";
import { getErrorMessage } from "../services/api";

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await register({ name, email, password });
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
          <p className="text-paper-muted text-sm">Start your first session in a minute.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-ink-raised hairline rounded-2xl p-8 flex flex-col gap-5">
          <Input
            label="Full name"
            type="text"
            name="name"
            placeholder="Alex Johnson"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && <p className="text-sm text-bad">{error}</p>}

          <Button type="submit" isLoading={isLoading} className="w-full mt-1">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-paper-muted mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:text-accent-hover">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
