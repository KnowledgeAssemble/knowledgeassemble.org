import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

function Probe() {
  const ref = useRevealOnScroll<HTMLDivElement>();
  return (
    <div ref={ref} data-testid="target">
      content
    </div>
  );
}

const target = () => screen.getByTestId('target');

// src/test/setup.ts installs a globally intersecting stub; capture it so each
// test can put it back.
const setupStub = window.IntersectionObserver;

afterEach(() => {
  vi.stubGlobal('IntersectionObserver', setupStub);
});

/** An observer that records how it was constructed and fires only on demand. */
class ControllableObserver {
  static instances: ControllableObserver[] = [];

  callback: IntersectionObserverCallback;
  options: IntersectionObserverInit | undefined;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    ControllableObserver.instances.push(this);
  }

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(isIntersecting: boolean): void {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

describe('useRevealOnScroll', () => {
  it('marks the target pending before paint and promotes it when it intersects', () => {
    vi.stubGlobal('IntersectionObserver', ControllableObserver);

    render(<Probe />);
    expect(target()).toHaveAttribute('data-reveal', 'pending');

    ControllableObserver.instances.at(-1)?.trigger(true);
    expect(target()).toHaveAttribute('data-reveal', 'visible');
  });

  // Spec §40: a browser without IntersectionObserver must get the final state,
  // not hidden content. The guard has to be a type check, not an `in` check:
  // `'IntersectionObserver' in window` is true when the global exists but is
  // undefined, which then throws on construction inside a layout effect.
  it('shows the content immediately when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    expect(() => render(<Probe />)).not.toThrow();
    expect(target()).toHaveAttribute('data-reveal', 'visible');
  });

  it('shows the content when IntersectionObserver is not a constructor', () => {
    vi.stubGlobal('IntersectionObserver', 'nope');

    expect(() => render(<Probe />)).not.toThrow();
    expect(target()).toHaveAttribute('data-reveal', 'visible');
  });

  // A ratio threshold can never be reached by an element taller than roughly
  // five viewports, which would leave such a section permanently invisible.
  // Threshold 0 reacts to any intersection and cannot get stuck.
  it('observes with threshold 0 so a section taller than the viewport still reveals', () => {
    vi.stubGlobal('IntersectionObserver', ControllableObserver);

    render(<Probe />);

    expect(ControllableObserver.instances.at(-1)?.options?.threshold).toBe(0);
  });

  // The architectural claim behind §40: effects never run during prerender, so
  // the hidden start state cannot reach the built HTML at all. Asserted against
  // real prerender output rather than the hydrated DOM, where the attribute is
  // supposed to be present.
  it('never reaches the prerendered markup', () => {
    const html = renderToStaticMarkup(<Probe />);

    expect(html).toContain('content');
    expect(html).not.toContain('data-reveal');
  });
});