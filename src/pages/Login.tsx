import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, ArrowRight, BookOpen, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Already logged in → go to dashboard
  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Users, label: 'Lead Management', desc: 'Track and convert school leads effortlessly' },
    { icon: BarChart3, label: 'Analytics', desc: 'Real-time insights on your sales pipeline' },
    { icon: BookOpen, label: 'Demo Scheduling', desc: 'Streamline your demo booking process' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, hsl(222, 47%, 11%) 0%, hsl(221, 60%, 20%) 100%)' }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'hsl(var(--primary))', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'hsl(var(--info))', transform: 'translate(-30%, 30%)' }} />

        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'hsl(var(--primary))' }}>
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-none">EduConnect</p>
            <p className="text-xs" style={{ color: 'hsl(210, 40%, 60%)' }}>Sales Control Center</p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Grow your EdTech<br />
            <span style={{ color: 'hsl(var(--primary))' }}>reach & revenue</span>
          </h1>
          <p style={{ color: 'hsl(210, 40%, 70%)' }} className="text-lg leading-relaxed max-w-sm">
            Your all-in-one platform to manage leads, schedule demos, and onboard schools at scale.
          </p>
          <div className="space-y-4 pt-4">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary))' }}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{label}</p>
                  <p className="text-xs" style={{ color: 'hsl(210, 40%, 60%)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs relative z-10" style={{ color: 'hsl(210, 40%, 50%)' }}>
          © 2026 EduConnect. Empowering schools worldwide.
        </p>
      </div>

      {/* Right panel - Login form */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-background">
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <p className="font-bold text-xl text-foreground">EduConnect</p>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-1 text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline" tabIndex={-1}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="rounded-lg border border-dashed p-4 text-center bg-muted/30">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Demo access</span> — Use any email & password to sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
