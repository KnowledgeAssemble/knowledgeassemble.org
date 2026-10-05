import { useEffect } from 'react';
import type { PageMeta } from '../types';
import { siteUrl } from '../config/site';

function setMetaTag(
  attr: 'name' | 'property',
  key: string,
  content: string,
  created: HTMLElement[],
): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
    created.push(element);
  }
  element.setAttribute('content', content);
}

/**
 * Per-route document metadata (plan §4.3). Sets `document.title`, the meta
 * description, and OpenGraph/Twitter tags on mount, and cleans up the tags it
 * created on unmount.
 *
 * Canonical and `og:url` are emitted only when `siteUrl` is configured, so
 * that while the domain is unregistered no tag points at a host that does not
 * exist (plan §10 Q3).
 */
export function useDocumentMeta(meta: PageMeta): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = meta.title;

    const created: HTMLElement[] = [];

    setMetaTag('name', 'description', meta.description, created);
    setMetaTag('property', 'og:title', meta.title, created);
    setMetaTag('property', 'og:description', meta.description, created);
    setMetaTag('name', 'twitter:title', meta.title, created);
    setMetaTag('name', 'twitter:description', meta.description, created);
    setMetaTag('name', 'twitter:card', 'summary_large_image', created);

    // Unknown URLs get the static 404, which is noindex, but an in-app
    // navigation onto the catch-all route does not reload the document — so the
    // tag has to be managed here too.
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (meta.noIndex) {
      setMetaTag('name', 'robots', 'noindex', created);
    } else if (robots) {
      robots.remove();
    }

    if (siteUrl && meta.canonicalPath) {
      const url = `${siteUrl}${meta.canonicalPath}`;
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
        created.push(canonical);
      }
      canonical.setAttribute('href', url);
      setMetaTag('property', 'og:url', url, created);
    } else {
      // A route with no canonical must not inherit one. The prerender writes
      // canonical/og:url into the document, so on a route that claims neither
      // they are already in the head and absent from `created` — leaving them
      // would make SPA navigation onto this route advertise the previous
      // route's URL as canonical for the rest of the session.
      document.head.querySelector('link[rel="canonical"]')?.remove();
      document.head.querySelector('meta[property="og:url"]')?.remove();
    }

    return () => {
      document.title = previousTitle;
      created.forEach((element) => element.remove());
    };
  }, [meta]);
}
