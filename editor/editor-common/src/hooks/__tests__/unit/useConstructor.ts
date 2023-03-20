import { renderHook } from '@testing-library/react-hooks';

import useConstructor from '../../useConstructor';

describe('useConstructor', () => {
  it('only runs once', () => {
    const constructorFn = jest.fn();
    renderHook(() => useConstructor(constructorFn));
    expect(constructorFn).toHaveBeenCalledTimes(1);
  });

  it('only runs once after multiple re-renders', () => {
    const constructorFn = jest.fn();
    const { rerender } = renderHook(() => useConstructor(constructorFn));
    rerender(() => useConstructor(constructorFn));
    rerender(() => useConstructor(constructorFn));
    expect(constructorFn).toHaveBeenCalledTimes(1);
  });

  it('only runs once after rerenders and unmounting', () => {
    const constructorFn = jest.fn();
    const { rerender, unmount } = renderHook(() =>
      useConstructor(constructorFn),
    );
    rerender(() => useConstructor(constructorFn));
    unmount();
    expect(constructorFn).toHaveBeenCalledTimes(1);
  });
});
