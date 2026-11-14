export function extractMentions(text: string): string[] {
  if (!text) return [];
  // Matches @username preceded by whitespace or start of string, avoiding emails
  const matches = text.match(/(?:^|\s)@([a-z0-9_]{3,32})\b/gi);
  if (!matches) return [];
  const handles = matches.map((m) => m.trim().replace(/^@/, "").toLowerCase());
  return Array.from(new Set(handles));
}
