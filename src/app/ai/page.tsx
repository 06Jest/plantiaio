import Link from "next/link";
import { ArrowLeft, Home, Sprout } from "lucide-react";
import { AiChat } from "@/components/ai-chat";

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

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Ask about your plants
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
            Get practical guidance about plant care, watering, lighting,
            common problems, and more from your personal plant assistant.
          </p>
        </section>

        <section className="rounded-3xl border border-stone-200/80 bg-white/80 p-2 shadow-xl shadow-stone-200/40 backdrop-blur sm:p-3">
          <AiChat />
        </section>
      </div>
    </main>
  );
}