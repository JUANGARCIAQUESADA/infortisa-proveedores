import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ExitoPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      {/* Success icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-500 rounded-full mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-10 h-10"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
        ¡Pedido realizado con éxito!
      </h1>
      <p className="text-lg text-gray-600 mb-2">
        Muchas gracias por tu compra en LlévateUnChollo.
      </p>
      <p className="text-gray-500 mb-8">
        Recibirás un correo de confirmación con los detalles de tu pedido.
        Procesaremos tu envío en las próximas 24-48 horas.
      </p>

      <div className="bg-orange-50 rounded-xl p-6 mb-8 text-left space-y-3">
        <h2 className="font-bold text-gray-900">¿Qué ocurre ahora?</h2>
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
            1
          </span>
          <span>Recibirás un email de confirmación con tu número de pedido</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
            2
          </span>
          <span>Preparamos tu pedido y lo enviamos en 24-48 horas laborables</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
            3
          </span>
          <span>Recibirás el número de seguimiento por email cuando se envíe</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/catalogo">
          <Button variant="primary" size="lg">
            Seguir comprando
          </Button>
        </Link>
        <Link href="/contacto">
          <Button variant="outline" size="lg">
            ¿Tienes alguna duda?
          </Button>
        </Link>
      </div>
    </div>
  );
}
