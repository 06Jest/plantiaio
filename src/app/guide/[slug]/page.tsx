import { notFound } from "next/navigation";
import GuideArticle from "@/components/guide-article";
import { getAllGuides, getGuideBySlug } from "@/app/data/plant-guides";

interface GuideArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({
    slug: guide.slug,
  }));
}

export default async function GuideArticlePage({
  params,
}: GuideArticlePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedGuides = getAllGuides()
    .filter(
      (relatedGuide) =>
        relatedGuide.slug !== guide.slug &&
        relatedGuide.category === guide.category,
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-stone-50">
      <GuideArticle
        guide={guide}
        relatedGuides={relatedGuides}
        hrefBase="/guide"
        plantExpertHref="/ai"
      />
    </main>
  );
}