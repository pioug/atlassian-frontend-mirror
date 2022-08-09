import { renderHook } from '@testing-library/react-hooks';

import usePreviousValue from '../use-previous-value';

describe('usePreviousValue()', () => {
  it('should return undefined for the initial render', () => {
    const { result } = renderHook(() => {
      return usePreviousValue(0);
    });

    expect(result.current).toBeUndefined();
  });

  it('should return zero on the subsequent render', () => {
    const { result, rerender } = renderHook(() => {
      return usePreviousValue(0);
    });

    rerender();

    expect(result.current).toEqual(0);
  });
});
