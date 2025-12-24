import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProjectOwnerDashboard } from "@/components/dashboard/ProjectOwnerDashboard";
import { InvestorDashboard } from "@/components/dashboard/InvestorDashboard";
import { FunderDashboard } from "@/components/dashboard/FunderDashboard";

type UserType = 'individual' | 'enterprise' | 'investor' | 'funder';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [userType, setUserType] = useState<UserType>('individual');
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    document.title = "Tableau de bord | MIPROJET";
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();
      
      if (data?.user_type) {
        setUserType(data.user_type as UserType);
      }
      setProfileLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const renderDashboardContent = () => {
    switch (userType) {
      case 'investor':
        return <InvestorDashboard />;
      case 'funder':
        return <FunderDashboard />;
      case 'enterprise':
      case 'individual':
      default:
        return <ProjectOwnerDashboard />;
    }
  };

  return (
    <DashboardLayout userType={userType}>
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default Dashboard;