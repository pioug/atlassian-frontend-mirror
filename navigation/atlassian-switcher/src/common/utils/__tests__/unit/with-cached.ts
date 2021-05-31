import { RELEASE_RESOLVED_PROMISE_DELAY, withCached } from '../../with-cached';
jest.useFakeTimers();

describe('utils/with-cached', () => {
  /**
   * Single call
   */
  it('should call original function and resolve to correct value', () => {
    const fn = jest.fn((a) => Promise.resolve(a));
    const wrappedFn = withCached(fn);
    const a0 = { a: 0 };
    const p0 = wrappedFn(a0);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(a0);
    expect(p0).resolves.toBe(a0);
  });

  it('should NOT have cached value when promise is NOT resolved', () => {
    const fn = jest.fn((a) => Promise.resolve(a));
    const wrappedFn = withCached(fn);
    const a0 = { a: 0 };

    expect(wrappedFn.cached(a0)).toBe(undefined);
    wrappedFn(a0);
    expect(wrappedFn.cached(a0)).toBe(undefined);
  });

  it('should have cached value when promise is resolved', async () => {
    expect.assertions(2);

    const fn = jest.fn((a) => Promise.resolve(a));
    const wrappedFn = withCached(fn);
    const a0 = { a: 0 };

    expect(wrappedFn.cached(a0)).toBe(undefined);
    await wrappedFn(a0);
    expect(wrappedFn.cached(a0)).toBe(a0);
  });

  /**
   * Subsequent calls with the similar arguments
   */
  it('should return same promise for two subsequent calls', () => {
    const fn = jest.fn((a) => Promise.resolve(a));
    const wrappedFn = withCached(fn);
    const a0 = { foo: 1 };
    const bar1 = { foo: 1 }; // similar object, different instance

    const p0 = wrappedFn(a0);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(a0);

    const p1 = wrappedFn(bar1);
    expect(fn).toBeCalledTimes(1);

    expect(p0).toBe(p1);

    expect(p0).resolves.toBe(a0);
    expect(p1).resolves.toBe(a0); // yes, `p1` is expected to resolve to `a0`
  });

  it('should call original function twice if previous promise is resolved', async () => {
    expect.assertions(4);

    const fn = jest.fn((a) => Promise.resolve(a));
    const wrappedFn = withCached(fn);
    const foo = { foo: 1 };

    const p0 = wrappedFn(foo);
    await p0;

    jest.advanceTimersByTime(RELEASE_RESOLVED_PROMISE_DELAY);

    const p1 = wrappedFn(foo);
    await p1;

    expect(fn).toBeCalledTimes(2);
    expect(p1).not.toBe(p0);

    expect(p0).resolves.toBe(foo);
    expect(p1).resolves.toBe(foo);
  });

  /**
   * Subsequent calls with the different arguments
   */
  it('should return different promises for two subsequent calls', () => {
    const fn = jest.fn((a) => Promise.resolve(a));
    const wrappedFn = withCached(fn);
    const a0 = { foo: 1 };
    const bar1 = { bar: 1 };

    const p0 = wrappedFn(a0);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toHaveBeenNthCalledWith(1, a0);

    const p1 = wrappedFn(bar1);
    expect(fn).toBeCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, bar1);

    expect(p0).not.toBe(p1);

    expect(p0).resolves.toBe(a0);
    expect(p1).resolves.toBe(bar1);
  });

  it('should have correct cached values for two calls after both promises resolved', async () => {
    expect.assertions(2);

    const fn = jest.fn((a) => Promise.resolve(a));
    const wrappedFn = withCached(fn);
    const a0 = { foo: 1 };
    const bar1 = { bar: 1 };

    await wrappedFn(a0);
    await wrappedFn(bar1);

    expect(wrappedFn.cached(a0)).toBe(a0);
    expect(wrappedFn.cached(bar1)).toBe(bar1);
  });

  /**
   * Rejections
   */
  it('should keep cached value if promise is rejected on second call', async () => {
    expect.assertions(3);

    const fn = jest.fn((a) => Promise.resolve(a));
    const wrappedFn = withCached(fn);
    const a0 = { a: 0 };

    await wrappedFn(a0);
    expect(wrappedFn.cached(a0)).toBe(a0);

    jest.advanceTimersByTime(RELEASE_RESOLVED_PROMISE_DELAY);

    fn.mockRejectedValueOnce('error');
    try {
      await wrappedFn(a0);
    } catch (error) {
      expect(error).toBe('error');
    }

    expect(wrappedFn.cached(a0)).toBe(a0);
  });

  it('should NOT cache error when promise is rejected', async () => {
    expect.assertions(2);

    const fn = jest.fn((a) => Promise.reject(new Error()));
    const wrappedFn = withCached(fn);
    const a0 = { a: 0 };

    expect(wrappedFn.cached(a0)).toBe(undefined);
    try {
      await wrappedFn(a0);
    } catch (error) {}

    expect(wrappedFn.cached(a0)).toBe(undefined);
  });

  /**
   * Reset
   */
  it('should reset caches', async () => {
    expect.assertions(4);

    const fn = jest.fn((a) => Promise.resolve(a));
    const wrappedFn = withCached(fn);

    await wrappedFn(1);
    await wrappedFn(2);

    expect(wrappedFn.cached(1)).toBe(1);
    expect(wrappedFn.cached(2)).toBe(2);

    wrappedFn.reset();

    expect(wrappedFn.cached(1)).toBe(undefined);
    expect(wrappedFn.cached(2)).toBe(undefined);
  });
});
