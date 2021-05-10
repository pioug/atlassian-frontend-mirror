import { fireEvent } from '@testing-library/dom';
import { renderHook } from '@testing-library/react-hooks';

import useDocumentEvent from '../use-document-event';

describe('useDocumentEvent()', () => {
  it('should callback when the document event triggers', () => {
    const callback = jest.fn();
    renderHook(() => useDocumentEvent('click', callback));

    fireEvent.click(document);

    expect(callback).toHaveBeenCalled();
  });

  it('should not callback when the hook has been unmounted', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useDocumentEvent('click', callback));

    unmount();
    fireEvent.click(document);

    expect(callback).not.toHaveBeenCalled();
  });
});
