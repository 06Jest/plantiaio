import PlantGuidePage from "@/components/plant-guide-page";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <PlantGuidePage
        hrefBase="/guide"
        plantExpertHref="/ai"
      />
    </main>
  );
}