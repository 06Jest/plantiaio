import type { ReactNode } from "react";
import { Newsreader, Inter } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

/* Shared class strings so both auth pages stay visually identical. */

export const displayFont = "font-[family-name:var(--font-display)]";

export const labelClass = "block text-sm font-medium text-[#2A3326]";

export const fieldClass =
  "mt-2 h-12 w-full rounded-xl border border-[#DDD6C5] bg-white px-4 text-[15px] text-[#2A3326] shadow-[inset_0_1px_2px_rgba(42,51,38,0.04)] outline-none transition placeholder:text-[#A7AC99] hover:border-[#CFC7B3] focus:border-[#3E7A56] focus:ring-4 focus:ring-[#3E7A56]/15";

export const buttonClass =
  "h-12 w-full rounded-xl bg-[#1F4A32] text-[15px] font-medium text-[#F4F8F1] transition-colors hover:bg-[#173A27] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F4A32]/25 active:bg-[#123020] disabled:cursor-not-allowed disabled:bg-[#6E8A78]";

export const alertClass =
  "mt-6 rounded-xl border border-[#EBD9B4] bg-[#FDF6E7] px-4 py-3 text-sm leading-relaxed text-[#7A5518]";

export const inlineLinkClass =
  "rounded-sm font-medium text-[#1F4A32] underline underline-offset-4 transition-colors hover:text-[#173A27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4A32]/30";

/* Decorative only. Every icon below is hidden from assistive tech. */

function LeafMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 4c0 8.3-4.6 13-11.5 13H5c0-8.3 4.6-13 11.5-13H20Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M4.5 20.5C6.5 15 11 11.5 16.5 9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

function SproutIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21v-8" />
      <path d="M12 13c0-3.3 2.4-6 5.5-6 0 3.3-2.4 6-5.5 6Z" />
      <path d="M12 15c-3 0-5.5-2.2-5.5-5C9.5 10 12 12.2 12 15Z" />
    </svg>
  );
}

function DropletIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3.5c3.2 3.4 5.5 6.2 5.5 9a5.5 5.5 0 1 1-11 0c0-2.8 2.3-5.6 5.5-9Z" />
      <path d="M9.4 14.2a2.8 2.8 0 0 0 2.2 2.6" />
    </svg>
  );
}

function CommunityIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M16 6.2a3 3 0 0 1 0 5.6" />
      <path d="M17.5 14.8c2 .6 3.5 2.4 3.5 4.7" />
    </svg>
  );
}

function LeafSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 420"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M158 412C158 300 150 208 120 132 96 70 60 30 18 8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M140 300c-46 6-78-14-96-58 44-14 79-1 96 58Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M150 340c40-16 62-46 62-94-44 6-70 32-62 94Z"
        fill="currentColor"
        opacity="0.28"
      />
      <path
        d="M124 208c-42-2-68-24-78-66 42-6 72 12 78 66Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M132 236c38-20 56-52 52-98-42 12-64 40-52 98Z"
        fill="currentColor"
        opacity="0.22"
      />
      <path
        d="M96 112C62 96 44 70 44 30c36 8 56 34 52 82Z"
        fill="currentColor"
        opacity="0.26"
      />
    </svg>
  );
}

const highlights = [
  {
    title: "Track your plants and care history",
    detail:
      "A profile for every plant, with the care you have already given it.",
    Icon: SproutIcon,
    tone: "sage" as const,
  },
  {
    title: "Set reminders for watering and plant care",
    detail: "Know what needs water, feeding, or repotting before it wilts.",
    Icon: DropletIcon,
    tone: "sage" as const,
  },
  {
    title: "Learn, share, and connect with fellow plant lovers",
    detail:
      "Plant guides and a community of plantita and plantito to grow with.",
    Icon: CommunityIcon,
    tone: "clay" as const,
  },
];

const toneStyles = {
  sage: "bg-[#E4EDDF] text-[#2F6344] ring-[#CFDEC6]",
  clay: "bg-[#F6E3D8] text-[#A75F3F] ring-[#EBD1C2]",
};

/**
 * Page frame shared by /login and /signup.
 * Mobile order: brand header, form card, then the feature list.
 * Desktop: brand and features on the left, form card on the right.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main
      className={`${newsreader.variable} ${inter.variable} relative min-h-screen overflow-hidden bg-[#F7F3EA] px-5 py-12 font-[family-name:var(--font-body)] text-[#2A3326] sm:px-8 lg:px-12 lg:py-16`}
    >
      <LeafSprig className="pointer-events-none absolute -bottom-16 -left-20 hidden w-[380px] text-[#7E9B7A] opacity-[0.18] lg:block" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-y-10 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.05fr_minmax(0,460px)] lg:items-center lg:gap-x-20 lg:gap-y-12">
        <header className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F4A32] text-[#EAF1E6]">
              <LeafMark className="h-5 w-5" />
            </span>
            <span className={`${displayFont} text-2xl tracking-tight text-[#1F4A32]`}>
              Plantiaio
            </span>
          </div>

          <p
            className={`${displayFont} mt-6 max-w-[34ch] text-[1.6rem] leading-snug text-[#2A3326] sm:text-[2rem]`}
          >
            Grow better. Connect with fellow plantita and plantito.
          </p>

          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[#5F6B56]">
            Your personal space to care for your plants, track their progress,
            discover helpful plant knowledge, and grow alongside a community of
            plant lovers.
          </p>
        </header>

        <section
          aria-label="What you can do with Plantiaio"
          className="lg:col-start-1 lg:row-start-2 lg:self-start"
        >
          <ul className="space-y-5 border-t border-[#E3DCCB] pt-7 lg:max-w-[46ch]">
            {highlights.map(({ title, detail, Icon, tone }) => (
              <li key={title} className="flex gap-4">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${toneStyles[tone]}`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span>
                  <span className="block text-[15px] font-medium text-[#2A3326]">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-[#6B7362]">
                    {detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          {children}
        </div>
      </div>
    </main>
  );
}

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E7E0D0] bg-[#FFFDF8] p-6 shadow-[0_1px_2px_rgba(42,51,38,0.04),0_18px_40px_-28px_rgba(42,51,38,0.35)] sm:p-8">
      <h1 className={`${displayFont} text-2xl text-[#2A3326]`}>{title}</h1>

      <p className="mt-2 text-sm leading-relaxed text-[#6B7362]">
        {description}
      </p>

      {children}
    </div>
  );
}