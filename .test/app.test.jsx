import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../app/App';

describe('App', () => {
  it('renders the heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Profile');
  });

  it('renders body text', () => {
    render(<App />);
    expect(screen.getByText('Ready to build.')).toBeInTheDocument();
  });
});
