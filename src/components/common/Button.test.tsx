import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders an internal router link when `to` is set', () => {
    render(
      <MemoryRouter>
        <Button to="/projects">Explore</Button>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Explore' })).toHaveAttribute('href', '/projects');
  });

  it('renders an external anchor with a safe rel when `href` is set', () => {
    render(<Button href="https://example.test">External</Button>);
    const link = screen.getByRole('link', { name: 'External' });
    expect(link).toHaveAttribute('href', 'https://example.test');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a button by default', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });
});
