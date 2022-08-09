import { renderHook } from '@testing-library/react-hooks';

import useLazyCallback from '../use-lazy-callback';

describe('#useLazyCallback', () => {
  it('should have a stable reference between renders', () => {
    const actual = renderHook(() => useLazyCallback(() => 10));

    const prevRenderValue = actual.result.current;
    actual.rerender();
    const nextRenderValue = actual.result.current;

    expect(prevRenderValue).toBe(nextRenderValue);
  });

  it('should return value', () => {
    const actual = renderHook(() => useLazyCallback(() => 10));

    expect(actual.result.current()).toEqual(10);
  });
});
