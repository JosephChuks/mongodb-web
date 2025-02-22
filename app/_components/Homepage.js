"use client";
import { FaCaretRight, FaHome } from "react-icons/fa";
import Base from "./Base";
import Table from "./Table";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Login from "./Login";

export default function Homepage({ title, data, type }) {
  const pathname = usePathname();
  return (
    <Base>
      {type === "loggedout" ? (
        <>
          <div className="flex h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-background">
            <h2 className="text-center text-lg text-primary py-4">{title}</h2>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Login />
            </div>
          </div>
        </>
      ) : (
        <>
          <ul className="flex gap-x-1 items-center mb-8 pb-1 border-b border-primary">
            <li>
              <Link href="/">
                <FaHome className="inline-block text-red-500" />
              </Link>
            </li>
            <li>
              <FaCaretRight className="inline-block" />
              <span className="text-sm text-primary"> {pathname}</span>
            </li>
          </ul>

          <Table data={data} type={type} title={title} />
        </>
      )}
    </Base>
  );
}
