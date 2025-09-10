import * as Create from './Create';
import * as GetAll from './GetAll';
import * as GetById from './GetById';
import * as UpdateById from './UpdateById';
import * as DeleteById from './DeleteById';

export const TasksController = {
  ...Create,
  ...GetAll,
  ...GetById,
  ...UpdateById,
  ...DeleteById,
};
