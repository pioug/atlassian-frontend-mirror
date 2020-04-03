import { useEffect } from 'react';
import { CloseManagerHook } from './types';

export const useCloseManager = ({
  isOpen,
  onClose,
  popupRef,
  triggerRef,
}: CloseManagerHook): void => {
  useEffect(() => {
    const closePopup = () => {
      if (onClose) {
        onClose();
      }
    };

    const onClick = ({ target }: MouseEvent) => {
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

    if (isOpen && popupRef) {
      window.addEventListener('click', onClick);
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose, popupRef, triggerRef]);
};
