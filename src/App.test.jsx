import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';

describe('App', () => {
  it('renders login page when not authenticated', () => {
    // Clear any stored auth so the user is logged out
    localStorage.removeItem('xavalux.auth.v1');
    render(
      <MemoryRouter>
        <AuthProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('XAVALUX')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });
});