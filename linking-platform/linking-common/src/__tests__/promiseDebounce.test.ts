import { flushPromises, ManualPromise } from '@atlaskit/link-test-helpers';

import { promiseDebounce } from '../promiseDebounce';

describe('promiseDebounce', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return a fn that returns a debounced promise', async () => {
    const debounceInterval = 200;

    const fn = (() => {
      let value = 0;
      return jest.fn(() => Promise.resolve(++value));
    })();

    const debounced = promiseDebounce(fn, debounceInterval);

    debounced();

    await flushPromises();
    expect(fn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(debounceInterval);

    expect(fn).toHaveBeenCalledTimes(1);

    debounced();
    debounced();
    const result = debounced();

    expect(fn).toHaveBeenCalledTimes(1);

    await flushPromises();
    jest.advanceTimersByTime(debounceInterval);
    expect(fn).toHaveBeenCalledTimes(2);
    await expect(result).resolves.toBe(2);
  });

  it('should handle the rejection error properly', async () => {
    const debounceInterval = 200;

    const fn = (() => {
      let value = 0;
      return jest.fn(() => Promise.reject(++value));
    })();

    const debounced = promiseDebounce(fn, debounceInterval);

    debounced();
    debounced();
    const result = debounced();

    await flushPromises();
    expect(fn).toHaveBeenCalledTimes(0);

    await flushPromises();
    jest.advanceTimersByTime(debounceInterval);

    expect(fn).toHaveBeenCalledTimes(1);
    await expect(result).rejects.toBe(1);
  });

  it('promises should be independently executed (not share resolve value)', async () => {
    const debounceInterval = 200;
    const fn = jest.fn();
    const debounced = promiseDebounce(fn, debounceInterval);
    const promiseA = new ManualPromise(1);
    const promiseB = new ManualPromise(2);

    fn.mockReturnValueOnce(promiseA);
    const a = debounced();
    // Wait the debounce interval so that the cb will have executed
    jest.advanceTimersByTime(debounceInterval);
    expect(fn).toHaveBeenCalledTimes(1);

    fn.mockReturnValueOnce(promiseB);
    const b = debounced();
    // Wait the debounce interval so the second cb will have executed
    jest.advanceTimersByTime(debounceInterval);
    expect(fn).toHaveBeenCalledTimes(2);

    // By this stage both calls to debounce have been executed as they were spaced by the debounce interval, both promises are pending
    // Release Promise A before B, expect that we both promises should resolve to their respective values
    promiseA.resolve();
    promiseB.resolve();

    await expect(a).resolves.toBe(1);
    await expect(b).resolves.toBe(2);
  });
});
