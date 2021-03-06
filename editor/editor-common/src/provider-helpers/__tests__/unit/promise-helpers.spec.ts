import {
  getOnlyFulfilled,
  ResultStatus,
  waitForAllPromises,
  waitForFirstFulfilledPromise,
} from '../../promise-helpers';

const resolvesIn = (timeout: number, value: any) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), timeout);
  });

const rejectsIn = (timeout: number, reason: any) =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error(reason)), timeout);
  });

describe('promise-helpers', () => {
  describe('waitForAllPromises', () => {
    test('should return the promise, wrapped in a object containing the status, so it can be filtered later', async () => {
      const a = Promise.resolve('a');
      const b = Promise.reject(new Error('b'));

      expect(await waitForAllPromises([a])).toEqual([
        { status: ResultStatus.FULFILLED, value: 'a' },
      ]);

      expect(await waitForAllPromises([b])).toEqual([
        { status: ResultStatus.FAILED, reason: new Error('b') },
      ]);
    });

    test('should wait for all promises to resolve/reject before resolving itself', async () => {
      expect(
        await waitForAllPromises([
          Promise.resolve('a'),
          resolvesIn(30, 'b'),
          Promise.reject(new Error('c')),
        ]),
      ).toEqual([
        { status: ResultStatus.FULFILLED, value: 'a' },
        { status: ResultStatus.FULFILLED, value: 'b' },
        { status: ResultStatus.FAILED, reason: new Error('c') },
      ]);
    });
  });

  describe('waitForFirstFulfilledPromise', () => {
    test('should return on the first fulfilled promise, disregarding rejected ones', async () => {
      expect(
        await waitForFirstFulfilledPromise([
          Promise.reject(new Error('a')),
          resolvesIn(30, 'b'),
          Promise.resolve('c'),
        ]),
      ).toEqual('c');
    });

    test('should reject with the last error if all promises have rejected', async () => {
      return expect(
        waitForFirstFulfilledPromise([
          Promise.reject(new Error('a')),
          rejectsIn(30, 'b'),
          Promise.reject(new Error('c')),
        ]),
      ).rejects.toEqual(new Error('b'));
    });

    test('should reject if resolved with null or undefined values', async () => {
      const nullReturnError = new Error(
        `Result was not found but the method didn't reject/throw. Please ensure that it doesn't return null or undefined.`,
      );
      await expect(
        waitForFirstFulfilledPromise([Promise.resolve(null)]),
      ).rejects.toEqual(nullReturnError);

      await expect(
        waitForFirstFulfilledPromise([Promise.resolve(undefined)]),
      ).rejects.toEqual(nullReturnError);

      await expect(
        waitForFirstFulfilledPromise([Promise.resolve(false)]),
      ).resolves.toEqual(false);
    });
  });

  describe('getOnlyFulfilled', () => {
    test('should return only fulfilled results, unwrapped', async () => {
      expect(
        getOnlyFulfilled<string>([
          { status: ResultStatus.FULFILLED, value: 'a' },
          { status: ResultStatus.FULFILLED, value: 'b' },
          { status: ResultStatus.FAILED, reason: 'c' },
        ]),
      ).toEqual(['a', 'b']);
    });
  });
});
