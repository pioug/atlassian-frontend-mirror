import { useState } from 'react';

import { rbdInvariant } from './rbd-invariant';

type ScheduledFunction = () => void;

type Scheduler = {
  /**
   * Queues the provided function to be called asynchronously.
   */
  schedule(scheduledFunction: ScheduledFunction): void;

  /**
   * Calls the queue of functions synchronously, and cancels the pending timeouts.
   */
  flush(): void;
};

function createScheduler(): Scheduler {
  type QueueItem = {
    /**
     * The `timeoutId` provided by `setTimeout`.
     *
     * This uses an opaque type, instead of just `number`, to avoid conflicts
     * with Node.js type definitions.
     */
    id: ReturnType<typeof setTimeout>;
    scheduledFunction: ScheduledFunction;
  };

  const queue: QueueItem[] = [];

  const schedule = (scheduledFunction: ScheduledFunction) => {
    const id = setTimeout(() => {
      // Takes the first item, removing it from the queue
      const item = queue.shift();
      rbdInvariant(item, 'There was an item in the queue');
      rbdInvariant(
        item.id === id && item.scheduledFunction === scheduledFunction,
        'The item is the expected item',
      );

      // Call the function and remove it from the queue
      scheduledFunction();
    }, 0);

    queue.push({ id, scheduledFunction });
  };

  const flush = () => {
    while (queue.length > 0) {
      const item = queue.shift();
      rbdInvariant(item, 'There was an item in the queue');

      clearTimeout(item.id);
      item.scheduledFunction();
    }
  };

  return { schedule, flush };
}

/**
 * Used to schedule callbacks inside of a `setTimeout(fn, 0)`.
 *
 * This is used to match the behavior and timings of `react-beautiful-dnd`.
 */
export function useScheduler(): Scheduler {
  const [scheduler] = useState(createScheduler);
  return scheduler;
}
