import {
  ServiceTask,
  Task,
  ServiceTaskState,
  BaseItem,
  TaskState,
} from '../types';

export const convertServiceTaskToTask = (serviceTask: ServiceTask): Task => {
  const {
    creationDate,
    lastUpdateDate,
    creatorId,
    lastUpdaterId,
    ...other
  } = serviceTask;

  return {
    creationDate: (creationDate && new Date(creationDate)) || undefined,
    lastUpdateDate: new Date(lastUpdateDate),
    creator: creatorId,
    lastUpdater: lastUpdaterId,
    ...other,
  };
};

export const convertServiceTaskStateToBaseItem = (
  serviceTaskInfo: ServiceTaskState,
): BaseItem<TaskState> => {
  const { lastUpdateDate, ...other } = serviceTaskInfo;

  return {
    type: 'TASK',
    lastUpdateDate: new Date(lastUpdateDate),
    ...other,
  };
};

export const findIndex = (
  array: any[],
  predicate: (item: any) => boolean,
): number => {
  let index = -1;
  array.some((item, i) => {
    if (predicate(item)) {
      index = i;
      return true;
    }
    return false;
  });

  return index;
};
