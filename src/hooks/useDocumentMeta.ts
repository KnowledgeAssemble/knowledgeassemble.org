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

    // The SPA rewrite serves the not-found route as HTTP 200, so `noindex` is the
    // only signal that tells crawlers the URL has no content of its own.
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
    }

    return () => {
      document.title = previousTitle;
      created.forEach((element) => element.remove());
    };
  }, [meta]);
}
