import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { timesheetApi, projectsApi } from '../services/api';
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
  max-width: 800px;
  margin: 0 auto;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const SubmitButton = styled.button`
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  background: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
`;

const TimeEntry: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    projectId: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    hours: '',
    notes: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [projects, setProjects] = useState([]);

  // Load user's projects
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsData = await projectsApi.getMyProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setMessage('Failed to load projects. Please refresh the page.');
      setIsSuccess(false);
    }
  };

  // Mock projects for now - in real app, these would come from API
  const mockProjects = [
    { id: 1, name: 'Service Symphony Development' },
    { id: 2, name: 'Client Portal Updates' },
    { id: 3, name: 'Mobile App Enhancement' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const entryData = {
        projectId: parseInt(formData.projectId),
        date: formData.date,
        hours: parseFloat(formData.hours),
        notes: formData.notes || null
      };

      await timesheetApi.createEntry(entryData);
      
      setIsSuccess(true);
      setMessage('Time entry saved successfully!');
      
      // Reset form
      setFormData({
        projectId: '',
        date: new Date().toISOString().split('T')[0],
        hours: '',
        notes: ''
      });
      
    } catch (error) {
      setIsSuccess(false);
      setMessage('Failed to save time entry. Please try again.');
      console.error('Error saving time entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Log Time Entry</Title>
        <BackButton onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </BackButton>
      </Header>

      <Content>
        <FormCard>
          <h2 style={{ marginTop: 0, color: '#1e293b' }}>Record Your Work Hours</h2>
          
          {message && (
            isSuccess ? 
              <SuccessMessage>{message}</SuccessMessage> : 
              <ErrorMessage>{message}</ErrorMessage>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="projectId">Project *</Label>
              <Select
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a project...</option>
                {(projects.length > 0 ? projects : mockProjects).map((project: any) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="date">Date *</Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="hours">Hours Worked *</Label>
              <Input
                type="number"
                id="hours"
                name="hours"
                value={formData.hours}
                onChange={handleInputChange}
                min="0.25"
                max="24"
                step="0.25"
                placeholder="e.g., 8.5"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <TextArea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Describe what you worked on..."
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Time Entry'}
            </SubmitButton>
          </Form>
        </FormCard>
      </Content>
    </Container>
  );
};

export default TimeEntry;