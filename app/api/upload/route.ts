import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";

import { auth } from "@/auth";
import env from "@/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

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

    const buffer = Buffer.from(await file.arrayBuffer());
    const uri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const response = await cloudinary.uploader.upload(uri, {
      folder: bucket,
    });

    return NextResponse.json({ url: response.secure_url }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
