import Link from "next/link";
import { headers } from "next/headers";

import { signup } from "@/app/auth/actions";
import {
  AuthCard,
  AuthShell,
  alertClass,
  buttonClass,
  fieldClass,
  inlineLinkClass,
  labelClass,
} from "@/components/auth-shell";

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";

  return (
    <AuthShell>
      <AuthCard
        title="Start your plant journey"
        description="Create your Plantiaio account and keep your plants, care routines, and growing progress in one place."
      >
        {message && (
          <p role="alert" className={alertClass}>
            {message}
          </p>
        )}

        <form action={signup} className="mt-7 space-y-5">
          <input type="hidden" name="origin" value={origin} />

          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              aria-describedby="password-hint"
              placeholder="At least 8 characters"
              className={fieldClass}
            />
            <p id="password-hint" className="mt-2 text-xs text-[#6B7362]">
              Use 8 characters or more.
            </p>
          </div>

          <button type="submit" className={buttonClass}>
            Create account
          </button>
        </form>

        <p className="mt-6 text-sm text-[#5F6B56]">
          Already have an account?{" "}
          <Link href="/login" className={inlineLinkClass}>
            Log in
          </Link>
        </p>
      </AuthCard>

      <p className="mt-5 px-1 text-xs leading-relaxed text-[#79806E]">
        By creating an account, you agree to the Plantiaio Terms of Service and
        Privacy Policy.
      </p>
    </AuthShell>
  );
}