import { renderHook } from '@testing-library/react-hooks';
import { useListener } from '../../useListener';

describe('useListener', () => {
  it('should not call the callback on the first render', () => {
    const callback = jest.fn();

    renderHook(() => useListener(callback, []));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call the callback on dependencies change', () => {
    const callback = jest.fn();

    const { rerender } = renderHook(
      ({ value }) => useListener(callback, [value]),
      { initialProps: { value: 1 } },
    );

    rerender({ value: 2 });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call the cleanup function on unmount if the callback has been called at least once', () => {
    const cleanup = jest.fn();
    const callback = () => cleanup;

    const { rerender, unmount } = renderHook(
      ({ value }) => useListener(callback, [value]),
      { initialProps: { value: 1 } },
    );

    // Ensure that the callback is executed at least once
    rerender({ value: 2 });

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
