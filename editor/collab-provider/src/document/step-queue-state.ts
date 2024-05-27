import { type StepsPayload } from '../types';
import { createLogger } from '../helpers/utils';

const logger = createLogger('documentService-queue', 'black');

export class StepQueueState {
  private queuePaused: boolean = false;
  private queue: StepsPayload[] = [];

  queueSteps(data: StepsPayload) {
    logger(`Queueing data for version "${data.version}".`);

    const orderedQueue = [...this.queue, data].sort((a, b) =>
      a.version > b.version ? 1 : -1,
    );

    this.queue = orderedQueue;
  }

  getQueue = () => {
    return this.queue;
  };

  filterQueue = (condition: (stepsPayload: StepsPayload) => boolean) => {
    this.queue = this.queue.filter(condition);
  };

  /**
   * Get whether the document service has stopped processing new steps whilst it carries out processes such as catchup.
   * Exposed for testing
   */
  isPaused = () => this.queuePaused;

  pauseQueue = () => {
    this.queuePaused = true;
  };
  resumeQueue = () => {
    this.queuePaused = false;
  };

  shift = () => {
    return this.queue.shift();
  };
}
