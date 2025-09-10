import { server } from '../../Server';
import { prisma } from '../../../lib/prisma';
import { validation } from '../../shared/middleware/validation';
import * as yup from 'yup';

export interface IQueryProps {
  id?: number;
  page?: number;
  limit?: number;
  filter?: string;
}

const MAX_LIMIT = 100;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const GetAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(
    yup.object().shape({
      id: yup.number().optional().integer().min(1),
      page: yup.number().optional().integer().min(1).default(DEFAULT_PAGE),
      limit: yup
        .number()
        .optional()
        .integer()
        .min(1)
        .max(MAX_LIMIT)
        .default(DEFAULT_LIMIT),
      filter: yup.string().optional().trim(),
    }),
  ),
}));

import { Request, Response } from 'express';

export const GetAll = async (req: Request, res: Response) => {
  try {
    // o middleware de validation já aplicou defaults, mas garantimos types:
    const {
      id,
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      filter,
    } = (req.query ?? {}) as unknown as IQueryProps;

    // Se passou id, retornamos apenas esse item (ou 404)
    if (id && id > 0) {
      const task = await prisma.task.findUnique({
        where: { id: String(id) },
        // selecione só os campos necessários (evita puxar grandes blobs)
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          // include: { author: { select: { id: true, name: true } } }, // se quiser relações
        },
      });

      if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }

      return res.status(200).json({ data: task });
    }

    // Monta o where dinamicamente com base no filter
    const where = filter
      ? {
          OR: [
            { title: { contains: filter, mode: 'insensitive' } },
            { description: { contains: filter, mode: 'insensitive' } },
            // adicione outros campos relevantes
          ],
        }
      : {};

    // Garantir limites razoáveis (em caso de query manual sem middleware)
    const safeLimit = Math.min(limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const safePage = Math.max(page ?? DEFAULT_PAGE, 1);
    const skip = (safePage - 1) * safeLimit;

    // total para meta (útil no front)
    const total = await prisma.task.count({ where });

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: safeLimit,
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        // evite puxar campos grandes como "content" se não for necessário na listagem
      },
    });

    const totalPages = Math.ceil(total / safeLimit);

    return res.status(200).json({
      data: tasks,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages,
      },
    });
  } catch (err: any) {
    // Log detalhado no servidor (sem vazar stack para o cliente)
    console.error('Erro ao buscar tarefas:', err);

    // Respostas amigáveis ao cliente
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
