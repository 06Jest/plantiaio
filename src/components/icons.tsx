import type { SVGProps } from "react";

/**
 * Minimal inline icon set - no external icon package required.
 * Every icon shares the same viewBox, stroke weight, and cap style
 * so they read as one consistent system wherever they're used.
 */
function IconBase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

export function SproutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 21V10" />
      <path d="M12 10c0-4 3-6 7-6 0 4-3 6-7 6Z" />
      <path d="M12 13c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z" />
    </IconBase>
  );
}

export function SparklesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
    </IconBase>
  );
}

export function NewspaperIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="14" height="14" rx="2" />
      <path d="M7 9h6M7 12.5h6M7 16h3" />
      <path d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9" />
    </IconBase>
  );
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconBase>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-4 5-5.5 7-5.5s5.5 1.5 7 5.5" />
    </IconBase>
  );
}

export function LogOutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path d="M15 8l4 4-4 4" />
      <path d="M19 12H9" />
    </IconBase>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

export function BookOpenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z" />
    </IconBase>
  );
}