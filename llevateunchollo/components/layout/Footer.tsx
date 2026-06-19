import Link from "next/link";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#1A1A1A" }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl mb-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 text-orange-500"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.818a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.845-.143z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <span className="text-orange-500">Llévate</span>
                <span className="text-white">UnChollo</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Los mejores chollos al mejor precio. Encuentra ofertas increíbles en productos de calidad.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/catalogo"
                  className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto directo</h3>
            <p className="text-gray-400 text-sm mb-4">
              ¿Tienes alguna pregunta? Escríbenos directamente por WhatsApp.
            </p>
            <WhatsAppButton
              message="Hola, me gustaría obtener más información sobre vuestros productos"
              label="Escríbenos por WhatsApp"
              size="sm"
            />
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} LlévateUnChollo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
