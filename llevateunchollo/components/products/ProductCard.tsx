"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice, getDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useCart } from "@/components/cart/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const images =
    typeof product.images === "string"
      ? (JSON.parse(product.images) as string[])
      : product.images;

  const imageSrc = images[0] || "/productos/placeholder.svg";

  const discount =
    product.originalPrice
      ? getDiscount(product.price, product.originalPrice)
      : 0;

  const whatsappMsg =
    product.whatsappMsg ||
    `Hola, me interesa el producto "${product.name}" que vi en LlévateUnChollo. ¿Podéis darme más información?`;

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
      {/* Image */}
      <Link href={`/producto/${product.slug}`} className="relative block">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2">
              <Badge variant="discount">-{discount}%</Badge>
            </div>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <div className="absolute top-2 right-2">
              <Badge variant="stock">¡Últimas {product.stock}!</Badge>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
              <span className="bg-white text-gray-700 text-sm font-bold px-3 py-1 rounded-full">
                Agotado
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <div className="mb-2">
          <Badge variant="category">{product.category.name}</Badge>
        </div>

        {/* Name */}
        <Link
          href={`/producto/${product.slug}`}
          className="text-gray-900 font-semibold leading-snug hover:text-orange-500 transition-colors line-clamp-2 mb-3"
        >
          {product.name}
        </Link>

        {/* Prices */}
        <div className="flex items-end gap-2 mb-4 mt-auto">
          <span className="text-xl font-bold text-orange-600">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            fullWidth
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            size="sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            Añadir al carrito
          </Button>
          <WhatsAppButton
            message={whatsappMsg}
            label="Comprar por WhatsApp"
            size="sm"
            className="w-full justify-center"
          />
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
