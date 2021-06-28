import URLSearchParams from 'url-search-params';
import fetchMock from 'fetch-mock/cjs/client';
import { waitUntil } from '@atlaskit/elements-test-helpers';

import TaskDecisionResource, {
  ItemStateManager,
} from '../../../api/TaskDecisionResource';

import { ObjectKey, ServiceTask, TaskState } from '../../../types';

import { objectKeyToString } from '../../../type-helpers';

// patch URLSearchParams API for jsdom tests
declare var global: any;
global.URLSearchParams = URLSearchParams;

const url = 'https://cheese/';

const getItemStateManager = (
  resource: TaskDecisionResource,
): ItemStateManager => (resource as any).itemStateManager;

describe('TaskDecisionResource', () => {
  describe('getTaskState', () => {
    afterEach(() => {
      fetchMock.restore();
    });

    const resource = new TaskDecisionResource({ url });
    const tasks = [
      {
        objectAri: 'objectAri',
        localId: 'task-1',
        state: 'DONE',
      },
      {
        objectAri: 'objectAri',
        localId: 'task-2',
        state: 'DONE',
      },
      {
        objectAri: 'objectAri',
        localId: 'task-3',
        state: 'TODO',
      },
    ];

    it('should return list of task states', () => {
      fetchMock.mock({
        matcher: `end:tasks/state`,
        name: 'task',
        response: tasks,
      });

      return ((resource as any).itemStateManager as ItemStateManager)
        .getTaskState(tasks)
        .then((response) => {
          expect(response).toEqual(tasks);
        });
    });
  });

  describe('subscriptions', () => {
    const resource = new TaskDecisionResource({ url });
    const mockHandler = jest.fn();
    const mockHandler2 = jest.fn();
    const objectKey = {
      localId: 'task-1',
      objectAri: 'objectAri',
    };

    describe('subscribe', () => {
      it('should add handlers to subscriptions-map', () => {
        resource.subscribe(objectKey, mockHandler);
        resource.subscribe(objectKey, mockHandler2);
        expect(
          (getItemStateManager(resource) as any).subscribers.get(
            objectKeyToString(objectKey),
          ),
        ).toEqual([mockHandler, mockHandler2]);
      });
    });

    describe('notifyUpdated', () => {
      it('should call all subscribers', () => {
        getItemStateManager(resource).notifyUpdated(objectKey, 'DONE');
        expect(mockHandler).toBeCalledWith('DONE');
        expect(mockHandler2).toBeCalledWith('DONE');
      });
    });

    describe('unsubscribe', () => {
      it('should remove handler from subscriptions-map', () => {
        resource.unsubscribe(objectKey, mockHandler);
        expect(
          (getItemStateManager(resource) as any).subscribers.get(
            objectKeyToString(objectKey),
          ),
        ).toEqual([mockHandler2]);
      });

      it('should delete the key from subscriptions-map if empty', () => {
        resource.unsubscribe(objectKey, mockHandler2);
        expect(
          (getItemStateManager(resource) as any).subscribers.get(
            objectKeyToString(objectKey),
          ),
        ).toEqual(undefined);
      });
    });
  });

  describe('toggleTask', () => {
    const key1 = {
      localId: '1',
      objectAri: 'o1',
    };
    const key2 = {
      localId: '2',
      objectAri: 'o2',
    };

    const serviceTask = (key: ObjectKey, state?: TaskState): ServiceTask => ({
      ...key,
      creationDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
      parentLocalId: '123',
      participants: [],
      position: 1,
      state: state || 'TODO',
      type: 'TASK',
    });

    let resource: TaskDecisionResource;
    beforeEach(() => {
      resource = new TaskDecisionResource({ url });
    });

    afterEach(() => {
      fetchMock.restore();
      resource.destroy();
    });

    it('optimistic update', () => {
      fetchMock
        .mock({
          matcher: 'end:tasks/state',
          method: 'PUT',
          name: 'set-task',
          response: serviceTask(key1, 'DONE'),
        })
        .mock({
          matcher: 'end:tasks/state',
          response: [serviceTask(key1)],
        });

      let latestState: string;
      const handler = (state: string) => {
        latestState = state;
      };
      resource.subscribe(key1, handler);
      return waitUntil(() => latestState === 'TODO')
        .then(() => {
          resource.toggleTask(key1, 'DONE');
          return waitUntil(() => latestState === 'DONE');
        })
        .then(() => {
          expect(latestState).toBe('DONE');
          return waitUntil(() => fetchMock.called('set-task'));
        })
        .then(() => {
          expect(latestState).toBe('DONE');
        });
    });

    it('optimistic update - with error', () => {
      fetchMock
        .mock({
          matcher: 'end:tasks',
          method: 'PUT',
          response: 400,
          name: 'set-task',
        })
        .mock({
          matcher: 'end:tasks/state',
          response: [serviceTask(key1, 'TODO')],
        });

      let latestState: string;
      const handler = (state: string) => {
        latestState = state;
      };
      resource.subscribe(key1, handler);
      let toggleStatePromise: Promise<TaskState>;
      return waitUntil(() => latestState === 'TODO')
        .then(() => {
          toggleStatePromise = resource.toggleTask(key1, 'DONE');
          return waitUntil(() => latestState === 'DONE');
        })
        .then(() => {
          expect(latestState).toBe('DONE');
          return toggleStatePromise.catch(() => {
            expect(latestState).toBe('TODO');
          });
        });
    });

    it('two at same time update', () => {
      fetchMock
        .mock({
          matcher: 'end:tasks/state',
          method: 'PUT',
          name: 'set-task',
          response: (_url: any, options: any) => {
            const body = JSON.parse(options.body);
            const { localId } = body;

            if (localId === '1') {
              return serviceTask(key1, 'DONE');
            }

            if (localId === '2') {
              return serviceTask(key2, 'TODO');
            }

            return 500;
          },
        })
        .mock({
          matcher: 'end:tasks/state',
          response: [serviceTask(key1), serviceTask(key2, 'DONE')],
        });

      let latestState1: string;
      let latestState2: string;
      const handler1 = (state: string) => {
        latestState1 = state;
      };
      const handler2 = (state: string) => {
        latestState2 = state;
      };
      resource.subscribe(key1, handler1);
      resource.subscribe(key2, handler2);
      return waitUntil(() => latestState1 === 'TODO' && latestState2 === 'DONE')
        .then(() => {
          resource.toggleTask(key1, 'DONE');
          resource.toggleTask(key2, 'TODO');
          return waitUntil(
            () => latestState1 === 'DONE' && latestState2 === 'TODO',
          );
        })
        .then(() => {
          expect(latestState1).toBe('DONE');
          expect(latestState2).toBe('TODO');
          // Wait for calls to service...
          return waitUntil(() => fetchMock.calls('set-task').length === 2);
        })
        .then(() => {
          expect(latestState1).toBe('DONE');
          expect(latestState2).toBe('TODO');
        });
    });
  });
});
