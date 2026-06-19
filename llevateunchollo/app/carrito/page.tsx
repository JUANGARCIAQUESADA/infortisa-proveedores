"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const SHIPPING_THRESHOLD = 99;
const SHIPPING_COST = 5.99;

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-24 h-24 text-gray-200 mx-auto mb-6"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Tu carrito está vacío
        </h1>
        <p className="text-gray-500 mb-8">
          Aún no has añadido ningún producto. ¡Explora nuestro catálogo!
        </p>
        <Link href="/catalogo">
          <Button variant="primary" size="lg">
            Ver catálogo de chollos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tu carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const images =
              typeof item.product.images === "string"
                ? (JSON.parse(item.product.images) as string[])
                : item.product.images;
            const imageSrc = images[0] || "/productos/placeholder.svg";

            return (
              <div
                key={item.product.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4"
              >
                <Link
                  href={`/producto/${item.product.slug}`}
                  className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50"
                >
                  <Image
                    src={imageSrc}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/producto/${item.product.slug}`}
                    className="font-semibold text-gray-900 hover:text-orange-500 transition-colors line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.product.category.name}
                  </p>
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                        aria-label="Reducir cantidad"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-orange-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Eliminar del carrito"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <Link href="/catalogo">
            <Button variant="ghost" size="sm">
              ← Seguir comprando
            </Button>
          </Link>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Resumen del pedido
            </h2>
            <div className="space-y-3 pb-4 border-b border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {total < SHIPPING_THRESHOLD && (
                <p className="text-xs text-gray-500">
                  Añade {formatPrice(SHIPPING_THRESHOLD - total)} más para
                  envío gratis
                </p>
              )}
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 mb-6">
              <span>Total</span>
              <span className="text-orange-600">{formatPrice(grandTotal)}</span>
            </div>
            <Link href="/checkout">
              <Button variant="primary" size="lg" fullWidth>
                Tramitar pedido
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
