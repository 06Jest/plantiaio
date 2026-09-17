"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, LogOutIcon, UserIcon } from "./icons";

// Standard Next.js server action shape for a plain <form action={...}>.
type LogoutAction = (formData: FormData) => void | Promise<void>;

type UserMenuProps = {
  displayName: string;
  initials: string;
  logoutAction: LogoutAction;
};

export function UserMenu({
  displayName,
  initials,
  logoutAction,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
     <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="account-menu"
        aria-label={`Account menu for ${displayName}`}
        className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-2 text-stone-700 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700 ring-1 ring-inset ring-stone-300"
        >
          {initials}
        </span>

        <span
          aria-hidden="true"
          className="hidden max-w-[8rem] truncate text-sm font-medium text-stone-700 sm:inline"
        >
          {displayName}
        </span>

        <ChevronDownIcon
          className={`hidden h-4 w-4 text-stone-400 transition-transform sm:inline ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          id="account-menu"
          className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg"
        >
          <Link
            href="/profile/edit"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:outline-none"
          >
            <UserIcon className="h-4 w-4 text-stone-400" />
            Edit profile
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="!flex !w-full !items-center !gap-2 !rounded-none !bg-white !px-3 !py-2 text-left !text-sm !font-normal !text-stone-700 transition-colors hover:!bg-stone-100 focus-visible:!bg-stone-100 focus-visible:outline-none"
            >
              <LogOutIcon className="h-4 w-4 text-stone-400" />
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}