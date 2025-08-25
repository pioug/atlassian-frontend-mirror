// This file duplicates types in @atlaskit/task-decision
// NOTE: if this is changed in the original package, this also needs to be modified
export type DecisionState = 'DECIDED';
export type TaskState = 'TODO' | 'DONE';

export type DecisionType = 'DECISION';
export type TaskType = 'TASK';

export interface ObjectKey {
	containerAri?: string;
	localId: string;
	objectAri: string;
}

export interface BaseItem<S> extends ObjectKey {
	lastUpdateDate: Date;
	state: S;
	type: DecisionType | TaskType;
}

export type Handler = (state: TaskState | DecisionState) => void;

export type RecentUpdatesId = string;

export interface RecentUpdateContext {
	localId?: string;
	objectAri: string;
}

export interface TaskDecisionProvider {
	notifyRecentUpdates(updateContext: RecentUpdateContext): void;
	subscribe(
		objectKey: ObjectKey,
		handler: Handler,
		item?: BaseItem<TaskState | DecisionState>,
	): void;

	// Tasks
	toggleTask(objectKey: ObjectKey, state: TaskState): Promise<TaskState>;
	unsubscribe(objectKey: ObjectKey, handler: Handler): void;
	unsubscribeRecentUpdates(id: RecentUpdatesId): void;
}
