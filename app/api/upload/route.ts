import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { unauthorized } from "next/navigation";

import { auth } from "@/auth";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session?.user) {
      unauthorized();
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();

    const bucket = formData.get("bucket") as string | null;
    const file = formData.get("file") as File;

    if (!bucket || !file) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const blob = await put(`${bucket}/${file.name}`, file, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
