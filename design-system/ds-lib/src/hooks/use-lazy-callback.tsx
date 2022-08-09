import useLazyRef from './use-lazy-ref';

/**
 * Saves the passed through `callback` to a ref to ensure stability between renders.
 * As a feature this callback will only be created **once**,
 * this means it will have a stale closure on subsequent render.
 *
 * If you need to access things in the parent scope make sure to do it with refs.
 *
 * ```js
 * const callback = useLazyCallback(() => 10);
 * ```
 *
 * @param callback
 */
export default function useLazyCallback<TCallback extends Function>(
  callback: TCallback,
): TCallback {
  const ref = useLazyRef(() => callback);
  return ref.current;
}
