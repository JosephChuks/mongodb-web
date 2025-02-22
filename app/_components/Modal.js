"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Modal({ open, setOpen, action, setIsLoading, value }) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto shadow-xl">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-background px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in my-8 w-full max-w-lg p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-red-600 text-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <form action={action}>
              <div className="">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-primary"
                  >
                    Manage Collections
                  </DialogTitle>
                  <div className="mt-4 space-y-3">
                    <div classame="flex">
                      <input
                        name="name"
                        type="text"
                        defaultValue={value}
                        placeholder="collection name"
                        className="-ml-px block w-full grow rounded-r-md bg-background px-3 py-1.5  outline outline-1 -outline-offset-1 outline-secondary placeholder:text-gray-400 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 gap-x-3 sm:mt-4 sm:flex sm:flex-row-accent">
                <button
                  type="submit"
                  onClick={() => {
                    setIsLoading(true);
                    setOpen(false);
                  }}
                  className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-text-muted shadow-sm hover:bg-primary sm:ml-3 sm:w-auto"
                >
                  Save collection
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-red-200 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
