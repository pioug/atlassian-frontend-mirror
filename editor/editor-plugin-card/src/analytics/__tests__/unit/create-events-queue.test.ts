import { createEventsQueue } from '../../index';

describe('createEventsQueue', () => {
  it('should push events and flush should dispatch them to any subscribers', () => {
    const queue = createEventsQueue<unknown>();

    expect(queue.getSize()).toBe(0);

    const createdEvent = {
      type: 'created',
      data: {
        url: 'https://atlassian.com',
        display: 'inline',
      },
    };

    const updatedEvent = {
      type: 'updated',
      data: {
        url: 'https://google.com',
        display: 'block',
      },
    };

    const deletedEvent = {
      type: 'deleted',
      data: {
        url: 'https://youtube.com',
        display: 'url',
      },
    };

    const spy = jest.fn();
    const unsub = queue.subscribe(spy);

    queue.push(createdEvent, updatedEvent, deletedEvent);

    // Subscribers are not notified until queue is flushed
    expect(spy).not.toHaveBeenCalled();
    expect(queue.getSize()).toBe(3);

    queue.flush();

    // Subscriber is notified
    expect(spy).toHaveBeenNthCalledWith(1, createdEvent);
    expect(spy).toHaveBeenNthCalledWith(2, updatedEvent);
    expect(spy).toHaveBeenNthCalledWith(3, deletedEvent);
    // Queue now empty
    expect(queue.getSize()).toBe(0);

    jest.clearAllMocks();
    // Unsubscribe the spy after resetting it
    unsub();

    // Queue more events... but there will be no subscribers
    queue.push(createdEvent, updatedEvent, deletedEvent);
    expect(spy).not.toHaveBeenCalled();
    expect(queue.getSize()).toBe(3);

    queue.flush();
    expect(spy).not.toHaveBeenCalled();
  });
});
