"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { logout } from "../_lib/action";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

export default function Base({ children }) {
  const year = new Date().getFullYear();
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="shrink-0">
                  <Link href="/" className="flex items-center">
                    <Image
                      alt="Your Company"
                      src="/icon.png"
                      width={50}
                      height={50}
                      className="size-8"
                    />
                    <span className="font-mono text-xl">MongoDB</span>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6 gap-4">
                  <DarkModeToggle />
                  <form action={logout}>
                    <button
                      type="submit"
                      className="bg-red-500 text-whiterounded-md px-3 py-2 text-sm font-medium ml-auto"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden items-center">
                <DarkModeToggle />
                <DisclosureButton className="ml-4 group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon
                    aria-hidden="true"
                    className="block size-6 group-data-[open]:hidden"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden size-6 group-data-[open]:block"
                  />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="border-t border-gray-700 pb-3 pt-4 flex px-3">
              <form action={logout}>
                <button
                  type="submit"
                  className="bg-red-500 text-whiterounded-md px-3 py-2 text-sm font-medium ml-auto"
                >
                  Logout
                </button>
              </form>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <header className="bg-primary shadow">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight dark:text-slate-950 text-slate-200">
              MongoDB Web
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div>{children}</div>
          </div>
        </main>
      </div>
      <div className="fixed bottom-0 w-full flex items-center justify-center py-3">
        <p className="text-sm">
          &copy; {year} <span className="text-primary">Joseph Chuks</span>
        </p>
      </div>
    </>
  );
}
