import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Login } from './components/Login';
import { AdminLogin } from './components/AdminLogin';
import { UserShop } from './components/UserShop';
import { AdminPortal } from './components/AdminPortal';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <Login onAdminClick={() => setShowAdminLogin(true)} />
        {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}
      </>
    );
  }

  if (user?.isAdmin) {
    return <AdminPortal />;
  }

  return <UserShop />;
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
