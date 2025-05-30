import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const Header = styled.header`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: between;
  align-items: center;
`;

const Title = styled.h1`
  color: #1e293b;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
`;

const UserName = styled.span`
  color: #64748b;
  font-weight: 500;
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => 
    props.role === 'ADMIN' ? '#dc2626' : 
    props.role === 'MANAGER' ? '#ea580c' : '#059669'};
  color: white;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const Content = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h2`
  color: #1e293b;
  margin: 0 0 1rem 0;
  font-size: 28px;
`;

const WelcomeText = styled.p`
  color: #64748b;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ActionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ActionTitle = styled.h3`
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  font-size: 18px;
  font-weight: 600;
`;

const ActionDescription = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const quickActions = [
    {
      title: 'Log Time',
      description: 'Record your work hours for today',
      onClick: () => navigate('/timesheet')
    },
    {
      title: 'View Reports',
      description: 'See your timesheet history and analytics',
      onClick: () => navigate('/reports')
    }
  ];

  // Add role-specific actions
  if (user?.role === 'ADMIN') {
    quickActions.push(
      {
        title: 'Admin Panel',
        description: 'Manage users, teams, and system settings',
        onClick: () => navigate('/admin')
      },
      {
        title: 'Manager Tools',
        description: 'Access manager dashboard and team oversight',
        onClick: () => navigate('/manager')
      }
    );
  } else if (user?.role === 'MANAGER') {
    quickActions.push({
      title: 'Manage Team',
      description: 'View and manage your team\'s timesheets',
      onClick: () => navigate('/manager')
    });
  }

  quickActions.push({
    title: 'Manage Projects',
    description: 'View and manage your assigned projects',
    onClick: () => alert('Project management coming soon!')
  });

  return (
    <DashboardContainer>
      <Header>
        <Title>Timesheet Dashboard</Title>
        <UserInfo>
          <UserName>{user?.fullName}</UserName>
          <RoleBadge role={user?.role || 'TEAM_MEMBER'}>{user?.role}</RoleBadge>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserInfo>
      </Header>

      <Content>
        <WelcomeCard>
          <WelcomeTitle>Welcome back, {user?.firstName}! 👋</WelcomeTitle>
          <WelcomeText>
            Ready to track your time? Your timesheet dashboard gives you quick access to log hours, 
            view reports, and manage your projects. Let's make today productive!
          </WelcomeText>
        </WelcomeCard>

        <StatsGrid>
          <StatCard>
            <StatNumber>0</StatNumber>
            <StatLabel>Hours This Week</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>0</StatNumber>
            <StatLabel>Projects Active</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>0</StatNumber>
            <StatLabel>Days Logged</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>100%</StatNumber>
            <StatLabel>Completion Rate</StatLabel>
          </StatCard>
        </StatsGrid>

        <QuickActions>
          {quickActions.map((action, index) => (
            <ActionCard key={index} onClick={action.onClick}>
              <ActionTitle>{action.title}</ActionTitle>
              <ActionDescription>{action.description}</ActionDescription>
            </ActionCard>
          ))}
        </QuickActions>
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;