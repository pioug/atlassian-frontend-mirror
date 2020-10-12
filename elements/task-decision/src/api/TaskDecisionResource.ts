import uuid from 'uuid';
import { RequestServiceOptions, utils } from '@atlaskit/util-service-support';

import {
  convertServiceTaskToTask,
  convertServiceTaskStateToBaseItem,
  findIndex,
} from './TaskDecisionUtils';

import {
  BaseItem,
  ServiceTaskState,
  DecisionState,
  Handler,
  ObjectKey,
  PubSubSpecialEventType,
  PubSubClient,
  RecentUpdateContext,
  RecentUpdatesId,
  RecentUpdatesListener,
  ServiceTask,
  TaskDecisionProvider,
  TaskDecisionResourceConfig,
  TaskState,
  ServiceItem,
} from '../types';

import {
  objectKeyToString,
  toggleTaskState,
  toObjectKey,
} from '../type-helpers';

interface RecentUpdateByIdValue {
  listener: RecentUpdatesListener;
  objectAri: string;
}

export const ACTION_CREATED_FPS_EVENT =
  'avi:task-decision-service:created:action';
export const ACTION_EDITED_FPS_EVENT =
  'avi:task-decision-service:edited:action';
export const ACTION_DELETED_FPS_EVENT =
  'avi:task-decision-service:deleted:action';
export const ACTION_ARCHIVED_FPS_EVENT =
  'avi:task-decision-service:archived:action';
export const ACTION_STATE_CHANGED_FPS_EVENT =
  'avi:task-decision-service:stateChanged:action';

export const DECISION_CREATED_FPS_EVENT =
  'avi:task-decision-service:created:decision';
export const DECISION_EDITED_FPS_EVENT =
  'avi:task-decision-service:edited:decision';
export const DECISION_DELETED_FPS_EVENT =
  'avi:task-decision-service:deleted:decision';
export const DECISION_ARCHIVED_FPS_EVENT =
  'avi:task-decision-service:archived:decision';
export const DECISION_STATE_CHANGED_FPS_EVENT =
  'avi:task-decision-service:stateChanged:decision';

export const ACTION_DECISION_FPS_EVENTS = 'avi:task-decision-service:*:*';

export class RecentUpdates {
  private idsByContainer: Map<string, string[]> = new Map();
  private listenersById: Map<string, RecentUpdateByIdValue> = new Map();

  private pubSubClient?: PubSubClient;

  constructor(pubSubClient?: PubSubClient) {
    this.pubSubClient = pubSubClient;
    this.subscribeToPubSubEvents();
  }

  subscribe(objectAri: string, recentUpdatesListener: RecentUpdatesListener) {
    const id = uuid();
    let containerIds = this.idsByContainer.get(objectAri);
    if (!containerIds) {
      containerIds = [];
      this.idsByContainer.set(objectAri, containerIds);
    }
    containerIds.push(id);
    this.listenersById.set(id, {
      listener: recentUpdatesListener,
      objectAri,
    });
    // Notify of id
    recentUpdatesListener.id(id);
  }

  unsubscribe(unsubscribeId: RecentUpdatesId) {
    const listenerDetail = this.listenersById.get(unsubscribeId);
    if (listenerDetail) {
      this.listenersById.delete(unsubscribeId);
      const { objectAri } = listenerDetail;
      const idsToFilter = this.idsByContainer.get(objectAri);
      if (idsToFilter) {
        this.idsByContainer.set(
          objectAri,
          idsToFilter.filter(id => id !== unsubscribeId),
        );
      }
    }
  }

  notify(recentUpdateContext: RecentUpdateContext) {
    const { objectAri } = recentUpdateContext;
    const subscriberIds = this.idsByContainer.get(objectAri);
    if (subscriberIds) {
      subscriberIds.forEach(subscriberId => {
        const listenerDetail = this.listenersById.get(subscriberId);
        if (listenerDetail) {
          const { listener } = listenerDetail;
          listener.recentUpdates(recentUpdateContext);
        }
      });
    }
  }

  onPubSubEvent = (_event: string, payload: ServiceItem) => {
    const { objectAri } = payload;
    this.notify({ objectAri });
  };

  destroy() {
    this.unsubscribeFromPubSubEvents();
  }

  private subscribeToPubSubEvents() {
    if (this.pubSubClient) {
      this.pubSubClient.on(ACTION_DECISION_FPS_EVENTS, this.onPubSubEvent);
    }
  }

  private unsubscribeFromPubSubEvents() {
    if (this.pubSubClient) {
      this.pubSubClient.off(ACTION_DECISION_FPS_EVENTS, this.onPubSubEvent);
    }
  }
}

export class ItemStateManager {
  private debouncedTaskStateQuery: number | null = null;
  private debouncedTaskToggle: Map<string, number> = new Map();
  private serviceConfig: TaskDecisionResourceConfig;
  private subscribers: Map<string, Handler[]> = new Map();
  private trackedObjectKeys: Map<string, ObjectKey> = new Map();
  private cachedItems: Map<
    string,
    BaseItem<TaskState | DecisionState>
  > = new Map();
  private batchedKeys: Map<string, ObjectKey> = new Map();

  constructor(serviceConfig: TaskDecisionResourceConfig) {
    this.serviceConfig = serviceConfig;
    this.subscribeToPubSubEvents();
  }

  destroy() {
    if (this.debouncedTaskStateQuery) {
      clearTimeout(this.debouncedTaskStateQuery);
    }

    this.debouncedTaskToggle.forEach(timeout => {
      clearTimeout(timeout);
    });

    this.unsubscribeFromPubSubEvents();
  }

  toggleTask(objectKey: ObjectKey, state: TaskState): Promise<TaskState> {
    const stringKey = objectKeyToString(objectKey);
    const timeout = this.debouncedTaskToggle.get(stringKey);
    if (timeout) {
      clearTimeout(timeout);
      this.debouncedTaskToggle.delete(stringKey);
    }

    // Update cache optimistically
    this.updateCache({
      ...objectKey,
      lastUpdateDate: new Date(),
      type: 'TASK',
      state: state,
    });

    // Optimistically notify subscribers that the task have been updated so that they can re-render accordingly
    this.notifyUpdated(objectKey, state);

    return new Promise<TaskState>((resolve, reject) => {
      this.debouncedTaskToggle.set(
        stringKey,
        window.setTimeout(() => {
          const options: RequestServiceOptions = {
            path: 'tasks/state',
            requestInit: {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json; charset=UTF-8',
              },
              body: JSON.stringify({
                ...objectKey,
                state,
              }),
            },
          };

          utils
            .requestService<ServiceTask>(this.serviceConfig, options)
            .then(convertServiceTaskToTask)
            .then(task => {
              this.updateCache(task);
              resolve(state);
              // Notify subscribers that the task have been updated so that they can re-render accordingly
              this.notifyUpdated(objectKey, state);
            })
            .catch(() => {
              // Undo optimistic change
              const previousState = toggleTaskState(state);
              this.updateCache({
                ...objectKey,
                lastUpdateDate: new Date(),
                type: 'TASK',
                state: previousState,
              });
              this.notifyUpdated(objectKey, previousState);
              reject();
            });
        }, 500),
      );
    });
  }

  refreshAllTasks() {
    this.queueAllItems();
    this.scheduleGetTaskState();
  }

  subscribe(
    objectKey: ObjectKey,
    handler: Handler,
    item?: BaseItem<TaskState | DecisionState>,
  ) {
    const key = objectKeyToString(objectKey);
    const handlers = this.subscribers.get(key) || [];
    handlers.push(handler);
    this.subscribers.set(key, handlers);
    this.trackedObjectKeys.set(key, objectKey);

    const cached = this.getCached(objectKey);
    if (cached) {
      this.notifyUpdated(objectKey, cached.state);
      return;
    }

    if (this.serviceConfig.disableServiceHydration && item) {
      this.updateCache(item);
      return;
    }

    this.queueItem(objectKey);

    this.scheduleGetTaskState();
  }

  unsubscribe(objectKey: ObjectKey, handler: Handler) {
    const key = objectKeyToString(objectKey);
    const handlers = this.subscribers.get(key);
    if (!handlers) {
      return;
    }

    const index = findIndex(handlers, h => h === handler);

    if (index !== -1) {
      handlers.splice(index, 1);
    }

    if (handlers.length === 0) {
      this.subscribers.delete(key);
      this.trackedObjectKeys.delete(key);
    } else {
      this.subscribers.set(key, handlers);
    }
  }

  getTaskState(keys: ObjectKey[]) {
    const options: RequestServiceOptions = {
      path: 'tasks/state',
      requestInit: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          taskKeys: keys,
        }),
      },
    };

    return utils.requestService<ServiceTaskState[]>(
      this.serviceConfig,
      options,
    );
  }

  notifyUpdated(objectKey: ObjectKey, state: TaskState | DecisionState) {
    const key = objectKeyToString(objectKey);
    const handlers = this.subscribers.get(key);
    if (!handlers) {
      return;
    }

    handlers.forEach(handler => {
      handler(state);
    });
  }

  onTaskUpdatedEvent = (_event: string, payload: ServiceTask) => {
    const { objectAri, localId } = payload;
    const objectKey = { objectAri, localId };

    const cached = this.getCached(objectKey);
    if (!cached) {
      // ignore unknown task
      return;
    }

    const lastUpdateDate = new Date(payload.lastUpdateDate);
    if (lastUpdateDate > cached.lastUpdateDate) {
      this.updateCache(convertServiceTaskStateToBaseItem(payload));
      this.notifyUpdated(objectKey, payload.state);
      return;
    }
  };

  onReconnect = () => {
    this.refreshAllTasks();
  };

  private updateCache(item: BaseItem<TaskState | DecisionState>) {
    const stringKey = objectKeyToString(toObjectKey(item));
    this.cachedItems.set(stringKey, item);
  }

  private getCached(
    objectKey: ObjectKey,
  ): BaseItem<DecisionState | TaskState> | undefined {
    return this.cachedItems.get(objectKeyToString(objectKey));
  }

  private subscribeToPubSubEvents() {
    if (this.serviceConfig.pubSubClient) {
      this.serviceConfig.pubSubClient.on(
        ACTION_STATE_CHANGED_FPS_EVENT,
        this.onTaskUpdatedEvent,
      );
      this.serviceConfig.pubSubClient.on(
        PubSubSpecialEventType.RECONNECT,
        this.onReconnect,
      );
    }
  }

  private unsubscribeFromPubSubEvents() {
    if (this.serviceConfig.pubSubClient) {
      this.serviceConfig.pubSubClient.off(
        ACTION_STATE_CHANGED_FPS_EVENT,
        this.onTaskUpdatedEvent,
      );
      this.serviceConfig.pubSubClient.off(
        PubSubSpecialEventType.RECONNECT,
        this.onReconnect,
      );
    }
  }

  private queueAllItems() {
    this.batchedKeys = new Map(this.trackedObjectKeys);
  }

  private queueItem(objectKey: ObjectKey) {
    const key = objectKeyToString(objectKey);
    if (this.batchedKeys.get(key)) {
      return;
    }

    this.batchedKeys.set(key, objectKey);
  }

  private dequeueItem(objectKey: ObjectKey) {
    const key = objectKeyToString(objectKey);
    this.batchedKeys.delete(key);
  }

  private scheduleGetTaskState() {
    if (this.debouncedTaskStateQuery) {
      clearTimeout(this.debouncedTaskStateQuery);
    }

    this.debouncedTaskStateQuery = window.setTimeout(() => {
      this.getTaskState(Array.from(this.batchedKeys.values())).then(tasks => {
        tasks.forEach(task => {
          const { objectAri, localId } = task;
          const objectKey = { objectAri, localId };
          this.updateCache(convertServiceTaskStateToBaseItem(task));
          this.dequeueItem(objectKey);
          this.notifyUpdated(objectKey, task.state);
        });
      });
    }, 1);
  }
}

export default class TaskDecisionResource implements TaskDecisionProvider {
  private recentUpdates: RecentUpdates;
  private itemStateManager: ItemStateManager;

  constructor(serviceConfig: TaskDecisionResourceConfig) {
    this.recentUpdates = new RecentUpdates(serviceConfig.pubSubClient);
    this.itemStateManager = new ItemStateManager(serviceConfig);
  }

  unsubscribeRecentUpdates(id: RecentUpdatesId) {
    this.recentUpdates.unsubscribe(id);
  }

  notifyRecentUpdates(recentUpdateContext: RecentUpdateContext) {
    this.recentUpdates.notify(recentUpdateContext);
    this.itemStateManager.refreshAllTasks();
  }

  toggleTask(objectKey: ObjectKey, state: TaskState): Promise<TaskState> {
    return this.itemStateManager.toggleTask(objectKey, state);
  }

  subscribe(
    objectKey: ObjectKey,
    handler: Handler,
    item?: BaseItem<TaskState | DecisionState>,
  ) {
    this.itemStateManager.subscribe(objectKey, handler, item);
  }

  unsubscribe(objectKey: ObjectKey, handler: Handler) {
    this.itemStateManager.unsubscribe(objectKey, handler);
  }

  /**
   * Usually only needed for testing to ensure no outstanding requests
   * are sent to a server (typically mocked).
   */
  destroy() {
    this.recentUpdates.destroy();
    this.itemStateManager.destroy();
  }
}
