import { PrismaClient } from "@prisma/client";

const prismacleint = new PrismaClient({
  log: ["query"],
});

export default prismacleint;
