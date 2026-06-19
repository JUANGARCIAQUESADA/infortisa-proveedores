import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoria = searchParams.get("categoria");
  const buscar = searchParams.get("buscar");
  const minPrecio = searchParams.get("min_precio");
  const maxPrecio = searchParams.get("max_precio");

  const where: Record<string, unknown> = { active: true };

  if (categoria) {
    const slugs = categoria.split(",").filter(Boolean);
    where.category = { slug: { in: slugs } };
  }

  if (buscar) {
    where.name = { contains: buscar };
  }

  if (minPrecio || maxPrecio) {
    const priceFilter: Record<string, number> = {};
    if (minPrecio) priceFilter.gte = parseFloat(minPrecio);
    if (maxPrecio) priceFilter.lte = parseFloat(maxPrecio);
    where.price = priceFilter;
  }

  try {
    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    const serialized = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images) as string[],
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return Response.json(serialized);
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

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

    const imagesStr = typeof images === "string" ? images : JSON.stringify(images);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        stock: parseInt(stock, 10),
        categoryId,
        images: imagesStr,
        whatsappMsg: whatsappMsg || null,
        active: active ?? true,
      },
      include: { category: true },
    });

    return Response.json(
      {
        ...product,
        images: JSON.parse(product.images) as string[],
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return Response.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
