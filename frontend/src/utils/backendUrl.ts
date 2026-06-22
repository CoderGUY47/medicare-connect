export function getBackendUrl(): string {
  if (typeof window !== 'undefined') {
    const localOverride = localStorage.getItem('mc_backend_url');
    if (localOverride) return localOverride;

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }
  return process.env.NEXT_PUBLIC_SERVER_URL || 'https://backend-nu-rosy-20.vercel.app';
}
