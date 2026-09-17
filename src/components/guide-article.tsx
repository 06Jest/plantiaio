// components/plant-guide/GuideArticle.tsx
//
// Renders one full guide article: breadcrumb, header, table of contents,
// sections, and related guides. Contains no hooks or event handlers, so
// it can be rendered as a Server Component directly in the [slug] route
// - no "use client" needed unless you add interactivity to it later.

import Link from "next/link";
import type { PlantGuide } from "@/app/data/plant-guide-types";

interface GuideArticleProps {
  guide: PlantGuide;
  /** Already-resolved related guides (see getRelatedGuides in data/plant-guides.ts). */
  relatedGuides: PlantGuide[];
  /** Base path guide articles live under. Defaults to "/guide". */
  hrefBase?: string;
  /** Optional link to the AI Plant Expert page. Omit to hide the callout. */
  plantExpertHref?: string;
}

export default function GuideArticle({
  guide,
  relatedGuides,
  hrefBase = "/guide",
  plantExpertHref,
}: GuideArticleProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <Link href={hrefBase} className="hover:text-emerald-600 hover:underline">
          Plant Guide
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{guide.title}</span>
      </nav>

      <header className="mb-8 border-b border-gray-100 pb-6">
        <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          {guide.categoryLabel}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-gray-600">{guide.description}</p>
        <p className="mt-4 text-xs text-gray-400">{guide.readingTime}</p>
      </header>

      {guide.sections.length > 1 && (
        <nav
          aria-label="Table of contents"
          className="mb-10 rounded-lg border border-gray-100 bg-gray-50 p-4"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            In this guide
          </p>
          <ul className="space-y-1">
            {guide.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-sm text-emerald-700 hover:underline">
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="space-y-10">
        {guide.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-20">
            <h2 className="text-xl font-semibold text-gray-900">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className="leading-relaxed text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
            {section.bullets && section.bullets.length > 0 && (
              <div className="mt-4 rounded-lg bg-emerald-50/60 p-4">
                {section.bulletsTitle && (
                  <p className="mb-2 text-sm font-semibold text-emerald-800">
                    {section.bulletsTitle}
                  </p>
                )}
                <ul className="list-inside list-disc space-y-1.5 text-sm leading-relaxed text-gray-700">
                  {section.bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>

      <p className="mt-10 text-xs leading-relaxed text-gray-400">
        This guide covers general patterns. Individual species and growing conditions vary,
        so treat this as a starting point rather than a diagnosis for your specific plant.
      </p>

      {plantExpertHref && (
        <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-900">
            Still unsure what&apos;s happening with your plant?{" "}
            <a href={plantExpertHref} className="font-semibold underline">
              Ask Plant Expert
            </a>{" "}
            for personalized help.
          </p>
        </div>
      )}

      {relatedGuides.length > 0 && (
        <div className="mt-12 border-t border-gray-100 pt-8">
          <h2 className="text-lg font-semibold text-gray-900">Related guides</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {relatedGuides.map((related) => (
              <li key={related.slug}>
                <Link
                  href={`${hrefBase}/${related.slug}`}
                  className="block rounded-lg border border-gray-100 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                >
                  <p className="text-sm font-medium text-gray-900">{related.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                    {related.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <Link href={hrefBase} className="text-sm font-medium text-emerald-600 hover:underline">
          &larr; Back to all guides
        </Link>
      </div>
    </article>
  );
}