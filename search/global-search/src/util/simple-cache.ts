/**
 * Simple cache that caches exactly one item.
 */
export class SimpleCache<T, Args extends Varargs = []> {
  static DEFAULT_TIMEOUT_IN_MS = 15 * 60 * 1000;

  timeoutMs: number;
  nextCacheRefreshTime: number = Date.now();
  currentValue: NonNullable<T> | undefined;
  supplier: (...args: Args) => NonNullable<T>;

  /**
   * @param initialValue The initial value, if undefined then the first get() call when initiate the cache value
   *
   * @param supplier The callback that will be called if the cache times out or if no existing value exists for the cache.
   *                 In the case that the supplier throws an exception the error will not be cached. If there's an error
   *                    we will instead return the last known good value but will attempt to refresh the cache again the next time
   *                    get() is called.
   *                 Any parameters passed into get() will be passed through to supplier. Unlike memoize the cache does not
   *                    care about the parameters and will not be invalidated if these parameters change.
   *
   * @param timeoutMs The time to wait before allowing the cache to refresh, this defaults to 15 mins.
   */
  constructor(
    initialValue: NonNullable<T> | undefined,
    supplier: (...args: Args) => NonNullable<T>,
    timeoutMs: number = SimpleCache.DEFAULT_TIMEOUT_IN_MS,
  ) {
    this.timeoutMs = timeoutMs;
    this.supplier = supplier;

    if (initialValue) {
      this.currentValue = initialValue;
      this.updateNextRefreshTime();
    }
  }

  public get(...args: Args): NonNullable<T> {
    if (this.currentValue && Date.now() < this.nextCacheRefreshTime) {
      return this.currentValue;
    }

    this.updateNextRefreshTime();

    try {
      const result = this.supplier(...args);
      this.currentValue = result;
    } catch (e) {
      // If there's an error we will return the last good value but will attempt again on the next get()
      this.invalidate();
    }

    if (!this.currentValue) {
      throw new Error('Failed to initialise a value for the cache');
    }

    return this.currentValue;
  }

  invalidate() {
    this.nextCacheRefreshTime = Date.now();
  }

  private updateNextRefreshTime() {
    this.nextCacheRefreshTime = Date.now() + this.timeoutMs;
  }
}
