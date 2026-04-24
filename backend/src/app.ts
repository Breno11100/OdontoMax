import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { prisma } from './config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth } from './middlewares/auth';
import produtosRoutes from './routes/produtos.routes';
import usuariosRoutes from './routes/usuarios.routes';
import movimentacoesRoutes from './routes/movimentacoes.routes'
import authRoutes from "./routes/auth.routes";


const app = express();

app.use(cors());
app.use(express.json());
app.use('/produtos', produtosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/movimentacoes', movimentacoesRoutes);
app.use("/auth", authRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API rodando 🚀' });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

app.get('/teste-db', async (req, res) => {
  const dados = await prisma.produto.findMany();
  res.json(dados);
});

/*Rota Login*/
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senha);

    if (!senhaOk) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        perfil: usuario.perfil
      },
      'segredo', // depois melhoramos isso
      { expiresIn: '1d' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no login' });
  }
});

