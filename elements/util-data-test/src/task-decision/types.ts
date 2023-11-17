// This file duplicates types in @atlaskit/task-decision
// NOTE: if this is changed in the original package, this also needs to be modified
export type DecisionState = 'DECIDED';
export type TaskState = 'TODO' | 'DONE';

export type DecisionType = 'DECISION';
export type TaskType = 'TASK';

export interface ObjectKey {
  localId: string;
  containerAri?: string;
  objectAri: string;
}

export interface BaseItem<S> extends ObjectKey {
  state: S;
  lastUpdateDate: Date;
  type: DecisionType | TaskType;
}

export type Handler = (state: TaskState | DecisionState) => void;

export type RecentUpdatesId = string;

export interface RecentUpdateContext {
  objectAri: string;
  localId?: string;
}

export interface TaskDecisionProvider {
  unsubscribeRecentUpdates(id: RecentUpdatesId): void;
  notifyRecentUpdates(updateContext: RecentUpdateContext): void;

  // Tasks
  toggleTask(objectKey: ObjectKey, state: TaskState): Promise<TaskState>;
  subscribe(
    objectKey: ObjectKey,
    handler: Handler,
    item?: BaseItem<TaskState | DecisionState>,
  ): void;
  unsubscribe(objectKey: ObjectKey, handler: Handler): void;
}
