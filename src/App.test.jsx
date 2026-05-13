import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import { DataProvider } from './context/DataContext.jsx';

describe('App', () => {
  it('renders dashboard heading', () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <App />
        </DataProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Welcome Back, Xavier')).toBeInTheDocument();
  });
});