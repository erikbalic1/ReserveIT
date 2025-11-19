const API_URL = 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// User API
export const userAPI = {
  register: async (userData) => {
    return await apiCall('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  login: async (credentials) => {
    return await apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  getAll: async () => {
    return await apiCall('/users');
  },

  getById: async (id) => {
    return await apiCall(`/users/${id}`);
  },

  delete: async (id) => {
    return await apiCall(`/users/${id}`, {
      method: 'DELETE'
    });
  }
};

// Company API
export const companyAPI = {
  register: async (companyData) => {
    return await apiCall('/companies/register', {
      method: 'POST',
      body: JSON.stringify(companyData)
    });
  },

  login: async (credentials) => {
    return await apiCall('/companies/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  getAll: async () => {
    return await apiCall('/companies');
  },

  getById: async (id) => {
    return await apiCall(`/companies/${id}`);
  }
};

// Reservation API
export const reservationAPI = {
  getAll: async () => {
    return await apiCall('/reservations');
  },

  getById: async (id) => {
    return await apiCall(`/reservations/${id}`);
  },

  getByUser: async (userId) => {
    return await apiCall(`/reservations/user/${userId}`);
  },

  getByCompany: async (companyId) => {
    return await apiCall(`/reservations/company/${companyId}`);
  },

  create: async (reservationData) => {
    return await apiCall('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
  },

  update: async (id, updates) => {
    return await apiCall(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  delete: async (id) => {
    return await apiCall(`/reservations/${id}`, {
      method: 'DELETE'
    });
  }
};
