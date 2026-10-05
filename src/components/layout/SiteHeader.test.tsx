import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import SiteHeader from './SiteHeader';

function renderHeader() {
  return render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>,
  );
}

describe('SiteHeader mobile disclosure', () => {
  it('starts collapsed and out of the DOM', () => {
    renderHeader();
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'site-mobile-menu');
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull();
  });

  it('opens on click, moves focus in, and closes on Escape with focus returned', () => {
    renderHeader();
    const toggle = screen.getByRole('button', { name: 'Open menu' });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile' });
    expect(mobileNav.contains(document.activeElement)).toBe(true);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(toggle);
  });
});
