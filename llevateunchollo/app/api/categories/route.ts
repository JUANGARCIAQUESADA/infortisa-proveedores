import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return Response.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}
