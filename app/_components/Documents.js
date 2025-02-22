"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { createDocument, deleteDocument, updateDocument } from "../_lib/action";
import DocumentModal from "./DocumentModal";
import TableButtons from "./TableButtons";
import { usePathname } from "next/navigation";

export default function Documents({ data, total, title }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({});
  const [activeItem, setActiveItem] = useState("");
  const [action, setAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  data.sort((a, b) => a._id.localeCompare(b._id));
  const dbname = pathname.split("/").slice(0, -1).join("");

  const handleView = (id) => {
    const selected = data.find((doc) => doc._id === id);
    setAction("update");
    setSelectedDocument(selected);
    setActiveItem(id);
    setIsOpen(true);
  };

  const handleUpdate = async (data) => {
    let result;
    if (action === "update") {
      result = await updateDocument(dbname, title, selectedDocument._id, data);
    } else {
      result = await createDocument(dbname, title, data);
    }

    Swal.fire({
      title: result.success ? "Success!" : "Error occurred!",
      text: result.message,
      icon: result.success ? "success" : "error",
    });
    setIsOpen(false);
    return true;
  };

  const handleDelete = (id) => {
    setActiveItem(id);
    setIsLoading(true);
    Swal.fire({
      title: "Alert",
      text: "Are you sure you want to delete the document? This action cannot be undone.",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Proceed",
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        const submit = async () => {
          setIsLoading(true);
          const result = await deleteDocument(dbname, title, id);
          if (result.success) {
            Swal.fire({
              title: "Success!",
              text: result.message,
              icon: "success",
              confirmButtonText: "Continue",
            });
          } else {
            Swal.fire({
              title: "Error occurred!",
              text: result.message,
              icon: "error",
            });
          }
          setIsLoading(false);
          return;
        };

        submit();
      } else {
        setIsLoading(false);
        return Swal.fire("Cancelled", "Action has been canceled", "info");
      }
    });
  };

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="bg-background py-10">
          <div className="px-4 sm:px-6 lg:px-8 divide-y divide-foreground">
            <div className="flex items-center justify-between">
              <div className="flex gap-x-3 items-center">
                <Link
                  href={pathname.split("/").slice(0, -1).join("/")}
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  back
                </Link>
                <p>
                  Total:&nbsp;
                  <span className="text-primary">{total}</span>
                </p>
              </div>
              <div>
                <DocumentModal
                  open={isOpen}
                  setOpen={setIsOpen}
                  document={selectedDocument}
                  handleUpdate={handleUpdate}
                />

                <button
                  type="button"
                  onClick={() => {
                    setAction("create");
                    setSelectedDocument({
                      "": "",
                    });
                    setIsOpen(true);
                  }}
                  className="block rounded-md bg-indigo-500 px-3 py-1 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  add new
                </button>
              </div>
            </div>
            <div className="mt-4 flow-root">
              <ul role="list" className="divide-y divide-foreground">
                {data.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between gap-x-6 py-2"
                  >
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-[12px] sm:text-sm font-semibold text-primary">
                          {item._id}
                        </p>
                      </div>
                    </div>
                    <TableButtons
                      onManage={handleView}
                      onDelete={handleDelete}
                      isLoading={isLoading}
                      activeItem={activeItem}
                      item={item._id}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
