import fetchMock from 'fetch-mock/cjs/client';
import {
  ItemStateManager,
  ACTION_STATE_CHANGED_FPS_EVENT,
} from '../../../api/TaskDecisionResource';
import {
  ObjectKey,
  ServiceTask,
  TaskState,
  PubSubSpecialEventType,
  PubSubClient,
  BaseItem,
} from '../../../types';

jest.useFakeTimers();

const serviceTask = (
  key: ObjectKey,
  state?: TaskState,
  creationDate?: Date,
): ServiceTask => ({
  ...key,
  creationDate: creationDate
    ? creationDate.toISOString()
    : new Date().toISOString(),
  lastUpdateDate: creationDate
    ? creationDate.toISOString()
    : new Date().toISOString(),
  parentLocalId: '123',
  participants: [],
  position: 1,
  state: state || 'TODO',
  type: 'TASK',
});

describe('ItemStateManager', () => {
  const objectKey = {
    localId: 'task-1',
    objectAri: 'objectAri',
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    fetchMock.restore();
  });

  describe('PubSubClient', () => {
    let mockPubSubClient: PubSubClient;

    beforeEach(() => {
      mockPubSubClient = {
        on: jest.fn(),
        off: jest.fn(),
        join: jest.fn(),
        leave: jest.fn(),
      };
    });

    it('should subscribe to PubSub event if PubSubClient provided', () => {
      // eslint-disable-next-line no-unused-expressions
      new ItemStateManager({ url: '', pubSubClient: mockPubSubClient });
      expect(mockPubSubClient.on).toHaveBeenCalledWith(
        ACTION_STATE_CHANGED_FPS_EVENT,
        expect.any(Function),
      );
    });

    it('should not subscribe to any PubSub event if PubSubClient not provided', () => {
      // eslint-disable-next-line no-unused-expressions
      new ItemStateManager({ url: '' });
      expect(mockPubSubClient.on).not.toHaveBeenCalled();
    });

    it('should subscribe to PubSub Reconnect event if PubSubClient provided', () => {
      // eslint-disable-next-line no-unused-expressions
      new ItemStateManager({ url: '', pubSubClient: mockPubSubClient });
      expect(mockPubSubClient.on).toHaveBeenCalledWith(
        PubSubSpecialEventType.RECONNECT,
        expect.any(Function),
      );
    });

    describe('#destroy', () => {
      it('should unsubscribe to PubSub event if PubSubClient provided', () => {
        const itemStateManager = new ItemStateManager({
          url: '',
          pubSubClient: mockPubSubClient,
        });
        itemStateManager.destroy();
        expect(mockPubSubClient.off).toHaveBeenCalledWith(
          ACTION_STATE_CHANGED_FPS_EVENT,
          expect.any(Function),
        );
      });

      it('should unsubscribe to PubSub Reconnect event if PubSubClient provided', () => {
        const itemStateManager = new ItemStateManager({
          url: '',
          pubSubClient: mockPubSubClient,
        });
        itemStateManager.destroy();
        expect(mockPubSubClient.off).toHaveBeenCalledWith(
          PubSubSpecialEventType.RECONNECT,
          expect.any(Function),
        );
      });
    });

    describe('#onTaskUpdatedEvent', () => {
      it('should notify handlers of update if cached and event is more recent than cached version', (done) => {
        const mockHandler = jest.fn();

        const creationDate = new Date();
        fetchMock
          .mock({
            matcher: 'end:tasks',
            method: 'PUT',
            name: 'set-task',
            response: serviceTask(objectKey, 'DONE'),
          })
          .mock({
            matcher: 'end:tasks/state',
            name: 'get-state',
            response: [serviceTask(objectKey)],
          });

        const itemStateManager = new ItemStateManager({
          url: '',
          pubSubClient: mockPubSubClient,
        });

        const updateDate = new Date();
        updateDate.setFullYear(creationDate.getFullYear() + 1);
        itemStateManager.toggleTask(objectKey, 'TODO').then(() => {
          itemStateManager.subscribe(objectKey, mockHandler);
          mockHandler.mockClear();

          itemStateManager.onTaskUpdatedEvent(
            'event',
            serviceTask(objectKey, 'DONE', updateDate),
          );

          expect(mockHandler).toHaveBeenCalled();
          done();
        });

        jest.runAllTimers();
      });

      it('should update cached value if cached and event is more recent than cached version', (done) => {
        const mockHandler = jest.fn();

        const creationDate = new Date();
        fetchMock
          .mock({
            matcher: 'end:tasks',
            method: 'PUT',
            name: 'set-task',
            response: serviceTask(objectKey, 'TODO'),
          })
          .mock({
            matcher: 'end:tasks/state',
            name: 'get-state',
            response: [serviceTask(objectKey)],
          });

        const itemStateManager = new ItemStateManager({
          url: '',
          pubSubClient: mockPubSubClient,
        });

        const updateDate = new Date();
        updateDate.setFullYear(creationDate.getFullYear() + 1);
        itemStateManager.toggleTask(objectKey, 'TODO').then(() => {
          itemStateManager.onTaskUpdatedEvent(
            'event',
            serviceTask(objectKey, 'DONE', updateDate),
          );

          mockHandler.mockClear();
          itemStateManager.subscribe(objectKey, mockHandler);

          expect(mockHandler).toHaveBeenCalledWith('DONE');
          done();
        });

        jest.runAllTimers();
      });

      it('should not notify handlers of update if cached but event is older than cached version', (done) => {
        const mockHandler = jest.fn();

        const creationDate = new Date();
        fetchMock
          .mock({
            matcher: 'end:tasks',
            method: 'PUT',
            name: 'set-task',
            response: serviceTask(objectKey, 'DONE'),
          })
          .mock({
            matcher: 'end:tasks/state',
            name: 'get-state',
            response: [serviceTask(objectKey)],
          });

        const itemStateManager = new ItemStateManager({
          url: '',
          pubSubClient: mockPubSubClient,
        });

        const updateDate = new Date();
        updateDate.setFullYear(creationDate.getFullYear() - 1);
        itemStateManager.toggleTask(objectKey, 'TODO').then(() => {
          itemStateManager.subscribe(objectKey, mockHandler);
          mockHandler.mockClear();
          itemStateManager.onTaskUpdatedEvent(
            'event',
            serviceTask(objectKey, 'DONE', updateDate),
          );

          expect(mockHandler).not.toHaveBeenCalled();
          done();
        });

        jest.runAllTimers();
      });

      it('should not notify handlers of update if not cached', () => {
        const mockHandler = jest.fn();

        const creationDate = new Date();
        fetchMock
          .mock({
            matcher: 'end:tasks',
            method: 'PUT',
            name: 'set-task',
            response: serviceTask(objectKey, 'DONE'),
          })
          .mock({
            matcher: 'end:tasks/state',
            name: 'get-state',
            response: [serviceTask(objectKey)],
          });

        const itemStateManager = new ItemStateManager({
          url: '',
          pubSubClient: mockPubSubClient,
        });

        const updateDate = new Date();
        updateDate.setFullYear(creationDate.getFullYear() - 1);
        itemStateManager.subscribe(objectKey, mockHandler);
        mockHandler.mockClear();
        itemStateManager.onTaskUpdatedEvent(
          'event',
          serviceTask(objectKey, 'DONE', updateDate),
        );

        expect(mockHandler).not.toHaveBeenCalled();
      });
    });

    describe('#onReconnect', () => {
      it('should refresh all cached tasks state', () => {
        fetchMock
          .mock({
            matcher: 'end:tasks',
            method: 'PUT',
            name: 'set-task',
            response: serviceTask(objectKey, 'TODO'),
          })
          .mock({
            matcher: 'end:tasks/state',
            name: 'get-state',
            response: [serviceTask(objectKey, 'DONE')],
          });

        const itemStateManager = new ItemStateManager({
          url: '',
          pubSubClient: mockPubSubClient,
        });

        itemStateManager.toggleTask(objectKey, 'TODO');

        jest.runAllTimers();
        expect(true).toBe(true);
        return Promise.resolve(() => {
          expect(fetchMock.calls('get-state').length).toBe(1);

          itemStateManager.onReconnect();
          jest.runAllTimers();

          expect(fetchMock.calls('get-state').length).toBe(2);
        });
      });
    });
  });

  describe('config', () => {
    describe('#disableServiceHydration', () => {
      const task: BaseItem<TaskState> = {
        ...objectKey,
        state: 'DONE',
        type: 'TASK',
        lastUpdateDate: new Date(),
      };

      beforeEach(() => {
        fetchMock.mock({
          matcher: '/tasks/state',
          method: 'POST',
          name: 'get-task-state',
          response: [serviceTask(objectKey, 'TODO')],
        });
      });

      it('disableServiceHydration is true, subscribe caches initial state', () => {
        const itemStateManager = new ItemStateManager({
          url: '',
          disableServiceHydration: true,
        });

        itemStateManager.subscribe(objectKey, () => {}, task);

        const cachedTask = (itemStateManager as any).getCached(objectKey);
        expect(cachedTask).toEqual(task);
        const batchedKeys = (itemStateManager as any).batchedKeys as Map<
          string,
          ObjectKey
        >;

        // No items queued for hydration
        expect(batchedKeys.size).toEqual(0);

        jest.runAllTimers();

        return fetchMock.flush(true).then(() => {
          expect(fetchMock.calls('get-task-state').length).toEqual(0);

          // Expect cache unchanged
          const cachedTaskAfterHydration = (itemStateManager as any).getCached(
            objectKey,
          );
          expect(cachedTaskAfterHydration).toMatchObject(task);
        });
      });

      it('disableServiceHydration is falsy, subscribe hydrates initial state', () => {
        const itemStateManager = new ItemStateManager({
          url: '',
        });

        itemStateManager.subscribe(objectKey, () => {}, task);

        const cachedTask = (itemStateManager as any).getCached(objectKey);
        expect(cachedTask).toBeUndefined();

        // Item queued for hydration
        const batchedKeys = (itemStateManager as any).batchedKeys as Map<
          string,
          ObjectKey
        >;
        expect(batchedKeys.size).toEqual(1);

        jest.runAllTimers();

        return fetchMock.flush(true).then(() => {
          expect(fetchMock.calls('get-task-state').length).toEqual(1);

          const cachedTaskAfterHydration = (itemStateManager as any).getCached(
            objectKey,
          );
          expect(cachedTaskAfterHydration).toMatchObject({
            ...task,
            state: 'TODO',
            lastUpdateDate: cachedTaskAfterHydration.lastUpdateDate,
          });

          // Item not longer queued for hydration
          const batchedKeysAfterHydration = (itemStateManager as any)
            .batchedKeys as Map<string, ObjectKey>;
          expect(batchedKeysAfterHydration.size).toEqual(0);
        });
      });
    });
  });
});
