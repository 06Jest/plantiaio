import Link from "next/link";
import { redirect } from "next/navigation";

import { updateProfile } from "@/app/social/actions";
import { PLANT_CATEGORIES, label } from "@/lib/plants";
import { createClient } from "@/lib/supabase/server";

function getInitials(source: string): string {
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function ArrowLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25h.75v4.5h.75M12 7.5h.008v.008H12V7.5Z" />
      <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default async function ProfileEditPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, interests")
    .eq("id", user.id)
    .single();

  const username = profile?.username ?? "";
  const displayName = profile?.display_name ?? "";
  const bio = profile?.bio ?? "";
  const interests = profile?.interests ?? [];
  const identityName = displayName || username || "Your profile";

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-stone-600 transition hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Dashboard
        </Link>

        <section className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white px-6 py-8 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl font-semibold text-emerald-800 ring-4 ring-emerald-50">
            {getInitials(identityName)}
          </div>
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
              Public profile
            </span>
            <h1 className="mt-2 truncate text-2xl font-semibold text-stone-900">{identityName}</h1>
            {username && <p className="truncate text-sm text-stone-500">@{username}</p>}
          </div>
        </section>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-emerald-50/70 px-4 py-3 text-sm text-stone-700">
          <InfoIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
          <p>
            The information below is visible to other members of the community. Your plants, care
            records, and private notes always stay private.
          </p>
        </div>

        <form
          action={updateProfile}
          className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"
        >
          <div className="space-y-8">
            <fieldset>
              <legend className="text-base font-semibold text-stone-900">Basic information</legend>
              <p className="mt-1 text-sm text-stone-500">
                This is how other members find and identify you.
              </p>

              <div className="mt-4 space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-stone-800">
                    Username
                  </label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-stone-400">
                      @
                    </span>
                    <input
                      id="username"
                      name="username"
                      defaultValue={username}
                      minLength={3}
                      maxLength={30}
                      pattern="[a-z0-9_]+"
                      required
                      placeholder="planty_pete"
                      className="w-full rounded-lg border border-stone-300 py-2 pl-7 pr-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-stone-500">
                    Lowercase letters, numbers, and underscores only.
                  </p>
                </div>

                <div>
                  <label htmlFor="display_name" className="block text-sm font-medium text-stone-800">
                    Display name
                  </label>
                  <input
                    id="display_name"
                    name="display_name"
                    defaultValue={displayName}
                    maxLength={80}
                    placeholder="e.g. Jane's Jungle"
                    className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 text-base font-medium text-stone-900 placeholder:font-normal placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <p className="mt-1.5 text-xs text-stone-500">
                    Shown across the community instead of your username.
                  </p>
                </div>
              </div>
            </fieldset>

            <div className="border-t border-stone-200 pt-8">
              <fieldset>
                <legend className="text-base font-semibold text-stone-900">About you</legend>
                <p className="mt-1 text-sm text-stone-500">
                  Share a little about your plant journey. This appears on your public profile.
                </p>

                <div className="mt-4">
                  <label htmlFor="bio" className="block text-sm font-medium text-stone-800">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    defaultValue={bio}
                    maxLength={500}
                    rows={5}
                    placeholder="Tell the community about your plants, what you're growing, or what got you into plant care."
                    className="mt-1.5 w-full resize-y rounded-lg border border-stone-300 p-3 text-sm leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <p className="mt-1.5 text-xs text-stone-500">Up to 500 characters.</p>
                </div>
              </fieldset>
            </div>

            <div className="border-t border-stone-200 pt-8">
              <fieldset>
                <legend className="text-base font-semibold text-stone-900">Plant interests</legend>
                <p className="mt-1 text-sm text-stone-500">
                  Select the categories you care about most. This helps other members find you.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {PLANT_CATEGORIES.map((interest) => {
                    const inputId = `interest-${interest}`;
                    const checked = interests.includes(interest);

                    return (
                      <div key={interest} className="relative">
                        <input
                          type="checkbox"
                          id={inputId}
                          name="interests"
                          value={interest}
                          defaultChecked={checked}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={inputId}
                          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-emerald-300 hover:bg-emerald-50 peer-checked:border-emerald-600 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:[&>svg]:inline-block peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-600"
                        >
                          <CheckIcon className="hidden h-3.5 w-3.5 flex-shrink-0" />
                          {label(interest)}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:w-auto"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:w-auto"
            >
              Save public profile
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}