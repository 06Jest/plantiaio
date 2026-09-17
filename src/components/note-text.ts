export function truncateText(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

/** First meaningful line of a note, used as its generated sidebar/header title. */
export function getNoteTitle(content: string): string {
  const lines = content
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return "Untitled note";
  return truncateText(lines[0], 60);
}

/** Short snippet drawn from the content after the title line, for the sidebar list. */
export function getNotePreview(content: string): string {
  const lines = content
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rest = lines.slice(1).join(" ");
  return rest ? truncateText(rest, 100) : "";
}

export function formatNoteDate(value: string): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export function wasNoteEdited(originalContent: string, currentContent: string): boolean {
  return originalContent.trim() !== currentContent.trim();
}

export function wasNoteRecentlyUpdated(createdAt: string, updatedAt: string): boolean {
  return new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 60_000;
}