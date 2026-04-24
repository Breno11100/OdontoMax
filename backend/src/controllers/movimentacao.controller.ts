import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/*POST*/
export async function criarMovimentacao(req: Request, res: Response) {
  try {
    const { tipo, quantidade, id_produto } = req.body;

    const usuario =  { id: 1 }; //(req as any).usuario;

    const produto = await prisma.produto.findUnique({
      where: { id_produto }
    });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // ENTRADA
    if (tipo === 'ENTRADA') {
      await prisma.produto.update({
        where: { id_produto },
        data: {
          quantidade: produto.quantidade + quantidade
        }
      });
    }

    // SAÍDA
    if (tipo === 'SAIDA') {
      if (produto.quantidade < quantidade) {
        return res.status(400).json({ error: 'Estoque insuficiente' });
      }

      await prisma.produto.update({
        where: { id_produto },
        data: {
          quantidade: produto.quantidade - quantidade
        }
      });
    }

    const movimentacao = await prisma.movimentacao.create({
      data: {
        tipo,
        quantidade,
        id_produto,
        id_usuario: usuario.id
      }
    });

    res.status(201).json(movimentacao);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar movimentação' });
  }
}

/*GET*/
export async function listarMovimentacoes(req: Request, res: Response) {
  const movimentacoes = await prisma.movimentacao.findMany({
    include: {
      produto: true,
      usuario: true
    },
    orderBy: {    //Deixar descrescente a ordem das movimentações
      data: "desc"
    }
  });

  res.json(movimentacoes);
}