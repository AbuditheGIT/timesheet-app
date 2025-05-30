import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { timesheetApi, usersApi } from '../services/api';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const Header = styled.header`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #1e293b;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const BackButton = styled.button`
  padding: 8px 16px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #4f46e5;
  }
`;

const Content = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.active ? '#6366f1' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #e5e7eb;
  color: #374151;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #64748b;
`;

const StatusBadge = styled.span<{ status: 'complete' | 'incomplete' | 'pending' }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => 
    props.status === 'complete' ? '#10b981' : 
    props.status === 'incomplete' ? '#ef4444' : '#f59e0b'};
  color: white;
`;

const AlertCard = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const AlertTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #92400e;
`;

const AlertText = styled.p`
  margin: 0;
  color: #92400e;
  font-size: 14px;
`;

const WeekSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const WeekInput = styled.input`
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #059669;
  }
`;

interface TeamMember {
  id: number;
  fullName: string;
  email: string;
  hoursThisWeek: number;
  daysLogged: number;
  status: 'complete' | 'incomplete' | 'pending';
}

interface PendingApproval {
  id: number;
  employeeName: string;
  date: string;
  hours: number;
  project: string;
  status: string;
}

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(
    new Date().toISOString().split('T')[0].slice(0, 8) + '01' // First day of current month
  );

  // Redirect if not manager or admin
  useEffect(() => {
    if (user && !['MANAGER', 'ADMIN'].includes(user.role)) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Load team data
  useEffect(() => {
    loadTeamData();
    loadPendingApprovals();
  }, [selectedWeek]);

  const loadTeamData = async () => {
    try {
      // Mock data for now - in real app, this would call the backend
      const mockTeamMembers: TeamMember[] = [
        {
          id: 1,
          fullName: 'John Smith',
          email: 'john@company.com',
          hoursThisWeek: 38.5,
          daysLogged: 4,
          status: 'incomplete'
        },
        {
          id: 2,
          fullName: 'Sarah Johnson',
          email: 'sarah@company.com',
          hoursThisWeek: 40,
          daysLogged: 5,
          status: 'complete'
        },
        {
          id: 3,
          fullName: 'Mike Davis',
          email: 'mike@company.com',
          hoursThisWeek: 32,
          daysLogged: 4,
          status: 'incomplete'
        }
      ];
      setTeamMembers(mockTeamMembers);
    } catch (error) {
      console.error('Failed to load team data:', error);
    }
  };

  const loadPendingApprovals = async () => {
    try {
      // Mock data - in real app, this would call the backend
      const mockApprovals: PendingApproval[] = [
        {
          id: 1,
          employeeName: 'John Smith',
          date: '2025-05-29',
          hours: 8.5,
          project: 'Service Symphony Development',
          status: 'pending'
        },
        {
          id: 2,
          employeeName: 'Mike Davis',
          date: '2025-05-28',
          hours: 7,
          project: 'Client Portal Updates',
          status: 'pending'
        }
      ];
      setPendingApprovals(mockApprovals);
    } catch (error) {
      console.error('Failed to load pending approvals:', error);
    }
  };

  const handleApproveEntry = (entryId: number) => {
    // In real app, this would call the backend
    alert(`Approved entry ${entryId}`);
    loadPendingApprovals();
  };

  const handleRejectEntry = (entryId: number) => {
    // In real app, this would call the backend
    alert(`Rejected entry ${entryId}`);
    loadPendingApprovals();
  };

  const incompleteCount = teamMembers.filter(member => member.status === 'incomplete').length;
  const averageHours = teamMembers.reduce((sum, member) => sum + member.hoursThisWeek, 0) / teamMembers.length || 0;

  return (
    <Container>
      <Header>
        <Title>Manager Dashboard</Title>
        <BackButton onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </BackButton>
      </Header>

      <Content>
        {/* Alerts */}
        {incompleteCount > 0 && (
          <AlertCard>
            <AlertTitle>⚠️ Attention Required</AlertTitle>
            <AlertText>
              {incompleteCount} team member(s) have incomplete timesheets for this week.
            </AlertText>
          </AlertCard>
        )}

        {/* Stats Overview */}
        <StatsGrid>
          <StatCard>
            <StatNumber>{teamMembers.length}</StatNumber>
            <StatLabel>Team Members</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{averageHours.toFixed(1)}</StatNumber>
            <StatLabel>Avg Hours/Week</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{pendingApprovals.length}</StatNumber>
            <StatLabel>Pending Approvals</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{teamMembers.filter(m => m.status === 'complete').length}</StatNumber>
            <StatLabel>Complete This Week</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* Tabs */}
        <TabContainer>
          <TabButtons>
            <TabButton 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
            >
              Team Overview
            </TabButton>
            <TabButton 
              active={activeTab === 'approvals'} 
              onClick={() => setActiveTab('approvals')}
            >
              Pending Approvals ({pendingApprovals.length})
            </TabButton>
            <TabButton 
              active={activeTab === 'reports'} 
              onClick={() => setActiveTab('reports')}
            >
              Team Reports
            </TabButton>
          </TabButtons>

          {activeTab === 'overview' && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Team Timesheet Status</h2>
                <WeekSelector>
                  <label>Week of:</label>
                  <WeekInput
                    type="date"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                  />
                </WeekSelector>
              </div>

              <Table>
                <thead>
                  <tr>
                    <Th>Employee</Th>
                    <Th>Hours This Week</Th>
                    <Th>Days Logged</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => (
                    <tr key={member.id}>
                      <Td>
                        <div>
                          <div style={{ fontWeight: 600 }}>{member.fullName}</div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{member.email}</div>
                        </div>
                      </Td>
                      <Td>{member.hoursThisWeek}</Td>
                      <Td>{member.daysLogged}/5</Td>
                      <Td>
                        <StatusBadge status={member.status}>
                          {member.status}
                        </StatusBadge>
                      </Td>
                      <Td>
                        <ActionButton onClick={() => alert(`View ${member.fullName}'s timesheet`)}>
                          View Details
                        </ActionButton>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          )}

          {activeTab === 'approvals' && (
            <Card>
              <h2 style={{ marginTop: 0 }}>Pending Timesheet Approvals</h2>
              
              {pendingApprovals.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                  No pending approvals at this time.
                </p>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <Th>Employee</Th>
                      <Th>Date</Th>
                      <Th>Hours</Th>
                      <Th>Project</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApprovals.map((approval) => (
                      <tr key={approval.id}>
                        <Td>{approval.employeeName}</Td>
                        <Td>{new Date(approval.date).toLocaleDateString()}</Td>
                        <Td>{approval.hours} hrs</Td>
                        <Td>{approval.project}</Td>
                        <Td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <ActionButton onClick={() => handleApproveEntry(approval.id)}>
                              Approve
                            </ActionButton>
                            <ActionButton 
                              onClick={() => handleRejectEntry(approval.id)}
                              style={{ background: '#ef4444' }}
                            >
                              Reject
                            </ActionButton>
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          )}

          {activeTab === 'reports' && (
            <Card>
              <h2 style={{ marginTop: 0 }}>Team Reports</h2>
              <p style={{ color: '#64748b' }}>
                Generate and export detailed reports for your team's timesheet data.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <ActionButton onClick={() => alert('Generating weekly report...')}>
                  Weekly Report
                </ActionButton>
                <ActionButton onClick={() => alert('Generating monthly report...')}>
                  Monthly Report
                </ActionButton>
                <ActionButton onClick={() => navigate('/reports')}>
                  Advanced Reports
                </ActionButton>
              </div>
            </Card>
          )}
        </TabContainer>
      </Content>
    </Container>
  );
};

export default ManagerDashboard;