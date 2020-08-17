import { Queue } from '../queue';

describe('Queue', () => {
  beforeEach(() => {
    jest.clearAllTimers();

    // NOTE: when using `jest.advanceTimersByTime(ms)` we also `await` it, even though it isn't a promise.
    // This is because the Queue uses an async API internally and we have to clear the Promise queue each time we expect
    // a delay to have occurred. A simple way of doing this is just using an `await` inside of an async function to ensure
    // that our `expect` calls run after the microtask queue is cleared.
    // See: https://javascript.info/event-loop#macrotasks-and-microtasks
    jest.useFakeTimers();
  });

  it('queues jobs in FIFO order', async () => {
    const q = new Queue();

    const bucket: number[] = [];
    await Promise.all([
      q.enqueue(async () => bucket.push(1)),
      q.enqueue(async () => bucket.push(2)),
      q.enqueue(async () => bucket.push(3)),
    ]);

    expect(bucket).toEqual([1, 2, 3]);
  });

  it('passes through resolutions', async () => {
    const q = new Queue();
    const value = q.enqueue(async () => 'RAISE THE ROOF');
    await expect(value).resolves.toEqual('RAISE THE ROOF');
  });

  it('passes through rejections', async () => {
    const q = new Queue();
    const promise = q.enqueue(() => Promise.reject('BOOM BOOM SHAKE THE ROOM'));
    await expect(promise).rejects.toEqual('BOOM BOOM SHAKE THE ROOM');
  });

  describe('delayFirstJob', () => {
    it('delays first job when set', async () => {
      const q = new Queue({ delay: 1000, delayFirstJob: true });

      let wasCalled = false;
      q.enqueue(async () => (wasCalled = true));
      await jest.advanceTimersByTime(1000);
      expect(wasCalled).toBe(true);
    });
  });

  describe('delay', () => {
    it('does not delay when set to 0', async () => {
      const q = new Queue();

      const bucket: number[] = [];
      q.enqueue(async () => bucket.push(1));
      await jest.advanceTimersByTime(0);
      q.enqueue(async () => bucket.push(2));
      await jest.advanceTimersByTime(0);
      q.enqueue(async () => bucket.push(3));

      expect(bucket).toEqual([1, 2, 3]);
    });

    it('delays in between jobs when set', async () => {
      const q = new Queue({ delay: 500 });

      const bucket: number[] = [];
      q.enqueue(async () => bucket.push(1));
      await jest.advanceTimersByTime(0); // first completes immediately
      q.enqueue(async () => bucket.push(2));
      await jest.advanceTimersByTime(500); // delayed
      q.enqueue(async () => bucket.push(3));
      await jest.advanceTimersByTime(500); // delayed

      expect(bucket).toEqual([1, 2, 3]);
    });

    it('delays in between jobs with a delay function', async () => {
      const delayFn = jest.fn().mockImplementation(() => 500);
      const q = new Queue({ delay: delayFn });

      const bucket: number[] = [];
      q.enqueue(async () => bucket.push(1));
      await jest.advanceTimersByTime(0); // first completes immediately
      q.enqueue(async () => bucket.push(2));
      await jest.advanceTimersByTime(500); // delayed
      q.enqueue(async () => bucket.push(3));
      await jest.advanceTimersByTime(500); // delayed

      expect(bucket).toEqual([1, 2, 3]);
    });
  });
});
