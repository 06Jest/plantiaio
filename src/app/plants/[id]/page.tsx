import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createCareRecord, deleteCareRecord, deletePlant } from "@/app/plants/actions";
import { StatusBadge } from "@/components/status-badge";
import { CARE_ACTIVITIES, label } from "@/lib/plants";
import { createClient } from "@/lib/supabase/server";
import { PlantVisual } from "@/components/plant-visual";

const dateTime = (value: string) =>
  new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

const dateOnly = (value: string) =>
  new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12.5 15.5 7 10l5.5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M4.5 6h11M8.25 6V4.75c0-.55.45-1 1-1h1.5c.55 0 1 .45 1 1V6m-6 0 .55 9.35c.04.6.55 1.15 1.16 1.15h5.08c.61 0 1.12-.55 1.16-1.15L15.5 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SproutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M10 17.5V11m0 0c0-3-2-5-5.5-5C4.5 9.5 6.8 11.5 10 11Zm0 0c0-3.5 2.2-6 5.5-6C15.5 8.5 13.2 11 10 11Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: plant }, { data: careRecords }] = await Promise.all([
    supabase.from("plants").select("id, name, species, category, planted_on, description, status, created_at").eq("id", id).single(),
    supabase.from("care_records").select("id, activity_type, details, occurred_at").eq("plant_id", id).order("occurred_at", { ascending: false }),
  ]);

  if (!plant) notFound();

  const addCare = createCareRecord.bind(null, id);
  const removePlant = deletePlant.bind(null, id);
  const recordCount = careRecords?.length ?? 0;

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        {/* Back navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 -ml-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to dashboard
        </Link>

        {/* Profile header */}
        <header className="mt-6 flex flex-col justify-between gap-6 border-b border-stone-200 pb-8 md:flex-row md:items-start">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Plant profile</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="break-words text-3xl font-bold text-stone-900 md:text-4xl">{plant.name}</h1>
              <StatusBadge status={plant.status} />
            </div>
            <p className="mt-2 text-stone-600">{plant.species || label(plant.category)}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
              {plant.planted_on && <span>Planted {dateOnly(plant.planted_on)}</span>}
              {plant.created_at && <span>Added to collection {dateOnly(plant.created_at.slice(0, 10))}</span>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/plants/${id}/notes`}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
            >
              Notes
            </Link>
            <Link
              href={`/plants/${id}/edit`}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
            >
              Edit plant
            </Link>
            <form action={removePlant}>
              <button
                type="submit"
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-2"
              >
                Delete plant
              </button>
            </form>
          </div>
        </header>

        {/* Hero: visual + summary */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-stone-200 bg-white p-4">
            <PlantVisual status={plant.status} className="h-72 w-full md:h-80" />
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-stone-900">At a glance</h2>
            <dl className="mt-4 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <dt className="text-sm text-stone-500">Status</dt>
                <dd><StatusBadge status={plant.status} /></dd>
              </div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <dt className="text-sm text-stone-500">Species / category</dt>
                <dd className="text-sm font-medium text-stone-800">{plant.species || label(plant.category)}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <dt className="text-sm text-stone-500">Planted</dt>
                <dd className="text-sm font-medium text-stone-800">{plant.planted_on ? dateOnly(plant.planted_on) : "Not recorded"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-stone-500">Care records</dt>
                <dd className="text-sm font-medium text-stone-800">{recordCount}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left column: details + log care */}
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-bold text-stone-900">About this plant</h2>
              {plant.description ? (
                <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-6">
                  <p className="whitespace-pre-wrap leading-7 text-stone-700">{plant.description}</p>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-6">
                  <p className="text-stone-500">No description has been added yet.</p>
                  <Link href={`/plants/${id}/edit`} className="mt-2 inline-block text-sm font-medium text-stone-700 underline underline-offset-2 hover:text-stone-900">
                    Add one on the edit page
                  </Link>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-stone-900">Log a care activity</h2>
              <form action={addCare} className="mt-4 space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="activity_type" className="block text-sm font-medium text-stone-700">
                      Activity
                    </label>
                    <select
                      id="activity_type"
                      className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                      name="activity_type"
                      required
                    >
                      {CARE_ACTIVITIES.map((activity) => (
                        <option key={activity} value={activity}>
                          {label(activity)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="occurred_at" className="block text-sm font-medium text-stone-700">
                      When
                    </label>
                    <input
                      id="occurred_at"
                      className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                      name="occurred_at"
                      type="datetime-local"
                      defaultValue={new Date().toISOString().slice(0, 16)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="details" className="block text-sm font-medium text-stone-700">
                    Details <span className="font-normal text-stone-400">optional</span>
                  </label>
                  <textarea
                    id="details"
                    className="mt-1.5 min-h-24 w-full rounded-lg border border-stone-300 bg-white p-3 text-sm text-stone-800 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                    name="details"
                    maxLength={5000}
                    placeholder="e.g. Watered thoroughly until it drained, rotated toward the light"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-stone-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 sm:w-auto"
                >
                  Add to care journal
                </button>
              </form>
            </section>
          </div>

          {/* Right column: care journal */}
          <section>
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-bold text-stone-900">Care history</h2>
              <span className="text-sm text-stone-500">{recordCount} {recordCount === 1 ? "record" : "records"}</span>
            </div>

            {careRecords?.length ? (
              <ol className="mt-4">
                {careRecords.map((record, index) => {
                  const removeCare = deleteCareRecord.bind(null, id, record.id);
                  const isLast = index === careRecords.length - 1;
                  return (
                    <li key={record.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {!isLast && <span className="absolute left-[7px] top-4 h-full w-px bg-stone-200" aria-hidden="true" />}
                      <span className="relative z-10 mt-1.5 h-3.5 w-3.5 flex-none rounded-full border-2 border-stone-400 bg-white" aria-hidden="true" />
                      <div className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-4 py-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-900">{label(record.activity_type)}</p>
                            <time className="mt-0.5 block text-sm text-stone-500" dateTime={record.occurred_at}>
                              {dateTime(record.occurred_at)}
                            </time>
                          </div>
                          <form action={removeCare} className="flex-none">
                            <button
                              type="submit"
                              aria-label={`Remove ${label(record.activity_type)} record from ${dateTime(record.occurred_at)}`}
                              className="rounded-md bg-transparent p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </form>
                        </div>
                        {record.details && (
                          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-stone-700">{record.details}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-400">
                  <SproutIcon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-semibold text-stone-800">No care records yet</p>
                <p className="mt-1 max-w-xs text-sm text-stone-500">
                  Log a watering, feeding, or repotting to start this plant&apos;s care journal.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}