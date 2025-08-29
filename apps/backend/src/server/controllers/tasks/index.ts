import { Create, CreateValidation } from './Create';
import { GetAll, GetAllValidation } from './GetAll';
import { GetById, GetByIdValidation } from './GetById';
import { UpdateById, UpdateByIdValidation } from './UpdateById';
import { DeleteById, DeleteByIdValidation } from './DeleteById';

export const TasksController = {
  ...Create,
  ...GetAll,
  ...GetById,
  ...UpdateById,
  ...DeleteById,
  ...CreateValidation,
  ...GetAllValidation,
  ...GetByIdValidation,
  ...UpdateByIdValidation,
  ...DeleteByIdValidation,
};
