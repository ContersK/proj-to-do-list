import { server } from '../../Server';
import { prisma } from '../../../lib/prisma';
import { validation } from '../../shared/middleware/validation';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export interface CreateTaskBody {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
}

export const CreateValidation = validation((getSchema) => ({
  body: getSchema<CreateTaskBody>(
    yup.object().shape({
      title: yup.string().required('Título é obrigatório').trim(),
      description: yup.string().optional().trim(),
      priority: yup
        .string()
        .optional()
        .oneOf(['low', 'medium', 'high'], 'Prioridade inválida')
        .default('medium'),
    }),
  ),
}));

export const Create = async (
  req: Request<{}, {}, CreateTaskBody>,
  res: Response,
) => {
  try {
    const { title, description, priority } = req.body;

    // Validação básica
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    // Validar priority se fornecido
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        error: 'Prioridade deve ser: low, medium ou high',
      });
    }

    // Criar a nova tarefa no banco de dados
    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || 'medium',
      },
    });

    // Retornar um json com o status 201 (Created) e a nova tarefa
    res.status(StatusCodes.CREATED).json(newTask);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro interno do servidor' });
  }
};
