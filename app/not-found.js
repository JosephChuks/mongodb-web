"use client";
import Link from "next/link";
import Base from "./_components/Base";

export default function Expired() {
  return (
    <Base>
      <div className="text-center mt-10">
        <h1 className="text-3xl font-semibold text-accent">404</h1>
        <p className="text-lg mt-2">
          The page you are looking for may have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent px-6 py-2 text-lg mt-4"
        >
          Home
        </Link>
      </div>
    </Base>
  );
}
