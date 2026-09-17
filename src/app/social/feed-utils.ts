export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSec < 60) return "just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  const sameYear = date.getFullYear() === new Date().getFullYear();

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
}

export function getInitials(name?: string | null) {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((part) => part[0]?.toUpperCase() ?? "").join("");

  return initials || "?";
}