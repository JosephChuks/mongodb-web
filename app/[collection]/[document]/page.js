import { redirect } from "next/navigation";
import { getDocuments } from "@/app/_lib/action";
import Homepage from "@/app/_components/Homepage";
import { auth } from "@/app/_lib/auth";

export default async function DocumentPage({ params }) {
  const session = await auth();
  if (!session) return redirect("/");
  const { collection, document } = await params;
  const documents = await getDocuments(collection, document);

  return <Homepage title={document} data={documents} type="documents" />;
}
