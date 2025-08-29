import { Router } from 'express';
import { GetById, GetByIdValidation } from '../controllers/tasks/GetById';
import { GetAll, GetAllValidation } from '../controllers/tasks/GetAll';
import { Create, CreateValidation } from '../controllers/tasks/Create';
import {
  UpdateById,
  UpdateByIdValidation,
} from '../controllers/tasks/UpdateById';
import {
  DeleteById,
  DeleteByIdValidation,
} from '../controllers/tasks/DeleteById';

const router = Router();

router.get('/api/health', (req, res) => {
  res.json({
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString(),
  });
});

router.get('/tasks', (req, res) => {
  GetAllValidation(req, res, () => GetAll(req, res));
});

router.get('/tasks/:id', (req, res) => {
  GetByIdValidation(req, res, () => GetById(req, res));
});
router.post('/tasks', (req, res) => {
  CreateValidation(req, res, () => Create(req, res));
});

router.put('/tasks/:id', (req, res) => {
  UpdateByIdValidation(req, res, () => UpdateById(req, res));
});
router.delete('/tasks/:id', (req, res) => {
  DeleteByIdValidation(req, res, () => DeleteById(req, res));
});

export { router };
