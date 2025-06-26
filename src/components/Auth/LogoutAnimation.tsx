
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface LogoutAnimationProps {
  onComplete: () => void;
}

export function LogoutAnimation({ onComplete }: LogoutAnimationProps) {
  const [showPortalClose, setShowPortalClose] = useState(false);
  const [showHandPush, setShowHandPush] = useState(false);
  const [pageReturning, setPageReturning] = useState(false);

  useEffect(() => {
    // Start logout animation sequence
    console.log('Starting logout animation sequence');
    
    // Show portal closing
    setTimeout(() => {
      console.log('Showing portal close');
      setShowPortalClose(true);
    }, 100);
    
    // Show hand pushing page back
    setTimeout(() => {
      console.log('Showing hand push animation');
      setShowHandPush(true);
    }, 800);
    
    // Start page return animation
    setTimeout(() => {
      console.log('Starting page return');
      setPageReturning(true);
    }, 1200);
    
    // Complete logout
    setTimeout(() => {
      console.log('Logout animation complete');
      onComplete();
    }, 2500);
  }, [onComplete]);

  return (
    <div className="logout-wrapper fixed inset-0 z-50 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20"></div>
      </div>

      {/* Portal closing effect */}
      {showPortalClose && (
        <div className="portal-close-overlay fixed inset-0 z-40 flex items-center justify-center">
          <div className="portal-container-close">
            <div className="portal-ring portal-ring-outer-close"></div>
            <div className="portal-ring portal-ring-middle-close"></div>
            <div className="portal-ring portal-ring-inner-close"></div>
            <div className="portal-center-close">
              <Sparkles className="w-20 h-20 text-white animate-pulse" />
              <div className="portal-energy-close"></div>
            </div>
          </div>
        </div>
      )}

      {/* Hand pushing animation */}
      {showHandPush && (
        <div className="hand-push-container fixed inset-0 z-30 pointer-events-none">
          <div className="realistic-hand-wrapper-push">
            <div className="realistic-hand-push">
              <div className="hand-shadow-push"></div>
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

      {/* Page returning like cloth */}
      <div className={`login-page-return ${pageReturning ? 'cloth-returning' : ''}`}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-2xl">G</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                GenesisHR
              </h2>
              <p className="text-purple-200 mt-2 text-lg">Goodbye! Come back soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
