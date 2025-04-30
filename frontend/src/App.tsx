import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { routes } from './routes';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Navbar from './components/Navbar';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <Navbar />
          <AppRoutes />
          <Toaster position="top-right" />
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;