import { LifecycleEvent, SmartLinkEventsNext } from '../../types';

/**
 * Simple mechanism to defer analytics related callbacks
 */
export const createAnalyticsQueue = (enabled: boolean = true) => {
  const queue: LifecycleEvent[] = [];
  const callbacksRef: { current: SmartLinkEventsNext | null } = {
    current: null,
  };

  const setCallbacks = (callbacks: SmartLinkEventsNext) => {
    callbacksRef.current = callbacks;
  };

  const push = (...events: LifecycleEvent[]) => {
    const callbacks = callbacksRef.current;
    if (!enabled || !callbacks) {
      return;
    }

    queue.push(...events);
  };

  const flush = () => {
    const callbacks = callbacksRef.current;
    if (!enabled || !callbacks) {
      return;
    }

    while (queue.length) {
      const event = queue.pop();

      if (event) {
        callbacks[event.type](event.data);
      }
    }
  };

  const getSize = () => queue.length;

  return {
    push,
    flush,
    setCallbacks,
    getSize,
  };
};
