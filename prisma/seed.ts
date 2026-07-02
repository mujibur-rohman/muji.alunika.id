import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const hashedPassword = await hash("muji6666", 12);

  const user = await prisma.user.upsert({
    where: { email: "admin@muji.alunika.id" },
    update: {},
    create: {
      email: "admin@muji.alunika.id",
      name: "Muji Alunika",
      password: hashedPassword,
    },
  });

  console.log("Admin user created:", user.email);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
