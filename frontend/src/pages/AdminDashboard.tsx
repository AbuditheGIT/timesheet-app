import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usersApi, projectsApi } from '../services/api';
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

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 10px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  justify-self: start;

  &:hover {
    background: #059669;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const Badge = styled.span<{ role: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => 
    props.role === 'ADMIN' ? '#dc2626' : 
    props.role === 'MANAGER' ? '#ea580c' : '#059669'};
  color: white;
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 1rem;
  background: ${props => props.type === 'success' ? '#d1fae5' : '#fee2e2'};
  color: ${props => props.type === 'success' ? '#065f46' : '#dc2626'};
`;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' as 'success' | 'error' });

  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'TEAM_MEMBER'
  });

  const [newProject, setNewProject] = useState({
    name: '',
    clientName: '',
    description: '',
    hourlyRate: ''
  });

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Load data
  useEffect(() => {
    loadUsers();
    loadProjects();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await usersApi.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const projectsData = await projectsApi.getAllProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: 'success' });

    try {
      await usersApi.createUser(newUser);
      setMessage({ text: 'User created successfully!', type: 'success' });
      setNewUser({ email: '', firstName: '', lastName: '', password: '', role: 'TEAM_MEMBER' });
      loadUsers();
    } catch (error) {
      setMessage({ text: 'Failed to create user. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: 'success' });

    try {
      const projectData = {
        ...newProject,
        hourlyRate: newProject.hourlyRate ? parseFloat(newProject.hourlyRate) : null
      };
      await projectsApi.createProject(projectData);
      setMessage({ text: 'Project created successfully!', type: 'success' });
      setNewProject({ name: '', clientName: '', description: '', hourlyRate: '' });
      loadProjects();
    } catch (error) {
      setMessage({ text: 'Failed to create project. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Admin Dashboard</Title>
        <BackButton onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </BackButton>
      </Header>

      <Content>
        <TabContainer>
          <TabButtons>
            <TabButton 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')}
            >
              User Management
            </TabButton>
            <TabButton 
              active={activeTab === 'projects'} 
              onClick={() => setActiveTab('projects')}
            >
              Project Management
            </TabButton>
          </TabButtons>

          {message.text && (
            <Message type={message.type}>{message.text}</Message>
          )}

          {activeTab === 'users' && (
            <Card>
              <h2 style={{ marginTop: 0 }}>Create New User</h2>
              <Form onSubmit={handleCreateUser}>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Role</Label>
                  <Select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="TEAM_MEMBER">Team Member</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </Select>
                </FormGroup>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create User'}
                </Button>
              </Form>

              <h3>All Users</h3>
              <Table>
                <thead>
                  <tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id}>
                      <Td>{user.fullName}</Td>
                      <Td>{user.email}</Td>
                      <Td><Badge role={user.role}>{user.role}</Badge></Td>
                      <Td>{user.isActive ? 'Active' : 'Inactive'}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          )}

          {activeTab === 'projects' && (
            <Card>
              <h2 style={{ marginTop: 0 }}>Create New Project</h2>
              <Form onSubmit={handleCreateProject}>
                <FormGroup>
                  <Label>Project Name</Label>
                  <Input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Client Name</Label>
                  <Input
                    type="text"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({...newProject, clientName: e.target.value})}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Description</Label>
                  <Input
                    type="text"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Hourly Rate ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newProject.hourlyRate}
                    onChange={(e) => setNewProject({...newProject, hourlyRate: e.target.value})}
                  />
                </FormGroup>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Project'}
                </Button>
              </Form>

              <h3>All Projects</h3>
              <Table>
                <thead>
                  <tr>
                    <Th>Project Name</Th>
                    <Th>Client</Th>
                    <Th>Hourly Rate</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project: any) => (
                    <tr key={project.id}>
                      <Td>{project.name}</Td>
                      <Td>{project.clientName}</Td>
                      <Td>${project.hourlyRate || 'N/A'}</Td>
                      <Td>{project.isActive ? 'Active' : 'Inactive'}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          )}
        </TabContainer>
      </Content>
    </Container>
  );
};

export default AdminDashboard;