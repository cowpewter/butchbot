import { PrismaClient } from "@prisma/client";
import express from "express";

import ButchBot from "./butchbot";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.BOT_TOKEN) {
    throw Error("No BOT_TOKEN provided! Check your env vars.");
  }

  ButchBot(process.env.BOT_TOKEN, prisma);

  const PORT = process.env.PORT || 3000;
  const app = express();
  app.get("/", (_, res) => res.send("Hello World!"));
  app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
