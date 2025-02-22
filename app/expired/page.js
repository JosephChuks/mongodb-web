"use client";
import Spinner from "@/app/_components/Spinner";
import { logout } from "@/app/_lib/action";
import { useState } from "react";
import Base from "../_components/Base";

export default function Expired() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Base>
      <div className="text-center mt-10">
        <h1 className="text-3xl font-semibold text-accent">Session Expired</h1>
        <p className="text-lg mt-2">
          Your session has expired due to a password update or token expiry.
          Click continue to login with your new credentials
        </p>
        <form action={logout}>
          <button
            type="submit"
            className="inline-block bg-accent px-6 py-2 text-lg mt-4"
            onClick={() => setIsLoading(true)}
          >
            {isLoading ? <Spinner /> : "CONTINUE"}
          </button>
        </form>
      </div>
    </Base>
  );
}
