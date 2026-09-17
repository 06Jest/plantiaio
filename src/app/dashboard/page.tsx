import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { label } from "@/lib/plants";
import { PlantVisual } from "@/components/plant-visual";
import { StatusBadge } from "@/components/status-badge";
import { UserMenu } from "@/components/user-menu";
import {
  ArrowRightIcon,
  BookOpenIcon,
  NewspaperIcon,
  PlusIcon,
  SparklesIcon,
  SproutIcon,
} from "@/components/icons";

const NAV_LINKS = [
  { href: "/ai", label: "Plant expert", Icon: SparklesIcon },
  { href: "/guide", label: "Plant guide", Icon: BookOpenIcon },
  { href: "/feed", label: "Feed", Icon: NewspaperIcon },
];

function getInitials(source: string) {
  const trimmed = source.trim();
  if (!trimmed) return "?";

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  const base = trimmed.includes("@") ? trimmed.split("@")[0] : trimmed;
  return base.slice(0, 2).toUpperCase();
}

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: plants }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("plants")
      .select("id, name, species, status, category, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const displayName = profile?.display_name || profile?.username || user.email || "there";
  const initials = getInitials(displayName);
  const plantList = plants ?? [];

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md font-semibold text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <SproutIcon className="h-4 w-4" />
            </span>
            {/* Swap for your app's actual name if it has one elsewhere. */}
            <span className="hidden sm:inline">Garden</span>
          </Link>

          <div className="flex items-center gap-2">
          <nav
            aria-label="Primary"
            className="flex items-center gap-1 rounded-2xl border border-stone-200 bg-white p-1 shadow-sm"
          >
            {NAV_LINKS.map(({ href, label: navLabel, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-150 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
            >
              <Icon
                className="h-[17px] w-[17px] shrink-0"
                strokeWidth={1.8}
              />

              <span className="hidden md:inline">{navLabel}</span>
              <span className="sr-only md:hidden">{navLabel}</span>
            </Link>
          ))}
          </nav>

          <div className="h-7 w-px bg-stone-200" />

          <UserMenu
            displayName={displayName}
            initials={initials}
            logoutAction={logout}
          />
        </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <section>
          <p className="text-sm font-medium text-emerald-700">Your private garden</p>
          <h1 className="mt-1 text-2xl font-bold text-stone-900 sm:text-3xl">
            Hi, {displayName}
          </h1>
          <p className="mt-1 text-stone-600">
            {plantList.length > 0
              ? `Keeping an eye on ${plantList.length} ${plantList.length === 1 ? "plant" : "plants"}, all private by default.`
              : "Private by default. Add your first plant to start its care history."}
          </p>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">Your plants</h2>
              <p className="mt-1 text-sm text-stone-600">
                Track health, watering, and growth for every plant you&apos;re caring for.
              </p>
            </div>
            <Link
              href="/plants/new"
              className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:self-auto"
            >
              <PlusIcon className="h-4 w-4" />
              Add plant
            </Link>
          </div>

          {plantList.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {plantList.map((plant) => (
                <Link
                  key={plant.id}
                  href={`/plants/${plant.id}`}
                  className="group overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="relative">
                    <PlantVisual status={plant.status} className="h-40 w-full" />
                    <div className="absolute bottom-3 left-3">
                      <StatusBadge status={plant.status} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-5">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-stone-900">
                        {plant.name}
                      </h3>
                      <p className="truncate text-sm text-stone-600">
                        {plant.species || label(plant.category)}
                      </p>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <SproutIcon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-stone-900">No plants yet</h3>
              <p className="max-w-sm text-sm text-stone-600">
                Add your first plant to start tracking its care history, right here in your
                private garden.
              </p>
              <Link
                href="/plants/new"
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add plant
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}