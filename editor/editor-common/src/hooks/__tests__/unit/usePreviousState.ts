import { renderHook } from '@testing-library/react-hooks';

import usePreviousState from '../../usePreviousState';

describe('usePreviousState', () => {
  it('should start as undefined', () => {
    const { result } = renderHook(() => usePreviousState(4));
    expect(result.current).toBe(undefined);
  });

  it('should start as initial value if supplied', () => {
    const { result } = renderHook(() => usePreviousState(4, 0));
    expect(result.current).toBe(0);
  });

  it('should be previous value on re-render', async () => {
    const initialState = 4;
    const nextState = 42;
    const { rerender, result } = renderHook(
      ({ state }) => usePreviousState(state),
      { initialProps: { state: initialState } },
    );
    rerender({ state: nextState });
    expect(result.current).toBe(initialState);
  });

  it('should be previous value on multiple re-renders', async () => {
    const initialState = 4;
    const nextState = 42;
    const { rerender, result } = renderHook(
      ({ state }) => usePreviousState(state),
      { initialProps: { state: initialState } },
    );
    rerender({ state: nextState });
    expect(result.current).toBe(initialState);
    rerender({ state: nextState + 1 });
    expect(result.current).toBe(nextState);
    rerender({ state: nextState + 2 });
    expect(result.current).toBe(nextState + 1);
  });
});
