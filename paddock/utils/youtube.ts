export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  const pattern = /^https?:\/\/(?:(?:www\.|m\.)?youtube\.com\/(?:(?:embed|v|shorts|live)\/|watch\?(?:.*&)?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/;
  const match = cleanUrl.match(pattern);
  return match ? match[1] : null;
}
