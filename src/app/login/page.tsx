import Link from "next/link";

import { login } from "@/app/auth/actions";
import {
  AuthCard,
  AuthShell,
  alertClass,
  buttonClass,
  fieldClass,
  inlineLinkClass,
  labelClass,
} from "@/components/auth-shell";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <AuthShell>
      <AuthCard
        title="Welcome back"
        description="Log in to continue your plant journey and pick up where your plants left off."
      >
        {message && (
          <p role="alert" className={alertClass}>
            {message}
          </p>
        )}

        <form action={login} className="mt-7 space-y-5">
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
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className={fieldClass}
            />
          </div>

          <button type="submit" className={buttonClass}>
            Log in
          </button>
        </form>

        <p className="mt-6 text-sm text-[#5F6B56]">
          New to Plantiaio?{" "}
          <Link href="/signup" className={inlineLinkClass}>
            Create an account
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}