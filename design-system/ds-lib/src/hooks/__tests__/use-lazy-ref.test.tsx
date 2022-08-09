import { renderHook } from '@testing-library/react-hooks';

import useLazyRef from '../use-lazy-ref';

describe('#useLazyRef', () => {
  it('should not run passed function again when re-rendered', () => {
    const returnValue = 10;
    const fn = jest.fn().mockReturnValue(returnValue);

    const renderHookResult = renderHook(() => useLazyRef(fn));
    const ref = renderHookResult.result.current;

    expect(ref.current).toBe(returnValue);
    expect(fn).toHaveBeenCalledTimes(1);

    renderHookResult.rerender();

    expect(ref.current).toBe(returnValue);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should not run passed function again when reset to initial local value', () => {
    const returnValue = 10;
    const fn = jest.fn().mockReturnValue(returnValue);

    const renderHookResult = renderHook(() => useLazyRef(fn));
    const ref = renderHookResult.result.current;

    expect(ref.current).toBe(returnValue);
    expect(fn).toHaveBeenCalledTimes(1);

    const newReturnValue = {};
    ref.current = newReturnValue;

    renderHookResult.rerender();

    expect(ref.current).toBe(newReturnValue);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
