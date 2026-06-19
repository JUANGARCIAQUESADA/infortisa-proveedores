"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

interface ContactForm {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

export default function ContactoPage() {
  const [form, setForm] = useState<ContactForm>({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar el mensaje");
      }

      setStatus("success");
      setForm({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Error desconocido"
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Contacto</h1>
        <p className="text-gray-500 text-lg">
          Estamos aquí para ayudarte. Escríbenos y te responderemos lo antes
          posible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Envíanos un mensaje
          </h2>

          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-500 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">
                ¡Mensaje enviado!
              </h3>
              <p className="text-gray-600 text-sm">
                Te responderemos en el menor tiempo posible.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre *
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Tu nombre"
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
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Teléfono (opcional)
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+34 600 000 000"
                />
              </div>
              <div>
                <label
                  htmlFor="asunto"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Asunto *
                </label>
                <input
                  id="asunto"
                  name="asunto"
                  type="text"
                  required
                  value={form.asunto}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <div>
                <label
                  htmlFor="mensaje"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  rows={5}
                  value={form.mensaje}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              {status === "error" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errorMsg}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={status === "loading"}
              >
                {status === "loading" ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Contacto directo
            </h2>
            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-600">Respuesta rápida garantizada</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                La forma más rápida de contactarnos. Disponible en horario
                comercial de lunes a viernes de 9:00 a 18:00.
              </p>
              <WhatsAppButton
                message="Hola, me gustaría ponerme en contacto con vosotros"
                label="Abrir WhatsApp"
                size="md"
                className="w-full justify-center"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Información</h3>
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  Horario de atención
                </p>
                <p className="text-gray-500 text-sm">
                  Lun-Vie: 9:00 - 18:00
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  Tiempo de respuesta
                </p>
                <p className="text-gray-500 text-sm">
                  En menos de 24 horas laborables
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
