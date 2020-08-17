interface QueueJob<T> {
  work: () => Promise<unknown>;
  resolve: (value?: T) => void;
  reject: (reason?: any) => void;
}

export interface QueueOptions {
  /**
   * Amount of time (ms) to wait after completing a queue item before starting the next one.
   * Set to 0 to disable delaying between jobs.
   * Default is 0.
   */
  delay?: number | (() => number);
  /**
   * Whether or not the first job is delayed.
   * Delay must be set for this option to work.
   * Default is false.
   */
  delayFirstJob?: boolean;
}

/**
 * An implementation of a queue which can optionally enforce a delay between jobs.
 */
export class Queue<T> {
  private static DEFAULT_OPTIONS: QueueOptions = {
    delay: 0,
    delayFirstJob: false,
  };

  private jobs: QueueJob<T>[] = [];
  private handlingPromise = false;

  constructor(private readonly options = Queue.DEFAULT_OPTIONS) {}

  // Add a new function to the queue.
  public enqueue(work: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
      this.jobs.push({
        work,
        resolve,
        reject,
      });

      if (
        this.jobs.length === 1 &&
        !this.handlingPromise &&
        this.options.delayFirstJob
      ) {
        this.delayDequeue();
      } else {
        this.dequeue();
      }
    });
  }

  private delayDequeue() {
    const { delay } = this.options;
    if (delay) {
      const ms = typeof delay === 'number' ? delay : delay();
      setTimeout(() => this.dequeue(), ms);
    } else {
      this.dequeue();
    }
  }

  private dequeue() {
    // We're already handling a promise, don't start another one.
    if (this.handlingPromise) {
      return false;
    }

    // No more items to handle.
    const job = this.jobs.shift();
    if (!job) {
      return false;
    }

    // Start a promise.
    try {
      this.handlingPromise = true;
      job
        .work()
        .then(this.completeJob(job, true))
        .catch(this.completeJob(job, false));
    } catch (err) {
      this.completeJob(job, false);
    }

    // The item was handled.
    return true;
  }

  private completeJob(item: QueueJob<T>, shouldResolve: boolean) {
    return (arg: any) => {
      this.handlingPromise = false;
      (shouldResolve ? item.resolve : item.reject)(arg);

      // Delay if needed.
      this.delayDequeue();
    };
  }
}
