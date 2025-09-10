import { server } from '../../Server';
import { prisma } from '../../../lib/prisma';
import { validation } from '../../shared/middleware/validation';
import * as yup from 'yup';
import { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

export interface GetTaskParams {
  id: string;
}

export const GetByIdValidation = validation((getSchema) => ({
  params: getSchema<GetTaskParams>(
    yup.object({
      id: yup
        .string()
        .required('ID da tarefa é obrigatório')
        .uuid('ID inválido'),
    }) as yup.ObjectSchema<GetTaskParams>,
  ),
}));

export const GetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.json(task);
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
