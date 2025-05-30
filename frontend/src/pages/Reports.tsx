import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { timesheetApi, usersApi, projectsApi } from '../services/api';
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

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

  &:hover {
    background: #059669;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ExportButton = styled.button`
  padding: 12px 24px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: 1rem;

  &:hover {
    background: #4f46e5;
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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const SummaryNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const SummaryLabel = styled.div`
  color: #64748b;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NoData = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;
`;

interface TimesheetData {
  id: number;
  employeeName: string;
  projectName: string;
  clientName: string;
  date: string;
  hours: number;
  notes?: string;
}

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    userId: '',
    projectId: '',
    reportType: 'detailed'
  });
  
  const [reportData, setReportData] = useState<TimesheetData[]>([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalHours: 0,
    totalEntries: 0,
    uniqueEmployees: 0,
    uniqueProjects: 0
  });

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
        const [usersData, projectsData] = await Promise.all([
          usersApi.getAllUsers(),
          projectsApi.getAllProjects()
        ]);
        setUsers(usersData);
        setProjects(projectsData);
      } else {
        // For team members, only load their projects
        const projectsData = await projectsApi.getMyProjects();
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      // Mock data for now - in real app, this would call the backend with filters
      const mockData: TimesheetData[] = [
        {
          id: 1,
          employeeName: 'John Smith',
          projectName: 'Service Symphony Development',
          clientName: 'Service Symphony',
          date: '2025-05-29',
          hours: 8,
          notes: 'Frontend development'
        },
        {
          id: 2,
          employeeName: 'Sarah Johnson',
          projectName: 'Client Portal Updates',
          clientName: 'ABC Corp',
          date: '2025-05-29',
          hours: 7.5,
          notes: 'UI improvements'
        },
        {
          id: 3,
          employeeName: 'Mike Davis',
          projectName: 'Mobile App Enhancement',
          clientName: 'XYZ Inc',
          date: '2025-05-28',
          hours: 6,
          notes: 'Bug fixes and testing'
        },
        {
          id: 4,
          employeeName: 'Admin User',
          projectName: 'Service Symphony Development',
          clientName: 'Service Symphony',
          date: '2025-05-30',
          hours: 8.5,
          notes: 'Backend API development'
        },
        {
          id: 5,
          employeeName: 'John Smith',
          projectName: 'Mobile App Enhancement',
          clientName: 'XYZ Inc',
          date: '2025-05-27',
          hours: 7,
          notes: 'Feature implementation'
        }
      ];

      // Apply filters to mock data
      let filteredData = mockData;
      
      if (filters.userId) {
        filteredData = filteredData.filter(item => item.employeeName.includes('John')); // Mock filter
      }
      
      if (filters.projectId) {
        filteredData = filteredData.filter(item => item.projectName.includes('Service')); // Mock filter
      }

      // Filter by date range
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.date);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        return itemDate >= startDate && itemDate <= endDate;
      });

      setReportData(filteredData);

      // Calculate summary
      const totalHours = filteredData.reduce((sum, item) => sum + item.hours, 0);
      const uniqueEmployees = new Set(filteredData.map(item => item.employeeName)).size;
      const uniqueProjects = new Set(filteredData.map(item => item.projectName)).size;

      setSummary({
        totalHours,
        totalEntries: filteredData.length,
        uniqueEmployees,
        uniqueProjects
      });

    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (reportData.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Employee', 'Project', 'Client', 'Date', 'Hours', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => [
        row.employeeName,
        row.projectName,
        row.clientName,
        row.date,
        row.hours,
        row.notes || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `timesheet_report_${filters.startDate}_to_${filters.endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Container>
      <Header>
        <Title>Reports & Analytics</Title>
        <BackButton onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </BackButton>
      </Header>

      <Content>
        <Card>
          <h2 style={{ marginTop: 0 }}>Generate Timesheet Report</h2>
          
          <FilterGrid>
            <FormGroup>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>End Date</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </FormGroup>

            {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
              <FormGroup>
                <Label>Employee</Label>
                <Select
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                >
                  <option value="">All Employees</option>
                  {users.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.fullName}</option>
                  ))}
                </Select>
              </FormGroup>
            )}

            <FormGroup>
              <Label>Project</Label>
              <Select
                value={filters.projectId}
                onChange={(e) => handleFilterChange('projectId', e.target.value)}
              >
                <option value="">All Projects</option>
                {projects.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Report Type</Label>
              <Select
                value={filters.reportType}
                onChange={(e) => handleFilterChange('reportType', e.target.value)}
              >
                <option value="detailed">Detailed</option>
                <option value="summary">Summary</option>
                <option value="by-project">By Project</option>
                <option value="by-employee">By Employee</option>
              </Select>
            </FormGroup>
          </FilterGrid>

          <div>
            <Button onClick={generateReport} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
            {reportData.length > 0 && (
              <ExportButton onClick={exportToCSV}>
                Export to CSV
              </ExportButton>
            )}
          </div>
        </Card>

        {reportData.length > 0 && (
          <>
            <Card>
              <h3 style={{ marginTop: 0 }}>Report Summary</h3>
              <SummaryGrid>
                <SummaryCard>
                  <SummaryNumber>{summary.totalHours}</SummaryNumber>
                  <SummaryLabel>Total Hours</SummaryLabel>
                </SummaryCard>
                <SummaryCard>
                  <SummaryNumber>{summary.totalEntries}</SummaryNumber>
                  <SummaryLabel>Total Entries</SummaryLabel>
                </SummaryCard>
                <SummaryCard>
                  <SummaryNumber>{summary.uniqueEmployees}</SummaryNumber>
                  <SummaryLabel>Employees</SummaryLabel>
                </SummaryCard>
                <SummaryCard>
                  <SummaryNumber>{summary.uniqueProjects}</SummaryNumber>
                  <SummaryLabel>Projects</SummaryLabel>
                </SummaryCard>
              </SummaryGrid>
            </Card>

            <Card>
              <h3 style={{ marginTop: 0 }}>Report Data</h3>
              <Table>
                <thead>
                  <tr>
                    <Th>Employee</Th>
                    <Th>Project</Th>
                    <Th>Client</Th>
                    <Th>Date</Th>
                    <Th>Hours</Th>
                    <Th>Notes</Th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((entry) => (
                    <tr key={entry.id}>
                      <Td>{entry.employeeName}</Td>
                      <Td>{entry.projectName}</Td>
                      <Td>{entry.clientName}</Td>
                      <Td>{new Date(entry.date).toLocaleDateString()}</Td>
                      <Td>{entry.hours} hrs</Td>
                      <Td>{entry.notes || '-'}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </>
        )}

        {!loading && reportData.length === 0 && (
          <Card>
            <NoData>
              <h3>No Data Found</h3>
              <p>Try adjusting your filters and generate a new report.</p>
            </NoData>
          </Card>
        )}
      </Content>
    </Container>
  );
};

export default Reports;