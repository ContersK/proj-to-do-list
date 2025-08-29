import { server } from '../../Server';
import { prisma } from '../../../lib/prisma';
import { validation } from '../../shared/middleware/validation';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

interface UpdateTaskBody {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export const UpdateByIdValidation = validation((getSchema) => ({
  body: getSchema<UpdateTaskBody>(
    yup.object({
      title: yup.string().optional().trim(),
      description: yup.string().optional().trim(),
      completed: yup.boolean().optional(),
      priority: yup
        .mixed<'low' | 'medium' | 'high'>()
        .optional()
        .oneOf(['low', 'medium', 'high'], 'Prioridade inválida'),
    }) as yup.ObjectSchema<UpdateTaskBody>,
  ),
}));

export const UpdateById = async (
  req: Request<{ id: string }, {}, UpdateTaskBody>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;

    // Verificar se tarefa existe
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Validação de título se fornecido
    if (title !== undefined && (!title || title.trim() === '')) {
      return res.status(400).json({ error: 'Título não pode ser vazio' });
    }

    // Validar priority se fornecido
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        error: 'Prioridade deve ser: low, medium ou high',
      });
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || null;
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
