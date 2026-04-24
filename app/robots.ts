import type { MetadataRoute } from 'next';

const getBaseUrl = () => {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!configuredBaseUrl) return 'http://localhost:3000';

  return configuredBaseUrl.replace(/\/$/, '');
};

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
