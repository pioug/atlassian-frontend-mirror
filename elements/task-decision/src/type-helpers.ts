import {
  BaseItem,
  Decision,
  Item,
  ObjectKey,
  ServiceDecision,
  ServiceTask,
  Task,
  TaskState,
} from './types';

export const isDecision = (item: Item): item is Decision =>
  !!(item && item.type === 'DECISION');
export const isTask = (item: Item): item is Task =>
  !!(item && item.type === 'TASK');

export const toObjectKey = (
  item: Item | ServiceDecision | ServiceTask | BaseItem<any>,
): ObjectKey => {
  const { localId, objectAri } = item;
  return {
    localId,
    objectAri,
  };
};

export const objectKeyToString = (objectKey: ObjectKey) => {
  const { objectAri, localId } = objectKey;
  return `${objectAri}:${localId}`;
};

export const toggleTaskState = (state: TaskState): TaskState =>
  state === 'DONE' ? 'TODO' : 'DONE';
