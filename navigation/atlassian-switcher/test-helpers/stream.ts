interface NextOp {
  type: 'next';
  target: number;
}

interface SkipOp {
  type: 'skip';
  target: number;
  skipped: number;
}

type OpDefinition = NextOp | SkipOp;

export interface Stream<T> {
  (event: T): void;
  next: () => Promise<T>;
  skip: (skippedCalls: number) => Promise<T[]>;
  allEvents: () => T[];
}

function createStream<T>(): Stream<T> {
  const operationQueue: OpDefinition[] = [];
  let currentAccept: Function;
  const allEvents: T[] = [];

  const callback = (event: T) => {
    allEvents.push(event);
    evaluateQueueOnCallback();
  };

  const getNewTarget = (positions: number = 1) =>
    operationQueue.length
      ? operationQueue[0].target + positions
      : positions - 1;

  const evaluateQueueOnCallback = () => {
    const element = evaluateQueue();
    if (element && currentAccept) {
      currentAccept(element);
    }
  };

  function evaluateQueueOnMethod() {
    const element = evaluateQueue();
    if (element) {
      return Promise.resolve(element);
    }
    return new Promise((accept) => {
      currentAccept = accept;
    });
  }

  const evaluateQueue = () => {
    if (!operationQueue.length) {
      return;
    }
    const nextOp = operationQueue[0];
    if (nextOp.type === 'next' && nextOp.target < allEvents.length) {
      return allEvents[nextOp.target];
    } else if (nextOp.type === 'skip' && nextOp.target < allEvents.length) {
      return allEvents.slice(
        nextOp.target - nextOp.skipped + 1,
        nextOp.target + 1,
      );
    }
  };

  callback.next = () => {
    operationQueue.unshift({
      type: 'next',
      target: getNewTarget(),
    });

    return evaluateQueueOnMethod() as Promise<T>;
  };

  callback.skip = (calls: number) => {
    operationQueue.unshift({
      type: 'skip',
      skipped: calls,
      target: getNewTarget(calls),
    });

    return evaluateQueueOnMethod() as Promise<T[]>;
  };

  callback.allEvents = () => {
    return allEvents;
  };

  return callback;
}

export default createStream;
