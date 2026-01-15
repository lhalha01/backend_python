import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the application title', () => {
    render(<App />);
    expect(screen.getByText(/Products API Console/i)).toBeInTheDocument();
  });

  it('renders tab buttons', () => {
    render(<App />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.some(btn => btn.textContent?.includes('Productos'))).toBe(true);
    expect(buttons.some(btn => btn.textContent?.includes('Request manual'))).toBe(true);
  });

  it('renders API base URL input', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/http:\/\/127.0.0.1:8000/i);
    expect(input).toBeInTheDocument();
  });
});
