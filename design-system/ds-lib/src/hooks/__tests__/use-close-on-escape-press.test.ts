import { fireEvent } from '@testing-library/dom';
import { renderHook } from '@testing-library/react-hooks';

import useCloseOnEscapePress from '../use-close-on-escape-press';

describe('useCloseOnEscapePress()', () => {
  it('should callback on escape press', () => {
    const onClose = jest.fn();
    renderHook(() =>
      useCloseOnEscapePress({
        onClose,
      }),
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('should callback once on escape press', () => {
    const onClose = jest.fn();
    renderHook(() =>
      useCloseOnEscapePress({
        onClose,
      }),
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not callback on escape press when disabled', () => {
    const onClose = jest.fn();
    renderHook(() =>
      useCloseOnEscapePress({
        onClose,
        isDisabled: true,
      }),
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should callback twice after a full key press', () => {
    const onClose = jest.fn();
    renderHook(() =>
      useCloseOnEscapePress({
        onClose,
      }),
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.keyUp(document, { key: 'Escape' });
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('should callback when enabled after being disabled', () => {
    const onClose = jest.fn();
    const { rerender } = renderHook(
      (props) =>
        useCloseOnEscapePress({
          onClose,
          isDisabled: props.isDisabled,
        }),
      { initialProps: { isDisabled: true } },
    );
    fireEvent.keyDown(document, { key: 'Escape' });

    rerender({ isDisabled: false });
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });
});
