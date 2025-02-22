"use client";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import CodeEditor from "./CodeEditor";
import { useEffect, useState } from "react";

export default function DocumentModal({
  document,
  open,
  setOpen,
  handleUpdate,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState({});

  useEffect(() => {
    const doc = JSON.stringify(document, null, 2);
    setCode(doc);
  }, [document]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(async () => {
      await handleUpdate(code);
      setIsSubmitting(false);
    }, 5000);
  };

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
            className="relative transform overflow-hidden rounded-lg bg-[#141414] px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in my-8 w-full max-w-lg p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <form action={handleSubmit}>
              <div className="mt-4">
                <CodeEditor
                  value={code}
                  onChange={(value) => {
                    setCode(value);
                  }}
                />
              </div>
              <div className="mt-3 flex justify-between items-center gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full bg-red-500 py-1"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${
                    isSubmitting ? "bg-green-300" : "bg-primary"
                  } py-1 text-text-muted font-bold`}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
