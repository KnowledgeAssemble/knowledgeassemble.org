import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom';
import { allPrerenderEntries, routes } from '../src/routes';
import { siteName, siteUrl } from '../src/config/site';
import type { PageMeta } from '../src/types';

const dist = join(process.cwd(), 'dist');

// The client build has already produced dist/index.html with the hashed asset
// URLs. Reuse those URLs verbatim so each generated page loads the exact CSS
// and JS bundle Vite emitted.
const builtIndex = readFileSync(join(dist, 'index.html'), 'utf8');
const cssHref = builtIndex.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/)?.[1];
const jsSrc = builtIndex.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)?.[1];
if (!cssHref || !jsSrc) {
  throw new Error('prerender: could not locate built stylesheet/script in dist/index.html');
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function headFor(meta: PageMeta): string {
  const lines = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:image" content="${siteUrl}/og-image.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${siteUrl}/og-image.png" />`,
  ];
  if (siteUrl && meta.canonicalPath) {
    const url = `${siteUrl}${meta.canonicalPath}`;
    lines.push(`<link rel="canonical" href="${escapeHtml(url)}" />`);
    lines.push(`<meta property="og:url" content="${escapeHtml(url)}" />`);
  }
  if (meta.noIndex) {
    lines.push(`<meta name="robots" content="noindex" />`);
  }
  return lines.join('\n    ');
}

async function renderRoute(path: string): Promise<string> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`${siteUrl}${path}`));
  if (context instanceof Response) {
    throw new Error(`prerender: query returned a Response (${context.status}) for ${path}`);
  }
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToStaticMarkup(<StaticRouterProvider router={router} context={context} />);
}

function documentFor(routeHtml: string, head: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${head}
    <meta name="theme-color" content="#FBFBF9" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" crossorigin href="${cssHref}" />
  </head>
  <body>
    <div id="root">${routeHtml}</div>
    <script type="module" crossorigin src="${jsSrc}"></script>
  </body>
</html>
`;
}

async function main(): Promise<void> {
  for (const entry of allPrerenderEntries) {
    const html = await renderRoute(entry.path);
    const file = join(dist, entry.outFile);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, documentFor(html, headFor(entry.meta)));
    console.log(`prerendered ${entry.path} -> ${file}`);
  }
}

void main();
