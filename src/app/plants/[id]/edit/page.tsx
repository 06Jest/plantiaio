import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PlantForm } from "@/components/plant-form";
import { updatePlant } from "@/app/plants/actions";
import { createClient } from "@/lib/supabase/server";

export default async function EditPlantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: plant } = await supabase
    .from("plants")
    .select("name, species, category, planted_on, description, status")
    .eq("id", id)
    .single();

  if (!plant) {
    notFound();
  }

  const save = updatePlant.bind(null, id);

  return (
    <main className="min-h-screen bg-[#F6F3EA] px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/plants/${id}`}
          className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-[#3B4534] transition-colors hover:text-[#34502F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34502F] focus-visible:ring-offset-2"
        >
          <span aria-hidden="true">←</span>
          Back to plant details
        </Link>

        <div className="mt-8">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8A9184]">
            Plant collection
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#243019] sm:text-4xl">
            Edit your plant
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-6 text-[#5B6555]">
            Keep your plant profile up to date so your care records and growing journey stay accurate.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-[#E5E6DC] bg-[#FFFDF7] p-6 shadow-[0_18px_40px_-28px_rgba(38,48,32,0.35)] sm:p-8">
          <div className="border-b border-[#E5E6DC] pb-5">
            <h2 className="text-lg font-semibold text-[#26301F]">Plant profile</h2>
            <p className="mt-1 text-sm text-[#5B6555]">
              Editing the profile for <span className="font-medium text-[#3B4534]">{plant.name}</span>. Update the details that help you care for this plant and keep its history organized.
            </p>
          </div>

          <div className="mt-6">
            <PlantForm action={save} plant={plant} submitLabel="Save changes" />
          </div>
        </div>
      </div>
    </main>
  );
}