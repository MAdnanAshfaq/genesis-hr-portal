
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
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <img 
        src="/lovable-uploads/f9bc9259-f6cb-4ec1-ac50-57d59612dad0.png" 
        alt="GenesisHR Logo" 
        className="w-full h-full object-contain drop-shadow-lg"
      />
    </div>
  );
}
