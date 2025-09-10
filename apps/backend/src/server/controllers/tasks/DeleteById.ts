import { Request, Response } from 'express';
import { validation } from '../../shared/middleware/validation';
import * as yup from 'yup';
import { prisma } from '../../../lib/prisma';
import { StatusCodes } from 'http-status-codes';

export interface DeleteTaskParams {
  id: string;
}

export const DeleteByIdValidation = validation((getSchema) => ({
  params: getSchema<DeleteTaskParams>(
    yup.object({
      id: yup
        .string()
        .required('ID da tarefa é obrigatório')
        .uuid('ID inválido'),
    }) as yup.ObjectSchema<DeleteTaskParams>,
  ),
}));

export const DeleteById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    // Verificar se tarefa existe
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Tarefa não encontrada' });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(StatusCodes.NOT_FOUND).send();
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro interno do servidor' });
  }
};
