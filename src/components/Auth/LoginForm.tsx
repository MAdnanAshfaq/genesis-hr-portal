
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
  const [showHandAnimation, setShowHandAnimation] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [pageBeingDragged, setPageBeingDragged] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login({ username, password });
      if (success) {
        console.log('Login successful, starting animation sequence');
        setAnimationStarted(true);
        
        // Start the cinematic sequence
        setTimeout(() => {
          console.log('Showing hand animation');
          setShowHandAnimation(true);
        }, 300);
        
        // Start page dragging after hand grabs
        setTimeout(() => {
          console.log('Starting page drag');
          setPageBeingDragged(true);
        }, 1500);
        
        // Show portal effect
        setTimeout(() => {
          console.log('Showing portal');
          setShowPortal(true);
        }, 2000);
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-wrapper min-h-screen relative overflow-hidden">
      {/* Background with enhanced gradient */}
      <div className="signin-background absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      {/* Particle effects during drag */}
      {pageBeingDragged && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/70 rounded-full animate-fiber-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Realistic Hand Animation */}
      {showHandAnimation && (
        <div className="hand-animation-container fixed inset-0 z-40 pointer-events-none">
          <div className="realistic-hand-wrapper">
            <div className="realistic-hand">
              <div className="hand-shadow"></div>
              <div className="hand-wrist">
                <div className="wrist-base"></div>
              </div>
              <div className="hand-palm">
                <div className="palm-base"></div>
                <div className="palm-lines"></div>
              </div>
              <div className="hand-thumb">
                <div className="thumb-segment-1"></div>
                <div className="thumb-segment-2">
                  <div className="thumb-nail"></div>
                </div>
              </div>
              <div className="hand-finger finger-index">
                <div className="finger-segment-1"></div>
                <div className="finger-segment-2"></div>
                <div className="finger-segment-3">
                  <div className="finger-nail"></div>
                </div>
              </div>
              <div className="hand-finger finger-middle">
                <div className="finger-segment-1"></div>
                <div className="finger-segment-2"></div>
                <div className="finger-segment-3">
                  <div className="finger-nail"></div>
                </div>
              </div>
              <div className="hand-finger finger-ring">
                <div className="finger-segment-1"></div>
                <div className="finger-segment-2"></div>
                <div className="finger-segment-3">
                  <div className="finger-nail"></div>
                </div>
              </div>
              <div className="hand-finger finger-pinky">
                <div className="finger-segment-1"></div>
                <div className="finger-segment-2"></div>
                <div className="finger-segment-3">
                  <div className="finger-nail"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portal Effect */}
      {showPortal && (
        <div className="portal-overlay fixed inset-0 z-50 flex items-center justify-center">
          <div className="portal-container">
            <div className="portal-ring portal-ring-outer"></div>
            <div className="portal-ring portal-ring-middle"></div>
            <div className="portal-ring portal-ring-inner"></div>
            <div className="portal-center">
              <Sparkles className="w-20 h-20 text-white animate-pulse" />
              <div className="portal-energy"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main signin page with cloth physics */}
      <div className={`signin-page-cloth ${pageBeingDragged ? 'cloth-being-dragged' : ''} ${showPortal ? 'cloth-hidden' : ''}`}>
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300 hover:shadow-purple-500/50">
                  <span className="text-white font-bold text-2xl">G</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Welcome to GenesisHR</h2>
              <p className="text-purple-200 mt-2 text-lg">Enter the future of workforce management</p>
            </div>

            <Card className="signin-card backdrop-blur-md bg-white/10 border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105">
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
                    className={`signin-button w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/50 ${isLoading && animationStarted ? 'button-being-grabbed' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {isLoading ? 'Accessing Portal...' : 'Enter Portal'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
