import Link from "next/link";
import { redirect } from "next/navigation";
import { Fraunces, Work_Sans } from "next/font/google";
import { createClient } from "@/lib/supabase/server";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
});

const heading = "font-[family-name:var(--font-fraunces)]";

function IconLeaf() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M4 15c0-6 5-11 11-11h4v4c0 6-5 11-11 11H4v-4z" />
      <path d="M4 19c4-4 8-6 12-10" />
    </svg>
  );
}

function IconDrop() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 3c3 4 6 7.5 6 11a6 6 0 1 1-12 0c0-3.5 3-7 6-11z" />
    </svg>
  );
}

function IconPhoto() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M21 16l-5-4-4 3-3-2-6 5" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z" />
      <path d="M4 20.5V5.5" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="9" cy="9" r="3" />
      <circle cx="16" cy="11" r="2.3" />
      <path d="M4 19c0-3 2.5-5 5-5s5 2 5 5M14.5 19c0-2.2 1.7-4 4-4s4 1.8 4 4" />
    </svg>
  );
}

const features = [
  {
    title: "Track your plants",
    description: "Create plant profiles, organize your collection, and keep the details that matter for every plant you own.",
    icon: <IconLeaf />,
  },
  {
    title: "Record plant care",
    description: "Log watering, fertilizing, repotting, pruning, and propagation as you go, so nothing gets forgotten.",
    icon: <IconDrop />,
  },
  {
    title: "Follow your growth",
    description: "Document progress, observations, and a personal growth journal for each plant.",
    icon: <IconPhoto />,
  },
  {
    title: "Learn with plant guides",
    description: "Explore practical guidance on light, watering, soil, pests, and plant health when you need it.",
    icon: <IconBook />,
  },
  {
    title: "Stay organized",
    description: "Keep care notes and reminders together, so the next task is easy to remember and easy to find.",
    icon: <IconCalendar />,
  },
  {
    title: "Grow with the community",
    description: "Plantiaio is becoming a place to share what you learn and connect with fellow plantita and plantito.",
    icon: <IconUsers />,
  },
];

const communityPoints = [
  "Celebrate new growth",
  "Learn from other plant lovers",
  "Share care experiences",
  "Keep your plant journey organized",
];

const steps = [
  {
    title: "Add your plants",
    description: "Create profiles for the plants you already care for, with the details you want to remember.",
  },
  {
    title: "Track and learn",
    description: "Record care activities, follow each plant's growth, and explore guides whenever you need them.",
  },
  {
    title: "Grow together",
    description: "Build steady care habits, and connect with fellow plant lovers as the Plantiaio community grows.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className={`${fraunces.variable} ${workSans.variable} min-h-screen bg-[#F6F3EA] font-[family-name:var(--font-work-sans)] text-[#26301F]`}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <span className={`${heading} text-xl font-medium tracking-tight text-[#26301F]`}>Plantiaio</span>
        <nav aria-label="Account">
          <Link
            href="/login"
            className="rounded text-sm font-medium text-[#3B4534] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34502F] focus-visible:ring-offset-2"
          >
            Log in
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-8 sm:px-8 sm:pb-28 sm:pt-12">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="max-w-xl">
            <h1 className={`${heading} text-4xl leading-[1.1] tracking-tight text-[#243019] sm:text-5xl lg:text-[3.4rem]`}>
              Grow a little more every day.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-[#5B6555]">
              Plantiaio keeps your plant collection, care routines, and growth journal in one warm, unhurried space, built for plantita and plantito.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-[20px_8px_20px_8px] bg-[#34502F] px-6 py-3 text-center font-medium text-[#F6F3EA] transition-colors hover:bg-[#2A4126] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34502F] focus-visible:ring-offset-2"
              >
                Create your account
              </Link>
              <Link
                href="/login"
                className="rounded-[20px_8px_20px_8px] border border-[#C9C6B4] px-6 py-3 text-center font-medium text-[#3B4534] transition-colors hover:border-[#34502F] hover:text-[#34502F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34502F] focus-visible:ring-offset-2"
              >
                Log in
              </Link>
            </div>
            <p className="mt-5 text-sm text-[#8A9184]">
              A plant-care and plant-community app for plantita and plantito.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            <svg aria-hidden="true" viewBox="0 0 420 420" className="pointer-events-none absolute -right-6 -top-6 h-[110%] w-[110%] text-[#DCE6D2]">
              <path
                fill="currentColor"
                d="M301 39c46 27 79 76 88 129 9 54-5 111-42 151-37 40-96 63-153 57-57-6-112-39-137-89S31 178 61 122c30-56 84-91 140-104 33-8 68-1 100 21z"
              />
            </svg>

            <div
              aria-hidden="true"
              className="absolute left-6 top-14 hidden w-52 -rotate-6 rounded-[24px_10px_24px_10px] border border-[#E5E6DC] bg-[#FFFDF7] p-4 shadow-sm sm:block"
            >
              <p className="text-xs font-medium text-[#8A9184]">Care history</p>
              <p className={`${heading} mt-1 text-sm text-[#3B4534]`}>Last watered: 3 days ago</p>
            </div>

            <div className="relative rounded-[32px_12px_32px_12px] border border-[#E5E6DC] bg-[#FFFDF7] p-6 shadow-[0_18px_40px_-24px_rgba(38,48,32,0.35)]">
              <p className="text-xs font-medium text-[#8A9184]">My Plants</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-[16px_6px_16px_6px] bg-[#DCE6D2] text-[#34502F]">
                  <IconLeaf />
                </div>
                <div>
                  <p className={`${heading} text-lg text-[#26301F]`}>Monsty</p>
                  <p className="text-sm text-[#8A9184]">Monstera deliciosa</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-[16px] bg-[#F6F3EA] px-4 py-3">
                <span className="text-sm font-medium text-[#3B4534]">Next care</span>
                <span className="text-sm text-[#496B50]">Watering, in 2 days</span>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-[16px] bg-[#F6F3EA] px-4 py-3">
                <span className="text-sm font-medium text-[#3B4534]">Growth journal</span>
                <span className="text-sm text-[#496B50]">12 notes</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-[#8A9184] lg:text-left">Example plant profile</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="max-w-xl">
          <h2 className={`${heading} text-3xl leading-tight text-[#243019] sm:text-4xl`}>
            Everything your plants need, in one place.
          </h2>
          <p className="mt-4 text-lg leading-7 text-[#5B6555]">
            From everyday care to long-term growth, Plantiaio helps you build a more intentional relationship with your plants.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div key={feature.title} className="rounded-[24px_10px_24px_10px] border border-[#E5E6DC] bg-[#FFFDF7] p-6">
              <div
                aria-hidden="true"
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  i % 2 === 0 ? "bg-[#DCE6D2] text-[#34502F]" : "bg-[#F1DAC7] text-[#B96A3C]"
                }`}
              >
                {feature.icon}
              </div>
              <h3 className={`${heading} mt-4 text-lg text-[#26301F]`}>{feature.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-[#5B6555]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#DCE6D2]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:px-8 sm:py-20">
          <h2 className={`${heading} text-3xl leading-tight text-[#243019] sm:text-4xl`}>
            For every plantita and plantito
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#3B4534]">
            Whether you are caring for your first pothos or building a growing collection, Plantiaio gives you a place to learn, keep track of your progress, and share the experience with people who understand why one new leaf can make your day.
          </p>
          <ul className="mx-auto mt-9 flex max-w-2xl flex-wrap justify-center gap-x-8 gap-y-3">
            {communityPoints.map((point) => (
              <li key={point} className="flex items-center gap-2 text-[15px] font-medium text-[#2A4126]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#496B50]" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <h2 className={`${heading} text-3xl leading-tight text-[#243019] sm:text-4xl`}>How it works</h2>
        <ol className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map((step, i) => (
            <li key={step.title}>
              <span className={`${heading} text-4xl text-[#9DB08F]`} aria-hidden="true">{`0${i + 1}`}</span>
              <h3 className={`${heading} mt-2 text-lg text-[#26301F]`}>{step.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-[#5B6555]">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-[#31543B]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:px-8 sm:py-20">
          <h2 className={`${heading} text-3xl leading-tight text-[#F6F3EA] sm:text-4xl`}>
            Your plants have a story. Start keeping track of it.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-7 text-[#DCE6D2]">
            Create your Plantiaio account and make your plant-care journey easier to understand, organize, and enjoy.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-[20px_8px_20px_8px] bg-[#F6F3EA] px-6 py-3 text-center font-medium text-[#26301F] transition-colors hover:bg-[#E5E6DC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6F3EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#31543B]"
            >
              Create your account
            </Link>
            <Link
              href="/login"
              className="rounded-[20px_8px_20px_8px] border border-[#5E7857] px-6 py-3 text-center font-medium text-[#F6F3EA] transition-colors hover:border-[#DCE6D2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6F3EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#31543B]"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E5E6DC] pt-8 text-sm text-[#8A9184] sm:flex-row">
          <span className={`${heading} text-base text-[#3B4534]`}>Plantiaio</span>
          <span>A quieter way to care for your plants.</span>
        </div>
      </footer>
    </main>
  );
}