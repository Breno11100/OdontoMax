import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/*GET*/
export async function listarUsuarios(req: Request, res: Response) {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
}

/*POST*/
export async function criarUsuario(req: Request, res: Response) {
  try {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        perfil
      }
    });

    res.status(201).json(usuario);

  } catch (error: any) {
    // tratamento do erro de email duplicado
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}

/*PUT*/
export async function atualizarUsuario(req: Request, res: Response) {
  try {
    const id_usuario = Number(req.params.id);
    const { nome, email, senha, perfil } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const dados: any = { nome, email, perfil };

    if (senha) {
      dados.senha = await bcrypt.hash(senha, 10);
    }

    const atualizado = await prisma.usuario.update({
      where: { id_usuario },
      data: dados
    });

    res.json(atualizado);

  } catch {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
}

/*DELETE*/
export async function deletarUsuario(req: Request, res: Response) {
  try {
    const id_usuario = Number(req.params.id);

    await prisma.usuario.delete({
      where: { id_usuario }
    });

    res.json({ message: 'Usuário deletado' });

  } catch {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
}