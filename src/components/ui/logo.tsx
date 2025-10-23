
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg`}>
      <span className="text-white font-bold text-sm">HR</span>
    </div>
  );
}
