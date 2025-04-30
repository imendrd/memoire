import axios from 'axios';

// This would be your actual API URL in production
const API_URL = 'https://api.example.com';

// For development, we'll use mock data
const USE_MOCK = true;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock data for development
const mockUsers = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  },
];

const mockTasks = [
  {
    id: '1',
    userId: '1',
    title: 'Complete project proposal',
    description: 'Finish the project proposal for the client meeting',
    completed: false,
    dueDate: '2025-06-15',
    reminder: '2025-06-14T09:00:00',
  },
  {
    id: '2',
    userId: '1',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, and vegetables',
    completed: true,
    dueDate: '2025-06-10',
    reminder: null,
  },
  {
    id: '3',
    userId: '1',
    title: 'Schedule dentist appointment',
    description: 'Call Dr. Smith for a checkup',
    completed: false,
    dueDate: '2025-06-20',
    reminder: '2025-06-19T14:00:00',
  },
];

// Mock API functions
const mockAPI = {
  // Auth
  login: async (email: string, password: string) => {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      return { token: 'mock-jwt-token', user: { ...user, password: undefined } };
    }
    throw new Error('Invalid credentials');
  },
  
  register: async (name: string, email: string, password: string) => {
    if (mockUsers.some((u) => u.email === email)) {
      throw new Error('User already exists');
    }
    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password,
    };
    mockUsers.push(newUser);
    return { token: 'mock-jwt-token', user: { ...newUser, password: undefined } };
  },
  
  getProfile: async () => {
    return { ...mockUsers[0], password: undefined };
  },
  
  updateProfile: async (data: { name?: string; email?: string }) => {
    Object.assign(mockUsers[0], data);
    return { ...mockUsers[0], password: undefined };
  },
  
  // Tasks
  getTasks: async () => {
    return mockTasks;
  },
  
  createTask: async (taskData: any) => {
    const newTask = {
      id: String(mockTasks.length + 1),
      userId: '1',
      ...taskData,
    };
    mockTasks.push(newTask);
    return newTask;
  },
  
  updateTask: async (id: string, taskData: any) => {
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      mockTasks[index] = { ...mockTasks[index], ...taskData };
      return mockTasks[index];
    }
    throw new Error('Task not found');
  },
  
  deleteTask: async (id: string) => {
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      mockTasks.splice(index, 1);
      return { success: true };
    }
    throw new Error('Task not found');
  },
};

// Export API functions that will either use mock or real API
export default {
  // Auth
  login: async (email: string, password: string) => {
    if (USE_MOCK) return mockAPI.login(email, password);
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string) => {
    if (USE_MOCK) return mockAPI.register(name, email, password);
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  getProfile: async () => {
    if (USE_MOCK) return mockAPI.getProfile();
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (data: { name?: string; email?: string }) => {
    if (USE_MOCK) return mockAPI.updateProfile(data);
    const response = await api.put('/users/profile', data);
    return response.data;
  },
  
  // Tasks
  getTasks: async () => {
    if (USE_MOCK) return mockAPI.getTasks();
    const response = await api.get('/tasks');
    return response.data;
  },
  
  createTask: async (taskData: any) => {
    if (USE_MOCK) return mockAPI.createTask(taskData);
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  updateTask: async (id: string, taskData: any) => {
    if (USE_MOCK) return mockAPI.updateTask(id, taskData);
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  
  deleteTask: async (id: string) => {
    if (USE_MOCK) return mockAPI.deleteTask(id);
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};