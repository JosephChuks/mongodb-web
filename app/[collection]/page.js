import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/app/_lib/auth";
import { getCollections } from "@/app/_lib/action";
import Homepage from "@/app/_components/Homepage";

export default async function Collection({ params }) {
  const session = await auth();
  if (!session) return redirect("/");
  const { collection } = await params;

  const collections = await getCollections(collection);

  return <Homepage title={collection} data={collections} type="collections" />;
}
