
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles } from 'lucide-react';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPortal, setShowPortal] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login({ username, password });
      if (success) {
        // Start portal animation
        setShowPortal(true);
        
        // Slide out the form after a delay
        setTimeout(() => {
          setSlideOut(true);
        }, 800);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      if (!showPortal) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Portal effect */}
      {showPortal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="w-96 h-96 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute w-64 h-64 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full animate-pulse"></div>
          <div className="absolute w-32 h-32 bg-white rounded-full animate-spin"></div>
          <div className="absolute flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-white animate-pulse" />
          </div>
        </div>
      )}

      <div className={`w-full max-w-md space-y-8 transition-all duration-1000 transform ${slideOut ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'} cursor-none`}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300 hover:shadow-purple-500/50">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Welcome to GenesisHR</h2>
          <p className="text-purple-200 mt-2 text-lg">Enter the future of workforce management</p>
        </div>

        <Card className="backdrop-blur-md bg-white/10 border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Portal Access</CardTitle>
            <CardDescription className="text-purple-200">
              Authenticate to enter your digital workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-purple-200 text-lg">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="bg-white/20 border-purple-400/50 text-white placeholder-purple-300 focus:border-purple-300 focus:ring-purple-300/50 h-12 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-purple-200 text-lg">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="bg-white/20 border-purple-400/50 text-white placeholder-purple-300 focus:border-purple-300 focus:ring-purple-300/50 h-12 text-lg"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-500/20 border-red-400/50 animate-shake">
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/50" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? 'Accessing Portal...' : 'Enter Portal'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials info */}
        <div className="text-center text-purple-300 text-sm">
          <p className="mb-1">Demo Credentials:</p>
          <p className="font-mono text-xs">admin / Genesis@123</p>
          <p className="font-mono text-xs">hr_sarah / Genesis@123</p>
          <p className="font-mono text-xs">manager_sales / Genesis@123</p>
        </div>
      </div>
    </div>
  );
}
