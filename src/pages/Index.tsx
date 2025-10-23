
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/Auth/LoginForm';
import { MainApp } from '@/components/MainApp';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
          <p className="text-gray-600">Loading HR Portal...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <MainApp /> : <LoginForm />;
};

export default Index;
