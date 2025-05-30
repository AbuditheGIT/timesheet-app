const API_BASE_URL = 'http://localhost:8080/api';

// Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Dashboard API
export const dashboardApi = {
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Projects API
export const projectsApi = {
  getMyProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/projects/my`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  getAllProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createProject: async (projectData: any) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });
    return handleResponse(response);
  }
};

// Timesheet API
export const timesheetApi = {
  createEntry: async (entryData: any) => {
    const response = await fetch(`${API_BASE_URL}/timesheet`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entryData)
    });
    return handleResponse(response);
  },

  getEntries: async (startDate: string, endDate: string) => {
    const response = await fetch(
      `${API_BASE_URL}/timesheet?startDate=${startDate}&endDate=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  getRecentEntries: async () => {
    const response = await fetch(`${API_BASE_URL}/timesheet/recent`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Users API (Admin only)
export const usersApi = {
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createUser: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};