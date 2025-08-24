import { PrismaClient } from '@prisma/client';

// Declara uma variável global para o cliente Prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Inicia o cliente Prisma, reutilizando a instância existente em desenvolvimento
// para evitar a criação de múltiplas conexões.
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;