import { createRateLimitReachedFunction } from '../../plugin';

describe('createRateLimitReachedFunction', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should call the function when not rate limited', () => {
    const fn = jest.fn();
    const onRateLimited = jest.fn();
    const limitedFn = createRateLimitReachedFunction(
      fn,
      1000,
      5,
      onRateLimited,
    );

    limitedFn();

    expect(fn).toHaveBeenCalled();
    expect(onRateLimited).not.toHaveBeenCalled();
  });

  it('should call the limiting function when the rate is hit', () => {
    const fn = jest.fn();
    const onRateLimited = jest.fn();
    const limitedFn = createRateLimitReachedFunction(
      fn,
      1000,
      5,
      onRateLimited,
    );

    for (let i = 0; i < 6; i++) {
      limitedFn();
    }

    // Doesn't actually rate limit as this can affect tests
    // that run in quick succession and/or products.
    expect(fn).toHaveBeenCalledTimes(6);
    expect(onRateLimited).toHaveBeenCalled();
  });

  it('should reset the count after the limitTime has passed', () => {
    const fn = jest.fn();
    const onRateLimited = jest.fn();
    const limitedFn = createRateLimitReachedFunction(
      fn,
      1000,
      5,
      onRateLimited,
    );

    for (let i = 0; i < 5; i++) {
      limitedFn();
    }

    jest.advanceTimersByTime(1000);

    limitedFn();

    expect(fn).toHaveBeenCalledTimes(6);
    expect(onRateLimited).not.toHaveBeenCalled();
  });
});
