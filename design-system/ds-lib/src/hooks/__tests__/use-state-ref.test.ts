import { act, renderHook } from '@testing-library/react-hooks';

import useStateRef from '../use-state-ref';

describe('#useStateRef', () => {
  it('should return initial value', () => {
    const actual = renderHook(() => useStateRef(0));
    const [value] = actual.result.current;

    expect(value.current).toEqual(0);
  });

  it('should set updated state through value ref', () => {
    const actual = renderHook(() => useStateRef(0));
    const [value, setValue] = actual.result.current;

    act(() => {
      setValue(10);
    });

    expect(value.current).toEqual(10);
  });
});
