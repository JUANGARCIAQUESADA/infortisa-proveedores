import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return Response.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    return Response.json({
      ...product,
      images: JSON.parse(product.images) as string[],
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json({ error: "Error al obtener producto" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      stock,
      categoryId,
      images,
      whatsappMsg,
      active,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(String(price));
    if (originalPrice !== undefined)
      updateData.originalPrice = originalPrice ? parseFloat(String(originalPrice)) : null;
    if (stock !== undefined) updateData.stock = parseInt(String(stock), 10);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (images !== undefined)
      updateData.images = typeof images === "string" ? images : JSON.stringify(images);
    if (whatsappMsg !== undefined) updateData.whatsappMsg = whatsappMsg || null;
    if (active !== undefined) updateData.active = active;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    return Response.json({
      ...product,
      images: JSON.parse(product.images) as string[],
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}
