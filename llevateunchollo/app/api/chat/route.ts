import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import prisma from "@/lib/prisma";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  // Carga el catálogo actual para que Oscar lo conozca
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true },
    take: 30,
    orderBy: { createdAt: "desc" },
  });

  const productList = products.length
    ? products
        .map((p) => {
          const discount =
            p.originalPrice && p.originalPrice > p.price
              ? ` (antes ${p.originalPrice}€, ahorro ${Math.round((1 - p.price / p.originalPrice) * 100)}%)`
              : "";
          return `• ${p.name} [${p.category.name}]: ${p.price}€${discount} — ${p.stock} uds. disponibles`;
        })
        .join("\n")
    : "El catálogo está siendo actualizado.";

  const systemPrompt = `Eres Oscar, el asistente virtual de LlévateUnChollo (www.llevateunchollo.es), una tienda online española de chollos y productos de oportunidad a precios increíbles.

Tu personalidad:
- Amigable, cercano y entusiasta con las ofertas 🔥
- Siempre en español
- Transmites urgencia de forma natural: "¡Pocas unidades!", "¡Oferta limitada!"
- Respuestas cortas y directas: máximo 3-4 frases
- Usas emojis con moderación para dar energía

Información de la tienda:
- Web: www.llevateunchollo.es
- Envío: GRATIS en pedidos superiores a 99€ / 5,99€ en pedidos menores
- Pago: tarjeta bancaria segura con Stripe (Visa, Mastercard, American Express)
- Devoluciones: 14 días desde la recepción del pedido
- Contacto humano: formulario en /contacto

Catálogo actual:
${productList}

Reglas:
- NUNCA inventes precios, stocks o características que no estén arriba
- Si preguntan por un pedido concreto, derívales al formulario de contacto
- Si no puedes ayudar, di: "Para esto te recomiendo usar nuestro formulario de contacto en /contacto o escribirnos un WhatsApp"`;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 512,
          system: systemPrompt,
          messages,
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n`;
            controller.enqueue(encoder.encode(chunk));
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("Error en chat Oscar:", error);
        const errMsg = `data: ${JSON.stringify({ text: "Lo siento, ha habido un error. Por favor inténtalo de nuevo." })}\n\n`;
        controller.enqueue(encoder.encode(errMsg));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
