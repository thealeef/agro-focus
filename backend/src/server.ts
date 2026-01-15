import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

// Configurações de Segurança
fastify.register(cors, { 
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] 
});

fastify.register(jwt, { secret: 'agro-focus-secret-key-2026' });

// --- ROTAS DE AUTENTICAÇÃO ---

fastify.post('/register', async (request, reply) => {
  const { email, password, name } = request.body as any;
  const hashedPassword = await bcrypt.hash(password, 8);
  
  try {
    // 1. Cria o Usuário
    const user = await prisma.user.create({
      data: { 
        email, 
        name, 
        password: hashedPassword,
        // 2. Cria automaticamente um Talhão vinculado a esse usuário
        talhoes: {
          create: {
            nome: "Talhão Principal",
            cultura: "Soja (Padrão)"
          }
        }
      }
    });
    return { id: user.id, name: user.name };
  } catch (e) {
    console.error(e);
    return reply.status(400).send({ error: "E-mail já cadastrado ou erro no servidor" });
  }
});

fastify.post('/login', async (request, reply) => {
  const { email, password } = request.body as any;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return reply.status(401).send({ error: "Credenciais inválidas" });
  }

  const token = fastify.jwt.sign({ id: user.id, name: user.name });
  return { token, user: { id: user.id, name: user.name } };
});

// --- ROTAS DE NEGÓCIO ---

fastify.get('/stats', async (request) => {
  // Filtro por data opcional via Query Params (?inicio=2026-01-01&fim=2026-12-31)
  const { inicio, fim } = request.query as any;

  const despesas = await prisma.despesa.findMany({
    where: {
      data: {
        gte: inicio ? new Date(inicio) : undefined,
        lte: fim ? new Date(fim) : undefined,
      }
    }
  });

  const totalGeral = despesas.reduce((acc, curr) => acc + curr.valor, 0);
  const categoriasMap = despesas.reduce((acc: any, curr) => {
    acc[curr.categoria] = (acc[curr.categoria] || 0) + curr.valor;
    return acc;
  }, {});

  return { 
    totalGeral, 
    categorias: Object.keys(categoriasMap).map(name => ({ name, value: categoriasMap[name] })) 
  };
});

fastify.post('/despesas', async (request) => {
  const { descricao, valor, categoria, talhaoId, data } = request.body as any;
  return await prisma.despesa.create({
    data: { descricao, valor: Number(valor), categoria, talhaoId, data: data ? new Date(data) : new Date() }
  });
});

fastify.delete('/despesas/:id', async (request) => {
  const { id } = request.params as { id: string };
  await prisma.despesa.delete({ where: { id } });
  return { success: true };
});

fastify.get('/talhoes', async () => {
  return await prisma.talhao.findMany({ include: { despesas: true } });
});

fastify.listen({ port: 3333 });