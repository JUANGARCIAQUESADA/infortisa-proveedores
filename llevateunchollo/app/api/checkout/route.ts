import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";

interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerData {
  nombre: string;
  email: string;
  telefono?: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  provincia: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer,
      items,
      total,
    }: { customer: CustomerData; items: CheckoutItem[]; total: number } = body;

    if (!customer || !items || items.length === 0) {
      return Response.json(
        { error: "Datos de pedido incompletos" },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Create order in database
    const order = await prisma.order.create({
      data: {
        customerName: customer.nombre,
        customerEmail: customer.email,
        customerPhone: customer.telefono || null,
        total,
        status: "pending",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customer.email,
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${siteUrl}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/carrito`,
      metadata: {
        orderId: order.id,
      },
    });

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeId: session.id },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json(
      { error: "Error al procesar el pago" },
      { status: 500 }
    );
  }
}
