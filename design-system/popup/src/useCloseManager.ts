import { useEffect } from 'react';

import { bindAll } from 'bind-event-listener';

import { CloseManagerHook } from './types';

function noop() {}

export const useCloseManager = ({
  isOpen,
  onClose,
  popupRef,
  triggerRef,
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
      // --strictFunctionTypes prevents the above events from being recognised as event listeners
      { type: 'click', listener: onClick as EventListener },
      { type: 'keydown', listener: onKeyDown as EventListener },
    ]);
    return unbind;
  }, [isOpen, onClose, popupRef, triggerRef]);
};
