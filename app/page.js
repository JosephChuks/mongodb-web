import { auth } from "@/app/_lib/auth";
import Homepage from "@/app/_components/Homepage";
import { getDbs } from "./_lib/action";

export default async function Home() {
  const session = await auth();
  if (!session || !session.user)
    return (
      <Homepage
        title="MongoDB Manager"
        data={[]}
        type="loggedout"
      />
    );

  const { username } = session.user;
  const dbs = await getDbs();

  return <Homepage title={username} data={dbs} type="dbs" />;
}



