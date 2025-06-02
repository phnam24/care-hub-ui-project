
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';
import Layout from '@/components/Layout';
import PatientDashboard from '@/components/dashboards/PatientDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

const Index = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'patient':
        return <PatientDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Unknown user role</div>;
    }
  };

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
};

export default Index;
