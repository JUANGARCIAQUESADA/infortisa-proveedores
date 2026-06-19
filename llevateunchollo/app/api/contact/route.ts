import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, asunto, mensaje } = body;

    if (!nombre || !email || !asunto || !mensaje) {
      return Response.json(
        { error: "Todos los campos obligatorios son requeridos" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        name: nombre,
        email,
        phone: telefono || null,
        subject: asunto,
        message: mensaje,
      },
    });

    return Response.json({ success: true, id: contact.id }, { status: 201 });
  } catch (error) {
    console.error("Error saving contact:", error);
    return Response.json(
      { error: "Error al guardar el mensaje" },
      { status: 500 }
    );
  }
}
