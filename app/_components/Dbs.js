"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { createDb, deleteDb, updateDb } from "../_lib/action";
import TableButtons from "./TableButtons";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
import { FaUserLock } from "react-icons/fa";
import DbsModal from "./DbsModal";

export default function Dbs({ data, total, title }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [activeDbuser, setActiveDbuser] = useState("");
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  data.sort((a, b) => a.dbname.localeCompare(b.dbname));

  const handleAdd = async (formData) => {
    const dbuser = formData.get("dbuser");
    const dbname = formData.get("dbname");
    const password = formData.get("password");

    const result = await createDb(dbname, dbuser, password);
    Swal.fire({
      title: result.success ? "Success!" : "Error occurred!",
      text: result.message,
      icon: result.success ? "success" : "error",
    });
    setIsAddLoading(false);
    return;
  };

  const handleUpdate = async (formData) => {
    const password = formData.get("password");

    const result = await updateDb(activeDbuser, password);
    Swal.fire({
      title: result.success ? "Success!" : "Error occurred!",
      text: result.message,
      icon: result.success ? "success" : "error",
    });
    setIsUpdateLoading(false);
    return;
  };

  const handleDelete = (dbname) => {
    setIsLoading(true);

    Swal.fire({
      title: "Alert",
      text: "Are you sure you want to delete? This action will delete the database and users connected to it and cannot be undone.",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Proceed",
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        const submit = async () => {
          setIsLoading(true);
          const result = await deleteDb(dbname);
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
              <p>
                Total database:&nbsp;
                <span className="text-primary">{total}</span>
              </p>

              <div>
                <DbsModal
                  open={isOpen}
                  setOpen={setIsOpen}
                  action={handleAdd}
                  setIsLoading={setIsAddLoading}
                  username={title}
                  dbuser=""
                />

                <DbsModal
                  open={isUpdateOpen}
                  setOpen={setIsUpdateOpen}
                  action={handleUpdate}
                  setIsLoading={setIsUpdateLoading}
                  username={title}
                  dbuser={activeDbuser}
                  type="update"
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
                {data.map((db) => (
                  <li
                    key={db.dbname}
                    className="flex justify-between gap-x-6 py-2"
                  >
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        {isUpdateLoading &&
                        db.dbuser.split("_").at(1) === activeDbuser ? (
                          <p>updating...</p>
                        ) : (
                          <button
                            onClick={() => {
                              setIsUpdateOpen(true);
                              setActiveDbuser(() => {
                                return db.dbuser.split("_").at(1);
                              });
                            }}
                          >
                            <FaUserLock className="inline-flex mr-2 cursor-pointer" />
                            <span className="text-primary">{db.dbname}</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <TableButtons
                      onManage={() => router.push(`/${db.dbname}`)}
                      onDelete={handleDelete}
                      isLoading={isLoading}
                      activeItem={db.dbname}
                      item={db.dbname}
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
