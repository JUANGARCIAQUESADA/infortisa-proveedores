import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Product } from "@/types";
import { formatPrice, getDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ProductGrid } from "@/components/products/ProductGrid";
import AddToCartButton from "./AddToCartButton";

async function getProduct(slug: string): Promise<Product | null> {
  const raw = await prisma.product.findUnique({
    where: { slug, active: true },
    include: { category: true },
  });
  if (!raw) return null;
  return {
    ...raw,
    images: JSON.parse(raw.images) as string[],
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };
}

async function getRelatedProducts(
  categoryId: string,
  excludeId: string
): Promise<Product[]> {
  const raw = await prisma.product.findMany({
    where: { categoryId, active: true, id: { not: excludeId } },
    include: { category: true },
    take: 3,
  });
  return raw.map((p) => ({
    ...p,
    images: JSON.parse(p.images) as string[],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id
  );

  const discount = product.originalPrice
    ? getDiscount(product.price, product.originalPrice)
    : 0;

  const images =
    typeof product.images === "string"
      ? (JSON.parse(product.images) as string[])
      : product.images;

  const imageSrc = images[0] || "/productos/placeholder.svg";

  const whatsappMsg =
    product.whatsappMsg ||
    `Hola, me interesa el producto "${product.name}" que vi en LlévateUnChollo. ¿Podéis darme más información?`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-orange-500 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link
          href="/catalogo"
          className="hover:text-orange-500 transition-colors"
        >
          Catálogo
        </Link>
        <span>/</span>
        <Link
          href={`/catalogo?categoria=${product.category.slug}`}
          className="hover:text-orange-500 transition-colors"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium line-clamp-2 max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {discount > 0 && (
            <div className="absolute top-4 left-4">
              <Badge variant="discount" className="text-base px-3 py-1.5">
                -{discount}%
              </Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Category */}
          <div className="mb-3">
            <Badge variant="category">{product.category.name}</Badge>
          </div>

          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Prices */}
          <div className="flex items-end gap-3 mb-2">
            <span className="text-3xl font-bold text-orange-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <Badge variant="discount">-{discount}%</Badge>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 5 ? (
              <span className="text-green-600 text-sm font-medium">
                En stock ({product.stock} disponibles)
              </span>
            ) : product.stock > 0 ? (
              <span className="text-orange-600 text-sm font-medium">
                ¡Últimas {product.stock} unidades!
              </span>
            ) : (
              <span className="text-red-600 text-sm font-medium">Agotado</span>
            )}
          </div>

          {/* Short description */}
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description.split(".")[0]}.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <AddToCartButton product={product} />
            <WhatsAppButton
              message={whatsappMsg}
              label="Comprar por WhatsApp"
              size="lg"
              className="w-full justify-center"
            />
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { icon: "🚚", text: "Envío gratis +99€" },
              { icon: "🛡️", text: "Garantía de calidad" },
              { icon: "↩️", text: "Devolución sencilla" },
              { icon: "💳", text: "Pago seguro" },
            ].map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Description */}
      <section className="bg-white rounded-xl border border-gray-100 p-6 mb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Descripción completa
        </h2>
        <div className="text-gray-600 leading-relaxed whitespace-pre-line">
          {product.description}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Productos relacionados
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
