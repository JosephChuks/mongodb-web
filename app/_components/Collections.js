"use client";

import { useState } from "react";
import Modal from "./Modal";
import Swal from "sweetalert2";
import {
  createCollection,
  deleteCollection,
  updateCollection,
} from "../_lib/action";
import TableButtons from "./TableButtons";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";

export default function Collections({ collections, total, title }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  collections.sort((a, b) => a.name.localeCompare(b.name));

  const handleAdd = async (formData) => {
    const collectionName = formData.get("name");
    const result = await createCollection(title, collectionName);
    Swal.fire({
      title: result.success ? "Success!" : "Error occurred!",
      text: result.message,
      icon: result.success ? "success" : "error",
    });
    setIsAddLoading(false);
    return;
  };

  const handleUpdate = async (formData) => {
    const collectionName = formData.get("name");
    const result = await updateCollection(title, activeItem, collectionName);
    Swal.fire({
      title: result.success ? "Success!" : "Error occurred!",
      text: result.message,
      icon: result.success ? "success" : "error",
    });
    setIsUpdateLoading(false);
    return;
  };

  const handleDelete = (collection) => {
    setActiveItem(collection);
    setIsLoading(true);

    Swal.fire({
      title: "Alert",
      text: "Are you sure you want to delete the collection? This action cannot be undone.",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Proceed",
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        const submit = async () => {
          setIsLoading(true);
          const result = await deleteCollection(title, collection);
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
        Swal.fire("Cancelled", "Action has been canceled", "info");
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="bg-background py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex gap-x-3 items-center">
                <Link
                  href="/"
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
                <Modal
                  open={isOpen}
                  setOpen={setIsOpen}
                  action={handleAdd}
                  setIsLoading={setIsAddLoading}
                  value=""
                />

                <Modal
                  open={isUpdateOpen}
                  setOpen={setIsUpdateOpen}
                  action={handleUpdate}
                  setIsLoading={setIsUpdateLoading}
                  value={activeItem}
                />

                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="block rounded-md bg-indigo-500 px-3 py-1 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {isAddLoading ? <Spinner /> : "Add new"}
                </button>
              </div>
            </div>

            <div className="mt-4 flow-root">
              <ul role="list" className="divide-y divide-foreground">
                {collections.map((collection) => (
                  <li
                    key={collection.name}
                    className="flex justify-between gap-x-6 py-2"
                  >
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        {isUpdateLoading && collection.name === activeItem ? (
                          <p>updating...</p>
                        ) : (
                          <button
                            onClick={() => {
                              setIsUpdateOpen(true);
                              setActiveItem(collection.name);
                            }}
                          >
                            <FaEdit className="inline-flex mr-2 cursor-pointer" />
                            <span className="text-primary">
                              {collection.name}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                    <TableButtons
                      onManage={() =>
                        router.push(`/${title}/${collection.name}`)
                      }
                      onDelete={handleDelete}
                      isLoading={isLoading}
                      activeItem={activeItem}
                      item={collection.name}
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
