import * as sinon from 'sinon';
import {
  Gateway,
  UsageFrequencyTracker,
} from '../../../../api/internal/UsageFrequencyTracker';
import DuplicateLimitedQueue from '../../../../util/DuplicateLimitedQueue';
import { grinEmoji, generateSkinVariation } from '../../_test-data';

/**
 * Extend the UsageFrequencyTracker to provide access to its queue for mocking in tests.
 */
class TestUsageFrequencyTracker extends UsageFrequencyTracker {
  constructor(queue: DuplicateLimitedQueue<string>) {
    super();
    this.queue = queue;
  }
}

describe('UsageFrequencyTracker', () => {
  describe('Gateway', () => {
    it('should not accept a maximum of less than 1', () => {
      expect(() => new Gateway(0)).toThrow(RangeError);
    });

    it('should allow work when none in-flight', async (done) => {
      const gateway = new Gateway(1);
      expect(
        gateway.submit(async () => {
          // Gateway internally invokes the submit callback via a setTimeout which runs on the next tick in the event loop.
          // To avoid an Invariation Violation in React we use async/await to ensure the test suit hasn't dismounted
          // before the callback is triggered.
          await done();
        }),
      ).toEqual(true);
    });

    it('should prevent work when too much in flight', async (done) => {
      const queueSize = 2;
      let doneCounter = 0;
      const doneCollector = async () => {
        doneCounter++;
        if (doneCounter >= queueSize) {
          // Gateway internally invokes the submit callback via a setTimeout which runs on the next tick in the event loop.
          // To avoid an Invariation Violation in React we use async/await to ensure the test suit hasn't dismounted
          // before the callback is triggered.
          await done();
        } else {
          await Promise.resolve();
        }
      };

      const gateway = new Gateway(queueSize);
      expect(
        gateway.submit(async () => {
          await doneCollector();
        }),
      ).toEqual(true);
      expect(
        gateway.submit(async () => {
          await doneCollector();
        }),
      ).toEqual(true);

      expect(
        gateway.submit(async () => {
          await doneCollector();
        }),
      ).toEqual(false);
    });

    it('should allow more work once in-flight work completes', async (done) => {
      const queueSize = 2;
      let completedCounter = 0;

      const completeCollector = () => {
        completedCounter++;
      };

      const gateway = new Gateway(queueSize);
      expect(
        gateway.submit(() => {
          completeCollector();
        }),
      ).toEqual(true);
      expect(
        gateway.submit(() => {
          completeCollector();
        }),
      ).toEqual(true);

      expect(
        gateway.submit(() => {
          completeCollector();
        }),
      ).toEqual(false);

      // now delay, and periodically check if the queued work has had a chance to complete before asserting
      // that more can be queued.
      await new Promise((resolve) => {
        const intervalId = window.setInterval(() => {
          if (completedCounter > 0) {
            clearInterval(intervalId);
            expect(
              gateway.submit(() => {
                completeCollector();
              }),
            ).toEqual(true);
            resolve();
          }
        }, 50);
        // Gateway internally invokes the submit callback via a setTimeout which runs on the next tick in the event loop.
        // To avoid an Invariation Violation in React we use async/await to ensure the test suit hasn't dismounted
        // before the callback is triggered.
      }).then(async () => await done());
    });
  });

  describe('UsageFrequencyTracker', () => {
    let mockQueue: DuplicateLimitedQueue<string>;
    let mockEnqueue: sinon.SinonStub;
    let mockClear: sinon.SinonSpy;

    // delay and periodically check if mockEnqueue has been called
    const waitForEnqueue = (
      testCompleter: () => void,
      assertions?: () => void,
    ) => {
      // now delay, and periodically check if the work has completed.
      const intervalId = window.setInterval(() => {
        if (mockEnqueue.called) {
          clearInterval(intervalId);
          if (assertions) {
            assertions();
          }
          testCompleter();
        }
      }, 50);
    };

    beforeEach(() => {
      mockQueue = <DuplicateLimitedQueue<string>>{};
      mockEnqueue = sinon.stub();
      mockClear = sinon.spy();
      mockQueue.enqueue = mockEnqueue;
      mockQueue.clear = mockClear;
    });

    it('should do work asynchronously', (done) => {
      const tracker = new TestUsageFrequencyTracker(mockQueue);

      tracker.recordUsage(grinEmoji);
      expect(mockEnqueue.called).toEqual(false);

      // now delay, and periodically check if the work has completed.
      waitForEnqueue(done);
    });

    it('should record base emoji not skin tone variation', (done) => {
      const tracker = new TestUsageFrequencyTracker(mockQueue);
      const skinToneEmoji = generateSkinVariation(grinEmoji, 3);
      tracker.recordUsage(skinToneEmoji);

      waitForEnqueue(done, () => {
        expect(mockEnqueue.calledWith(grinEmoji.id)).toEqual(true);
      });
    });

    it('should clear the queue', () => {
      const tracker = new TestUsageFrequencyTracker(mockQueue);
      tracker.clear();
      expect(mockClear.calledOnce).toEqual(true);
    });
  });
});
