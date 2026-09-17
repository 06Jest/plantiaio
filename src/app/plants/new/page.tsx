import Link from "next/link";
import { PlantForm } from "@/components/plant-form";
import { createPlant } from "@/app/plants/actions";

export default function NewPlantPage() {
  return <main className="mx-auto min-h-screen max-w-3xl px-6 py-12"><Link className="text-sm font-medium text-emerald-700 underline" href="/dashboard">← Dashboard</Link><h1 className="mt-6 text-3xl font-bold">Add a plant</h1><p className="mt-2 text-stone-600">You can change its status manually at any time.</p><div className="mt-8"><PlantForm action={createPlant} submitLabel="Save plant" /></div></main>;
}
