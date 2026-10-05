import { useEffect, useLayoutEffect, useRef } from 'react';

// Effects never run during prerender, so in Node this alias only keeps the
// prerender output quiet; in the browser it applies the pending state before
// paint. Use it — do not call useLayoutEffect directly.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Marks a section pending before the browser paints it hidden, then promotes
 * it when it enters the viewport (spec §17, §18 — trigger only, never hijack
 * scroll).
 *
 * The attribute is applied imperatively and deliberately never rendered in
 * JSX: prerendered documents must not contain it, so no-JS readers, crawlers,
 * and a failed bundle always get the final state (spec §40).
 */
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      node.dataset.reveal = 'visible'; // §40: no observer, no hiding
      return;
    }

    node.dataset.reveal = 'pending';

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.dataset.reveal = 'visible';
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}
