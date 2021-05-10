import { fireEvent } from '@testing-library/dom';
import { renderHook } from '@testing-library/react-hooks';

import useWindowEvent from '../use-window-event';

describe('useWindowEvent()', () => {
  it('should callback when the document event triggers', () => {
    const callback = jest.fn();
    renderHook(() => useWindowEvent('click', callback));

    fireEvent.click(window);

    expect(callback).toHaveBeenCalled();
  });

  it('should not callback when the hook has been unmounted', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useWindowEvent('click', callback));

    unmount();
    fireEvent.click(window);

    expect(callback).not.toHaveBeenCalled();
  });
});
