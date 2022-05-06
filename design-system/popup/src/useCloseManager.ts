import { useEffect } from 'react';

import { bindAll } from 'bind-event-listener';

import { CloseManagerHook } from './types';

function noop() {}

export const useCloseManager = ({
  isOpen,
  onClose,
  popupRef,
  triggerRef,
  shouldUseCaptureOnOutsideClick: capture,
}: CloseManagerHook): void => {
  useEffect(() => {
    if (!isOpen || !popupRef) {
      return noop;
    }

    const closePopup = () => {
      if (onClose) {
        onClose();
      }
    };

    // This check is required for cases where components like
    // Select or DDM are placed inside a Popup. A click
    // on a MenuItem or Option would close the Popup, without registering
    // a click on DDM/Select.
    // Users would have to call `onClose` manually to close the Popup in these cases.
    // You can see the bug in action here:
    // https://codesandbox.io/s/atlaskitpopup-default-forked-2eb87?file=/example.tsx:0-1788
    const onClick = ({ target }: MouseEvent) => {
      const doesDomNodeExist = document.body.contains(target as Node);

      if (!doesDomNodeExist) {
        return;
      }

      const isClickOnPopup = popupRef && popupRef.contains(target as Node);
      const isClickOnTrigger =
        triggerRef && triggerRef.contains(target as Node);

      if (!isClickOnPopup && !isClickOnTrigger) {
        closePopup();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'Escape' || key === 'Esc') {
        closePopup();
      }
    };

    const unbind = bindAll(window, [
      {
        type: 'click',
        listener: onClick,
        options: { capture },
      },
      {
        type: 'keydown',
        listener: onKeyDown,
      },
    ]);
    return unbind;
  }, [isOpen, onClose, popupRef, triggerRef, capture]);
};
