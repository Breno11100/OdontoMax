import { Request, Response } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET || "chave_secreta",
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });

  } catch (error) {
    return res.status(500).json({ error: "Erro interno no login" });
  }
}