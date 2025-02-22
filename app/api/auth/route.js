import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signIn } from "@/app/_lib/auth";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    const allCookies = cookieStore.getAll();
    const { sessionId, username } = body;


    const validSession = allCookies.some(
      (cookie) => cookie.value === sessionId
    );

    if (!validSession) {
      throw new Error(
        "Invalid session. Login to your control panel to gain access"
      );
    }

    await signIn("credentials", {
      redirect: false,
      username,
      userid: sessionId,
    });

    return NextResponse.json(
      {
        success: true,
        url: `${process.env.NEXTAUTH_URL}`,
        cookies: allCookies,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message.includes("invalidadmin")
          ? "Database connection failed. contact support for further assistance"
          : err.message,
      },
      {
        status: 500,
        statusText: err.message.includes("invalidadmin")
          ? "Database connection failed. contact support for further assistance"
          : err.message,
      }
    );
  }
}


