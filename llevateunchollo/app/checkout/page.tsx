"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const SHIPPING_THRESHOLD = 99;
const SHIPPING_COST = 5.99;

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  provincia: string;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    provincia: "",
  });

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
          total: grandTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al procesar el pedido");
      }

      if (data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        clearCart();
        router.push("/checkout/exito");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Tu carrito está vacío
        </h1>
        <Link href="/catalogo">
          <Button variant="primary">Ver catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tramitar pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Data */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Datos personales
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre completo *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Tu nombre y apellidos"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+34 600 000 000"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Dirección de envío
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="direccion"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Dirección *
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  required
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Calle, número, piso..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="ciudad"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ciudad *
                  </label>
                  <input
                    id="ciudad"
                    name="ciudad"
                    type="text"
                    required
                    value={formData.ciudad}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Madrid"
                  />
                </div>
                <div>
                  <label
                    htmlFor="codigoPostal"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Código postal *
                  </label>
                  <input
                    id="codigoPostal"
                    name="codigoPostal"
                    type="text"
                    required
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="28001"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="provincia"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Provincia *
                </label>
                <input
                  id="provincia"
                  name="provincia"
                  type="text"
                  required
                  value={formData.provincia}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Madrid"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Método de pago
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Serás redirigido a la pasarela de pago seguro de Stripe para
              completar tu compra.
            </p>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 flex-shrink-0"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              Pago 100% seguro con cifrado SSL
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? "Procesando..." : `Pagar ${formatPrice(grandTotal)}`}
          </Button>
        </form>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Resumen del pedido
            </h2>
            <div className="space-y-3 pb-4 border-b border-gray-100">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600">
                    {item.product.name}{" "}
                    <span className="text-gray-400">x{item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2 py-4 border-b border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4">
              <span>Total</span>
              <span className="text-orange-600">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
