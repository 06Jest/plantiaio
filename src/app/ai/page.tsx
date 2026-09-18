import Link from "next/link";
import { ArrowLeft, BookOpen, ClipboardPlus, FileText, Home, Sprout } from "lucide-react";

import { AiChat } from "@/components/ai-chat";

const suggestedPrompts = [
  {
    icon: ClipboardPlus,
    title: "Record an observation",
    prompt: "Create a note that my (your plant name) has yellow leaves.",
  },
  {
    icon: FileText,
    title: "Search my notes",
    prompt: "What have I recorded about my (your plant name)?",
  },
  {
    icon: BookOpen,
    title: "Review care history",
    prompt: "Summarize my (your plant name)'s care history.",
  },
  {
    icon: Sprout,
    title: "Get plant details",
    prompt: "Tell me the details of my (your plant name), including its species and planting date.",
  },
];

export default function AiPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-200/70 hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </header>

        <section className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Sprout className="h-6 w-6" />
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Ask about your plants
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
            Get practical guidance about plant care, watering, lighting,
            common problems, and more from your personal plant assistant.
          </p>
        </section>

        {/* Suggested prompts */}
        <section className="mb-5">
          <div className="mb-3 flex items-center gap-2">
            <Home className="h-4 w-4 text-stone-500" />
            <h2 className="text-sm font-semibold text-stone-700">
              Try asking
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {suggestedPrompts.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-stone-200/80 bg-white/70 p-4 transition hover:border-stone-300 hover:bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-stone-800">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-5 text-stone-500">
                        &ldquo;{item.prompt}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200/80 bg-white/80 p-2 shadow-xl shadow-stone-200/40 backdrop-blur sm:p-3">
          <AiChat />
        </section>
      </div>
    </main>
  );
}