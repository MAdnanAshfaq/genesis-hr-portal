
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
}

export function StatsCard({ title, value, description, icon: Icon, trend, colorScheme = 'blue' }: StatsCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const numericValue = typeof value === 'number' ? value : parseInt(value.toString().replace(/\D/g, '')) || 0;

  useEffect(() => {
    setIsVisible(true);
    if (typeof value === 'number') {
      const duration = 1200;
      const steps = 50;
      const increment = numericValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setAnimatedValue(numericValue);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value, numericValue]);

  const getColorClasses = () => {
    switch (colorScheme) {
      case 'green':
        return {
          gradient: 'from-emerald-500/20 via-green-500/10 to-emerald-600/20',
          textGradient: 'from-emerald-300 to-green-300',
          iconBg: 'bg-gradient-to-br from-emerald-500/20 to-green-500/30',
          iconColor: 'text-emerald-300',
          border: 'border-emerald-400/30',
          glow: 'hover:shadow-emerald-500/20'
        };
      case 'amber':
        return {
          gradient: 'from-amber-500/20 via-yellow-500/10 to-orange-500/20',
          textGradient: 'from-amber-300 to-yellow-300',
          iconBg: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/30',
          iconColor: 'text-amber-300',
          border: 'border-amber-400/30',
          glow: 'hover:shadow-amber-500/20'
        };
      case 'purple':
        return {
          gradient: 'from-purple-500/20 via-violet-500/10 to-fuchsia-500/20',
          textGradient: 'from-purple-300 to-violet-300',
          iconBg: 'bg-gradient-to-br from-purple-500/20 to-violet-500/30',
          iconColor: 'text-purple-300',
          border: 'border-purple-400/30',
          glow: 'hover:shadow-purple-500/20'
        };
      case 'red':
        return {
          gradient: 'from-red-500/20 via-rose-500/10 to-pink-500/20',
          textGradient: 'from-red-300 to-rose-300',
          iconBg: 'bg-gradient-to-br from-red-500/20 to-rose-500/30',
          iconColor: 'text-red-300',
          border: 'border-red-400/30',
          glow: 'hover:shadow-red-500/20'
        };
      default: // blue
        return {
          gradient: 'from-blue-500/20 via-cyan-500/10 to-blue-600/20',
          textGradient: 'from-blue-300 to-cyan-300',
          iconBg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/30',
          iconColor: 'text-blue-300',
          border: 'border-blue-400/30',
          glow: 'hover:shadow-blue-500/20'
        };
    }
  };

  const colors = getColorClasses();
  const displayValue = typeof value === 'number' ? animatedValue : value;

  return (
    <Card className={`stats-card glass-card relative overflow-hidden backdrop-blur-xl bg-white/5 
      border ${colors.border} transition-all duration-300 ease-in-out
      hover:shadow-2xl ${colors.glow} group cursor-pointer`}>
      
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-50 
        transition-opacity duration-300 group-hover:opacity-70`}></div>
      
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
        -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
          {title}
        </CardTitle>
        <div className={`p-3 rounded-xl ${colors.iconBg} border ${colors.border} 
          group-hover:scale-110 transition-all duration-300`}>
          <Icon className={`h-5 w-5 ${colors.iconColor}`} />
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className={`text-3xl font-bold bg-gradient-to-r ${colors.textGradient} bg-clip-text text-transparent
          transition-all duration-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {displayValue}
        </div>
        
        {description && (
          <p className="text-xs text-white/60 mt-2 group-hover:text-white/70 transition-colors">
            {description}
          </p>
        )}
        
        {trend && (
          <div className={`flex items-center mt-3 text-xs transition-all duration-300 ${
            trend.isPositive ? 'text-emerald-400' : 'text-red-400'
          } group-hover:scale-105`}>
            <span className={`font-medium ${trend.isPositive ? 'text-emerald-300' : 'text-red-300'}`}>
              {trend.isPositive ? '↗' : '↘'}
            </span>
            <span className="ml-1 font-medium">
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
