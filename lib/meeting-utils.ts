export const getMeetingLink = (id: string) => {
  if (typeof window === 'undefined') {
    return `/meeting/${id}`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl && !baseUrl.includes('localhost')) {
    return `${baseUrl}/meeting/${id}`;
  }

  return `${window.location.origin}/meeting/${id}`;
};
