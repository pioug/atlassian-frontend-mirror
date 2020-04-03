import {
  TaskDecisionProvider,
  RecentUpdatesId,
  RecentUpdateContext,
  ObjectKey,
  TaskState,
  Handler,
} from '@atlaskit/task-decision';

type ToggleTaskCallback = (key: ObjectKey, state: TaskState) => void;

export const objectKeyToString = (objectKey: ObjectKey) => {
  const { objectAri, localId } = objectKey;
  return `${objectAri}:${localId}`;
};
export class TaskDecisionProviderImpl implements TaskDecisionProvider {
  _handleToggleTask: ToggleTaskCallback | undefined;
  _handlers: Map<string, Handler>;

  constructor(toggleTask?: ToggleTaskCallback) {
    this._handleToggleTask = toggleTask;
    this._handlers = new Map();
  }

  unsubscribeRecentUpdates(_id: RecentUpdatesId) {}
  notifyRecentUpdates(_updateContext?: RecentUpdateContext) {}
  toggleTask(key: ObjectKey, state: TaskState): Promise<TaskState> {
    if (this._handleToggleTask) {
      this._handleToggleTask(key, state);
    }

    // Optimistically notify subscribers that the task have been updated so that they can re-render accordingly
    this.notifyUpdated(key, state);
    return Promise.resolve(state);
  }
  subscribe(key: ObjectKey, handler: Handler) {
    this._handlers.set(objectKeyToString(key), handler);
  }
  unsubscribe(key: ObjectKey) {
    this._handlers.delete(objectKeyToString(key));
  }

  notifyUpdated(objectKey: ObjectKey, state: TaskState) {
    if (!this._handlers.has(objectKeyToString(objectKey))) {
      return;
    }

    const handler = this._handlers.get(objectKeyToString(objectKey))!;
    handler(state);
  }
}

export const createTaskDecisionProvider = async (
  handleToggleTask?: ToggleTaskCallback,
) => new TaskDecisionProviderImpl(handleToggleTask);
