import { createAnalyticsQueue } from '../../index';

describe('createAnalyticsQueue', () => {
  describe('push', () => {
    it('should not push events to the queue if there are no callbacks set', () => {
      const queue = createAnalyticsQueue();

      expect(queue.getSize()).toBe(0);

      queue.push({
        type: 'created',
        data: {
          url: 'https://atlassian.com',
          display: 'inline',
        },
      });

      queue.push({
        type: 'deleted',
        data: {
          url: 'https://atlassian.com',
          display: 'inline',
        },
      });

      expect(queue.getSize()).toBe(0);
    });

    it('should push events and flush should dispatch them if callbacks are set', () => {
      const queue = createAnalyticsQueue();

      expect(queue.getSize()).toBe(0);

      const callbacks = {
        created: jest.fn(),
        updated: jest.fn(),
        deleted: jest.fn(),
      };

      queue.setCallbacks(callbacks);

      type Event = Parameters<typeof queue.push>[0];

      const createdEvent: Event = {
        type: 'created',
        data: {
          url: 'https://atlassian.com',
          display: 'inline',
        },
      };

      const updatedEvent: Event = {
        type: 'updated',
        data: {
          url: 'https://google.com',
          display: 'block',
        },
      };

      const deletedEvent: Event = {
        type: 'deleted',
        data: {
          url: 'https://youtube.com',
          display: 'url',
        },
      };

      queue.push(createdEvent, updatedEvent, deletedEvent);

      expect(queue.getSize()).toBe(3);

      queue.flush();

      expect(callbacks.created).toHaveBeenCalledWith(createdEvent.data);
      expect(callbacks.updated).toHaveBeenCalledWith(updatedEvent.data);
      expect(callbacks.deleted).toHaveBeenCalledWith(deletedEvent.data);
      expect(queue.getSize()).toBe(0);
    });

    it('should should do nothing if `enabled` is set to false', () => {
      const queue = createAnalyticsQueue(false);

      expect(queue.getSize()).toBe(0);

      queue.push({
        type: 'created',
        data: {
          url: 'https://atlassian.com',
          display: 'inline',
        },
      });

      queue.push({
        type: 'deleted',
        data: {
          url: 'https://atlassian.com',
          display: 'inline',
        },
      });

      expect(queue.getSize()).toBe(0);
    });
  });
});
