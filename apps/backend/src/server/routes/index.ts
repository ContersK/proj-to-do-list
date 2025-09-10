import { Router } from 'express';
import { TasksController } from '../controllers/tasks';

const router = Router();

router.get('/api/health', (req, res) => {
  res.json({
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString(),
  });
});

router.get('/tasks', TasksController.GetAllValidation, TasksController.GetAll);

router.get(
  '/tasks/:id',
  TasksController.GetByIdValidation,
  TasksController.GetById,
);
router.post('/tasks', TasksController.CreateValidation, TasksController.Create);

router.put(
  '/tasks/:id',
  TasksController.UpdateByIdValidation,
  TasksController.UpdateById,
);
router.delete(
  '/tasks/:id',
  TasksController.DeleteByIdValidation,
  TasksController.DeleteById,
);

export { router };
