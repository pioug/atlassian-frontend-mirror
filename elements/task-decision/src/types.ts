import { type ServiceConfig } from '@atlaskit/util-service-support';

export type DecisionState = 'DECIDED';
export type DecisionStatus = 'CREATED';
export type TaskState = 'TODO' | 'DONE';
export type Cursor = string;

export type DecisionType = 'DECISION';
export type TaskType = 'TASK';

export interface ContentRef {
	(ref: HTMLElement | null): void;
}

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

export interface ServiceDecision {
	creationDate?: string;
	creatorId?: UserId;
	lastUpdateDate: string;
	lastUpdaterId?: UserId;
	localId: string;
	objectAri: string;
	participants?: UserId[];
	state?: DecisionState;
	status: DecisionStatus;
	type: DecisionType;
}

export interface Meta {
	cursor?: string;
}

export interface ServiceDecisionResponse {
	decisions: ServiceDecision[];
	meta: Meta;
}

export type ServiceItem = ServiceDecision | ServiceTask;

export interface ServiceTaskState {
	lastUpdateDate: string;
	localId: string;
	objectAri: string;
	state: TaskState;
}

export interface Decision extends BaseItem<DecisionState> {
	creationDate?: Date;
	creator?: UserId;
	lastUpdateDate: Date;
	lastUpdater?: UserId;
	participants?: UserId[];
	status: DecisionStatus;
	type: DecisionType;
}

export type Item = Decision | Task;

export type UserId = string;

export interface ServiceTask {
	creationDate?: string;
	creatorId?: UserId;
	lastUpdateDate: string;
	lastUpdaterId?: UserId;
	localId: string;
	objectAri: string;
	parentLocalId?: string;
	participants?: UserId[];
	position: number;
	state: TaskState;
	type: TaskType;
}

export interface Task extends BaseItem<TaskState> {
	creationDate?: Date;
	creator?: UserId;
	lastUpdateDate: Date;
	lastUpdater?: UserId;
	parentLocalId?: string;
	participants?: UserId[];
	position?: number;
	type: TaskType;
}

export type Handler = (state: TaskState | DecisionState) => void;

export type RecentUpdatesId = string;

export interface RecentUpdateContext {
	localId?: string;
	objectAri: string;
}

/**
 * A subscriber interface that can be called back if there are new decisions/tasks/items
 * available as the result of an external change.
 */
export interface RecentUpdatesListener {
	/**
	 * An id that can be used to unsubscribe
	 */
	id(id: RecentUpdatesId): void;

	/**
	 * Indicates there are recent updates, and the listener should refresh
	 * the latest items from the TaskDecisionProvider.
	 *
	 * There will be a number of retries until expectedLocalId, if passed.
	 *
	 * @param updateContext Recent update context
	 */
	recentUpdates(updateContext: RecentUpdateContext): void;
}

export interface TaskDecisionResourceConfig extends ServiceConfig {
	/**
	 * Indicates if initial state for an action or decision is should be cached,
	 * from the content, i.e. was originally hydrated from the service initially,
	 * and so should be considered up to date.
	 *
	 * Will stop the initiation of the hydration from the service the first
	 * time an action or decision is seen.
	 *
	 * If false the state will always be hydrated from the service on first view.
	 */
	disableServiceHydration?: boolean;

	pubSubClient?: PubSubClient;
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

/**
 * Same as RendererContext in editor-core (don't want an direct dep though)
 */
export interface RendererContext {
	containerAri?: string;
	objectAri: string;
}

export interface RenderDocument {
	(document: any, rendererContext?: RendererContext): JSX.Element;
}

export interface OnUpdate<T> {
	(allDecisions: T[], newDecisions: T[]): void;
}

export type Appearance = 'inline';

/**
 * Same as PubSub client types (don't want a direct dep though)
 */

export type ARI = string;
export type AVI = string;

export interface PubSubOnEvent<T = any> {
	(event: string, data: T): void;
}

export interface PubSubClient {
	join(aris: ARI[]): Promise<PubSubClient>;

	leave(aris: ARI[]): Promise<PubSubClient>;

	off(eventAvi: string, listener: PubSubOnEvent): PubSubClient;

	on(eventAvi: string, listener: PubSubOnEvent): PubSubClient;
}

export enum PubSubSpecialEventType {
	ERROR = 'ERROR',
	CONNECTED = 'CONNECTED',
	RECONNECT = 'RECONNECT',
}
