import type { RefObject } from 'react';
import { useState, useCallback } from 'react';

import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { TOOLBAR_MENU_TYPE } from '@atlaskit/editor-common/types';

import { isDetachedElement } from '../utils/utils';

interface PopupManagerConfig {
  analytics?: {
    onToggle?: (isOpen: boolean, inputMethod?: TOOLBAR_MENU_TYPE | INPUT_METHOD) => void;
  };
  focusTarget?: RefObject<HTMLElement>;
  onClose?: () => void;
  onOpen?: (inputMethod?: TOOLBAR_MENU_TYPE | INPUT_METHOD) => void;
}

export const usePopupManager = (config: PopupManagerConfig = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenedByKeyboard, setIsOpenedByKeyboard] = useState(false);

  const toggle = useCallback((inputMethod?: TOOLBAR_MENU_TYPE | INPUT_METHOD) => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      config.onOpen?.(inputMethod);
    } else {
      config.onClose?.();
    }

    config.analytics?.onToggle?.(newState, inputMethod);
  }, [isOpen, config]);

  const close = useCallback(() => {
    setIsOpen(false);
    config.onClose?.();
    config.analytics?.onToggle?.(false);
  }, [config]);

  const handleEscapeKeydown = useCallback(() => {
    close();
    config.focusTarget?.current?.focus();
  }, [close, config.focusTarget]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (e.target instanceof HTMLElement && !isDetachedElement(e.target)) {
      close();
    }
  }, [close]);

  const handleKeyboardOpen = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsOpenedByKeyboard(true);
      event.preventDefault();
    }
  }, []);

  return {
    isOpen,
    isOpenedByKeyboard,
    toggle,
    close,
    handleEscapeKeydown,
    handleClickOutside,
    handleKeyboardOpen,
  };
};
