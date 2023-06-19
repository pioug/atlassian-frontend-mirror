import { renderHook } from '@testing-library/react-hooks';

import { type UNSAFE_useMediaQuery as useMediaQueryType } from '../use-media-query';

let useMediaQuery: typeof useMediaQueryType;

const addEventListener = jest.fn();
const removeEventListener = jest.fn();
const mockMatchMediaAtWidth = (rem: number = 0) => {
  (addEventListener as jest.Mock).mockReset();
  (removeEventListener as jest.Mock).mockReset();

  window.matchMedia = jest.fn().mockImplementation(query => {
    const isMax = !!String(query).includes('max-width');
    const mediaWidth = parseFloat(query.replace(/[^\d\.]+/g, ''));
    const matches = isMax ? mediaWidth > rem : mediaWidth <= rem;

    return {
      matches,
      media: query,
      onchange: null,
      addEventListener,
      removeEventListener,
    };
  });

  jest.isolateModules(() => {
    useMediaQuery = require('../use-media-query').UNSAFE_useMediaQuery;
  });
};

describe('useMediaQuery (with a mocked matchMedia)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockMatchMediaAtWidth();
  });

  test('mounts matchMedia with expected queries (only once)', () => {
    expect(window.matchMedia).toHaveBeenCalledTimes(13);

    // Call to make sure it doesn't bind again
    renderHook(() => useMediaQuery('above.sm'));
    renderHook(() => useMediaQuery('below.md'));

    expect(window.matchMedia).toHaveBeenCalledTimes(13);
    expect((window.matchMedia as jest.Mock).mock.calls).toEqual([
      ['(min-width: 0rem)'],
      ['(min-width: 30rem)'],
      ['(min-width: 48rem)'],
      ['(min-width: 64rem)'],
      ['(min-width: 90rem)'],
      ['(min-width: 110rem)'],
      ['(min-width: 135rem)'],
      ['(max-width: 29.998rem)'],
      ['(max-width: 47.998rem)'],
      ['(max-width: 63.998rem)'],
      ['(max-width: 89.998rem)'],
      ['(max-width: 109.998rem)'],
      ['(max-width: 134.998rem)'],
    ]);
  });

  test('an event listener does not re-bind when args are unchanged', () => {
    expect(addEventListener).not.toHaveBeenCalled();
    expect(removeEventListener).not.toHaveBeenCalled();

    const listener = jest.fn();
    const { rerender } = renderHook(
      ({
        query = 'above.xs',
        listenerFn = listener,
      }: {
        query?: Parameters<typeof useMediaQuery>[0];
        listenerFn?: Parameters<typeof useMediaQuery>[1];
      } = {}) => useMediaQuery(query, listenerFn),
    );

    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(removeEventListener).not.toHaveBeenCalled();

    // Re-rendered with the same args results in no change
    removeEventListener.mockReset();
    addEventListener.mockReset();
    rerender();
    rerender({ query: 'above.xs', listenerFn: listener });
    expect(addEventListener).not.toHaveBeenCalled();
    expect(removeEventListener).not.toHaveBeenCalled();
  });

  test('re-rendering with a new query rebinds as expected', () => {
    expect(addEventListener).not.toHaveBeenCalled();
    expect(removeEventListener).not.toHaveBeenCalled();

    const listener = jest.fn();
    const { rerender } = renderHook(
      ({
        query = 'above.xs',
        listenerFn = listener,
      }: {
        query?: Parameters<typeof useMediaQuery>[0];
        listenerFn?: Parameters<typeof useMediaQuery>[1];
      } = {}) => useMediaQuery(query, listenerFn),
    );

    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(removeEventListener).not.toHaveBeenCalled();

    // Re-rendering with a new query results in unbinding and rebinding
    removeEventListener.mockReset();
    addEventListener.mockReset();
    rerender({ query: 'below.sm' });
    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(removeEventListener).toHaveBeenCalledTimes(1);
  });

  test('re-rendering with a new listener reference does not rebind', () => {
    expect(addEventListener).not.toHaveBeenCalled();
    expect(removeEventListener).not.toHaveBeenCalled();

    const listener = jest.fn();
    const { rerender } = renderHook(
      ({
        query = 'above.xs',
        listenerFn = listener,
      }: {
        query?: Parameters<typeof useMediaQuery>[0];
        listenerFn?: Parameters<typeof useMediaQuery>[1];
      } = {}) => useMediaQuery(query, listenerFn),
    );

    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(removeEventListener).not.toHaveBeenCalled();

    // Re-rendering with a new listener does nothing at all because we do not observe reference change on listeners
    removeEventListener.mockReset();
    addEventListener.mockReset();
    rerender({ listenerFn: jest.fn() });
    expect(addEventListener).not.toHaveBeenCalled();
    expect(removeEventListener).not.toHaveBeenCalled();
  });

  test('re-rendering from a falsey to a truthy listener binds', () => {
    expect(addEventListener).not.toHaveBeenCalled();
    expect(removeEventListener).not.toHaveBeenCalled();

    const { rerender } = renderHook(
      ({
        query = 'above.xs',
        listenerFn = undefined,
      }: {
        query?: Parameters<typeof useMediaQuery>[0];
        listenerFn?: Parameters<typeof useMediaQuery>[1];
      } = {}) => useMediaQuery(query, listenerFn),
    );

    expect(addEventListener).not.toHaveBeenCalled();
    expect(removeEventListener).not.toHaveBeenCalled();

    // Re-rendering with a new listener adds an event listener
    removeEventListener.mockReset();
    addEventListener.mockReset();
    rerender({ listenerFn: jest.fn() });
    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(removeEventListener).not.toHaveBeenCalled();
  });

  test('re-rendering from a truthy to a falsey listener un-binds', () => {
    expect(addEventListener).not.toHaveBeenCalled();
    expect(removeEventListener).not.toHaveBeenCalled();

    const { rerender } = renderHook(
      ({
        query = 'above.xs',
        listenerFn = jest.fn(),
      }: {
        query?: Parameters<typeof useMediaQuery>[0];
        listenerFn?: Parameters<typeof useMediaQuery>[1] | null; // RTL Hack: We allow a `null` here so we can render the hook a bit nicer without the default value…
      } = {}) => useMediaQuery(query, listenerFn || undefined),
    );

    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(removeEventListener).not.toHaveBeenCalled();

    // Re-rendering with no listener results in unbinding only
    removeEventListener.mockReset();
    addEventListener.mockReset();
    rerender({ listenerFn: null });
    expect(addEventListener).not.toHaveBeenCalled();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['above.xxs', -0.01, 0], // This doesn't make sense in a brower, but it exists…
    ['above.xs', 29.99, 30],
    ['above.sm', 47.99, 48],
    ['above.md', 63.99, 64],
    ['above.lg', 89.99, 90],
    ['above.xl', 109.99, 110],
    ['above.xxl', 134.99, 135],
    // NOTE: There is no `below.xxs`, we can't be below 0…
    ['below.xs', 30, 29.99],
    ['below.sm', 48, 47.99],
    ['below.md', 64, 63.99],
    ['below.lg', 90, 89.99],
    ['below.xl', 110, 109.99],
    ['below.xxl', 135, 134.99],
  ] as const)('%p changes around %prem', (query, noMatchAt, matchAt) => {
    // Eg. at 30rem it's not "below xs"; below is <= 29.99rem
    mockMatchMediaAtWidth(noMatchAt);
    const { result: result1 } = renderHook(() => useMediaQuery(query));
    expect(result1.current?.matches).toBe(false);

    // Eg. at 30rem it's now above!
    mockMatchMediaAtWidth(matchAt);
    const { result: result2 } = renderHook(() => useMediaQuery(query));
    expect(result2.current?.matches).toBe(true);
  });

  test('an invalid query does nothing and returns null', () => {
    // @ts-expect-error -- Explicitly testing an invalid case; you cannot be "above xxs"
    const { result } = renderHook(() => useMediaQuery('tiny', jest.fn()));

    expect(result.current).toBeNull();
    expect(addEventListener).not.toHaveBeenCalled();
    expect(removeEventListener).not.toHaveBeenCalled();
  });
});
