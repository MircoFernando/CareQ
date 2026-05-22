import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from 'react-hot-toast';
import router from './router';

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Toast provider with modern, sleek styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-sans text-sm font-semibold select-none',
          style: {
            borderRadius: '12px',
            background: '#FFFFFF',
            color: '#1A1A2E',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '12px 16px',
          },
        }}
      />
      
      {/* Active Router */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
