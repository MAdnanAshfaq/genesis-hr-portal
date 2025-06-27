
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
      const duration = 1500;
      const steps = 60;
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
          gradient: 'from-green-400/20 via-emerald-400/10 to-green-500/20',
          textGradient: 'from-green-600 to-emerald-600',
          iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100',
          iconColor: 'text-green-600',
          shadow: 'shadow-green-200/30 hover:shadow-green-300/40',
          glow: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]'
        };
      case 'amber':
        return {
          gradient: 'from-amber-400/20 via-yellow-400/10 to-amber-500/20',
          textGradient: 'from-amber-600 to-yellow-600',
          iconBg: 'bg-gradient-to-br from-amber-100 to-yellow-100',
          iconColor: 'text-amber-600',
          shadow: 'shadow-amber-200/30 hover:shadow-amber-300/40',
          glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]'
        };
      case 'purple':
        return {
          gradient: 'from-purple-400/20 via-violet-400/10 to-purple-500/20',
          textGradient: 'from-purple-600 to-violet-600',
          iconBg: 'bg-gradient-to-br from-purple-100 to-violet-100',
          iconColor: 'text-purple-600',
          shadow: 'shadow-purple-200/30 hover:shadow-purple-300/40',
          glow: 'hover:shadow-[0_0_30px_rgba(147,51,234,0.3)]'
        };
      case 'red':
        return {
          gradient: 'from-red-400/20 via-pink-400/10 to-red-500/20',
          textGradient: 'from-red-600 to-pink-600',
          iconBg: 'bg-gradient-to-br from-red-100 to-pink-100',
          iconColor: 'text-red-600',
          shadow: 'shadow-red-200/30 hover:shadow-red-300/40',
          glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]'
        };
      default: // blue
        return {
          gradient: 'from-blue-400/20 via-primary/10 to-info/20',
          textGradient: 'from-primary to-info',
          iconBg: 'bg-gradient-to-br from-blue-100 to-primary/20',
          iconColor: 'text-primary',
          shadow: 'shadow-blue-200/30 hover:shadow-blue-300/40',
          glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'
        };
    }
  };

  const colors = getColorClasses();

  const displayValue = typeof value === 'number' ? animatedValue : value;

  return (
    <Card className={`stats-card group relative overflow-hidden backdrop-blur-md bg-white/80 border-white/20 
      hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 cursor-pointer
      ${colors.shadow} ${colors.glow} animate-float hover:animate-none`}>
      
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-60 
        transition-opacity duration-500 group-hover:opacity-80`}></div>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
        -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-xl ${colors.iconBg} group-hover:scale-110 transition-all duration-300`}>
          <Icon className={`h-4 w-4 ${colors.iconColor} group-hover:animate-pulse`} />
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className={`text-3xl font-bold bg-gradient-to-r ${colors.textGradient} bg-clip-text text-transparent
          transition-all duration-300 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          {displayValue}
          {typeof value === 'number' && trend && (
            <span className="animate-pulse">+</span>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-gray-600 mt-2 group-hover:text-gray-700 transition-colors">
            {description}
          </p>
        )}
        
        {trend && (
          <div className={`flex items-center mt-2 text-xs transition-all duration-300 ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          } group-hover:scale-105`}>
            <span className={`animate-pulse ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? '↗' : '↘'}
            </span>
            <span className="ml-1 font-medium">
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </span>
          </div>
        )}
        
        {/* Floating particles for enhanced visual appeal */}
        <div className="absolute top-2 right-2 w-1 h-1 bg-white/40 rounded-full animate-ping 
          opacity-0 group-hover:opacity-100 transition-opacity delay-200"></div>
        <div className="absolute bottom-4 left-3 w-0.5 h-0.5 bg-white/30 rounded-full animate-ping 
          opacity-0 group-hover:opacity-100 transition-opacity delay-500"></div>
      </CardContent>
    </Card>
  );
}
