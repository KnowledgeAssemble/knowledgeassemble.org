import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SkipLink from './SkipLink';

describe('SkipLink', () => {
  it('targets the main content landmark', () => {
    render(<SkipLink />);
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
  });

  it('is the first focusable element in document order', () => {
    const { container } = render(
      <>
        <SkipLink />
        <button type="button">After</button>
      </>,
    );
    expect(container.querySelector('a, button')).toHaveTextContent('Skip to main content');
  });
});
