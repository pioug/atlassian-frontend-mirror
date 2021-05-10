import { fireEvent } from '@testing-library/dom';
import { renderHook } from '@testing-library/react-hooks';

import useElementEvent from '../use-element-event';

describe('useElementEvent()', () => {
  it('should callback when the document event triggers', () => {
    const callback = jest.fn();
    const element = document.createElement('div');
    renderHook(() => useElementEvent(element, 'click', callback));

    fireEvent.click(element);

    expect(callback).toHaveBeenCalled();
  });

  it('should not callback when the hook has been unmounted', () => {
    const callback = jest.fn();
    const element = document.createElement('div');
    const { unmount } = renderHook(() =>
      useElementEvent(element, 'click', callback),
    );

    unmount();
    fireEvent.click(element);

    expect(callback).not.toHaveBeenCalled();
  });
});
