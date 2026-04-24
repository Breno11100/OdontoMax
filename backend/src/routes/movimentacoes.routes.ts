import { Router } from 'express';
import {
  criarMovimentacao,
  listarMovimentacoes
} from '../controllers/movimentacao.controller';

import { auth } from '../middlewares/auth';

const router = Router();

router.post('/', criarMovimentacao);
router.get('/', listarMovimentacoes);

export default router;