import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('App', () => {
  it('renders dashboard heading', () => {
    render(<App />);
    expect(screen.getByText('Welcome Back, Alex')).toBeInTheDocument();
  });
});