
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import MainApp from './MainApp';

const AppContent: React.FC = () => {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        // You can return a global loading spinner here if desired
        return <div className="fixed inset-0 bg-bg-primary flex items-center justify-center"><h1 className="text-2xl text-accent">Carregando...</h1></div>;
    }

    return currentUser ? <MainApp /> : <AuthPage />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
