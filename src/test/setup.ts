import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(cleanup);

// jsdom implements no IntersectionObserver (verified in the motion plan §1).
// The stub defaults to intersecting so reveal behaviour is testable; a test
// that needs the non-intersecting path overrides it.
class IntersectionObserverStub {
  constructor(private readonly callback: IntersectionObserverCallback) {}

  observe(): void {
    this.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }

  unobserve(): void {}

  disconnect(): void {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  get root(): Element | null {
    return null;
  }

  get rootMargin(): string {
    return '';
  }

  get thresholds(): ReadonlyArray<number> {
    return [];
  }
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
