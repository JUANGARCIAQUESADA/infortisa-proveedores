import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Tipo de archivo no permitido. Solo JPEG, PNG, WebP o SVG." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${timestamp}.${extension}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);

    const url = `/uploads/${filename}`;
    return Response.json({ url }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { error: "Error al subir el archivo" },
      { status: 500 }
    );
  }
}
