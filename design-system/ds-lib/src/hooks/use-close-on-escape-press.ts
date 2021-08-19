import { useCallback, useRef } from 'react';

import { ESCAPE } from '../utils/keycodes';

import useDocumentEvent from './use-document-event';

export type NativeKeyboardEventHandler = (e: KeyboardEvent) => void;

interface UseCloseOnEscapePressOpts {
  onClose: (e: KeyboardEvent) => void;
  isDisabled?: boolean;
}

/**
 * Calls back when the escape key is pressed.
 * To be used exclusively for closing layered components.
 * Use the `isDisabled` argument to ignore closing events.
 *
 * ```js
 * useCloseOnEscapePress({
 *   onClose: () => {},
 *   isDisabled: false,
 * });
 * ```
 */
export default function useCloseOnEscapePress({
  onClose,
  isDisabled,
}: UseCloseOnEscapePressOpts): void {
  const escapePressed = useRef(false);

  const onKeyDown: NativeKeyboardEventHandler = useCallback(
    (e) => {
      if (isDisabled || escapePressed.current || e.key !== ESCAPE) {
        // We're either already handling the key down event or it's not escape.
        // Bail early!
        return;
      }

      escapePressed.current = true;
      onClose(e);
    },
    [onClose, isDisabled],
  );

  const onKeyUp: NativeKeyboardEventHandler = useCallback(() => {
    escapePressed.current = false;
  }, []);

  useDocumentEvent('keydown', onKeyDown, false);
  useDocumentEvent('keyup', onKeyUp, false);
}
