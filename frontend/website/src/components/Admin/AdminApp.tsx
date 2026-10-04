import React from 'react';
import { AdminDataProvider } from '../../context/AdminDataContext';
import { AdminAuthGate } from './AdminAuthGate';
import { AdminDashboard } from './AdminDashboard';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const AdminAppInner: React.FC = () => {
  const auth = useAdminAuth();

  const handleBackToSite = () => {
    window.location.href = '/';
  };

  const handleLogout = () => {
    auth.logout();
  };

  if (auth.isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#03060d] text-cyan font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-cyan border-t-transparent animate-spin" />
          <span>CHECKING SYSTEM CREDENTIALS...</span>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <AdminAuthGate
        auth={auth}
        onAuthenticated={() => {
          auth.refreshAuth();
        }}
        onCancel={handleBackToSite}
      />
    );
  }

  return (
    <AdminDashboard
      currentUser={auth.currentUser}
      onBackToSite={handleBackToSite}
      onLogout={handleLogout}
    />
  );
};

export default function AdminApp() {
  return (
    <AdminDataProvider>
      <AdminAppInner />
    </AdminDataProvider>
  );
}
