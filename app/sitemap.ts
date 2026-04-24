import type { MetadataRoute } from 'next';

const getBaseUrl = () => {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!configuredBaseUrl) return 'http://localhost:3000';

  return configuredBaseUrl.replace(/\/$/, '');
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const routes = [
    { path: '/', priority: 1 },
    { path: '/upcoming', priority: 0.8 },
    { path: '/previous', priority: 0.8 },
    { path: '/recordings', priority: 0.8 },
    { path: '/personal-room', priority: 0.8 },
    { path: '/sign-in', priority: 0.6 },
    { path: '/sign-up', priority: 0.6 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority,
  }));
}
