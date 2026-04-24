import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/*GET*/
export async function listarProdutos(req: Request, res: Response) {
  const produtos = await prisma.produto.findMany();
  res.json(produtos);
}

/*POST*/
export async function criarProduto(req: Request, res: Response) {
  try {
    const {
      nome,
      quantidade,
      quantidade_minima,
      descricao,
      categoria,
      unidade_medida
    } = req.body;

    const produto = await prisma.produto.create({
      data: {
        nome,
        quantidade,
        quantidade_minima,
        descricao,
        categoria,
        unidade_medida
      }
    });

    res.status(201).json(produto);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
}

/*PUT*/
export async function atualizarProduto(req: Request, res: Response) {
  try {
    const id_produto = Number(req.params.id);
    const dados = req.body;

    const produto = await prisma.produto.findUnique({
      where: { id_produto }
    });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const atualizado = await prisma.produto.update({
      where: { id_produto },
      data: dados
    });

    res.json(atualizado);

  } catch {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
}

/*DELETE*/
export async function deletarProduto(req: Request, res: Response) {
  try {
    const id_produto = Number(req.params.id);

    const movimentacoes = await prisma.movimentacao.findMany({
      where: { id_produto }
    });

    if (movimentacoes.length > 0) {
      return res.status(400).json({
        error: 'Produto possui movimentações'
      });
    }

    await prisma.produto.delete({
      where: { id_produto }
    });

    res.json({ message: 'Produto deletado' });

  } catch {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
}