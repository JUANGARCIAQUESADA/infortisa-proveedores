import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Categories
  const eventosExterior = await prisma.category.upsert({
    where: { slug: "eventos-exterior" },
    update: {},
    create: {
      name: "Eventos y Exterior",
      slug: "eventos-exterior",
    },
  });

  await prisma.category.upsert({
    where: { slug: "hogar" },
    update: {},
    create: {
      name: "Hogar",
      slug: "hogar",
    },
  });

  await prisma.category.upsert({
    where: { slug: "deportes" },
    update: {},
    create: {
      name: "Deportes",
      slug: "deportes",
    },
  });

  console.log("Categories created:", eventosExterior.name);

  // Product
  const carpa = await prisma.product.upsert({
    where: { slug: "carpa-plegable-profesional-3x3" },
    update: {},
    create: {
      name: "Carpa Plegable Profesional 3x3",
      slug: "carpa-plegable-profesional-3x3",
      description:
        "Carpa de aluminio resistente, fácil de montar, ideal para mercados, eventos y uso exterior. Incluye bolsa de transporte. Estructura de aluminio anodizado de alta resistencia. Cubierta impermeable con protección UV50+. Montaje en menos de 5 minutos sin herramientas. Incluye 4 pesas de lastre y bolsa de transporte.",
      price: 149.0,
      originalPrice: 229.0,
      stock: 10,
      images: JSON.stringify(["/productos/carpa-3x3.jpg"]),
      categoryId: eventosExterior.id,
      active: true,
      whatsappMsg:
        "Hola, me interesa la Carpa Plegable Profesional 3x3 que vi en LlévateUnChollo. ¿Podéis darme más información?",
    },
  });

  console.log("Product created:", carpa.name);

  // Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@llevateunchollo.es" },
    update: {},
    create: {
      email: "admin@llevateunchollo.es",
      password: hashedPassword,
      name: "Administrador",
    },
  });

  console.log("Admin user created:", admin.email);
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
