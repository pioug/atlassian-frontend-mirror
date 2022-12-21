import React, { ReactNode, useLayoutEffect, useRef } from 'react';

import { KeyDownHandlerContext } from '../DropdownMenu/types';

type SimpleEventHandler<T> = (event: T) => void;

/**
 * This component is a wrapper of vertical menus which listens to keydown events of children
 * and handles up/down arrow key navigation
 */
export const MenuArrowKeyNavigationProvider = ({
  children,
  handleClose,
  disableArrowKeyNavigation,
  keyDownHandlerContext,
  closeonTab,
}: {
  children: ReactNode;
  handleClose?: SimpleEventHandler<KeyboardEvent>;
  disableArrowKeyNavigation?: boolean;
  keyDownHandlerContext?: KeyDownHandlerContext;
  closeonTab?: boolean;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentSelectedItemIndex = useRef(-1);

  const incrementIndex = (list: HTMLElement[]) => {
    if (
      currentSelectedItemIndex.current === list.length - 1 ||
      currentSelectedItemIndex.current === -1
    ) {
      currentSelectedItemIndex.current = 0;
    } else {
      currentSelectedItemIndex.current = currentSelectedItemIndex.current + 1;
    }
  };

  const decrementIndex = (list: HTMLElement[]) => {
    if (
      currentSelectedItemIndex.current === 0 ||
      currentSelectedItemIndex.current === -1
    ) {
      currentSelectedItemIndex.current = list.length - 1;
    } else {
      currentSelectedItemIndex.current = currentSelectedItemIndex.current - 1;
    }
  };

  useLayoutEffect(() => {
    if (disableArrowKeyNavigation) {
      return;
    }

    /**
     * To handle the key events on the list
     * @param event
     */
    const handleKeyDown = (event: KeyboardEvent): void => {
      const targetElement = event.target as HTMLElement;

      //Tab key on menu items can be handled in the parent components of dropdown menus with KeydownHandlerContext
      if (event.key === 'Tab' && closeonTab) {
        handleClose!(event);
        keyDownHandlerContext?.handleTab();
        return;
      }

      //To trap the focus inside the toolbar using left and right arrow keys
      const focusableElements = getEnabledElements(wrapperRef?.current);
      if (!focusableElements || focusableElements?.length === 0) {
        return;
      }

      if (!wrapperRef.current?.contains(targetElement)) {
        currentSelectedItemIndex.current = -1;
      }

      switch (event.key) {
        case 'ArrowDown':
          //If ArrowDown pressed
          //If on last item
          // Focus last item
          //Else
          // Focus next item
          incrementIndex(focusableElements);
          focusableElements[currentSelectedItemIndex.current]?.focus();
          event.preventDefault();
          break;

        case 'ArrowUp':
          //ArrowUP pressed
          //If on First item
          // Focus last item
          //Else
          // Focus previous item
          decrementIndex(focusableElements);
          focusableElements[currentSelectedItemIndex.current]?.focus();
          event.preventDefault();
          break;

        //ArrowLeft/Right on the menu should close the menus
        //then logic to retain the focus can be handled in the parent components with KeydownHandlerContext
        case 'ArrowLeft':
          //Filter out the events from outside the menu
          if (!targetElement.closest('.custom-key-handler-wrapper')) {
            return;
          }
          handleClose!(event);
          keyDownHandlerContext?.handleArrowLeft();
          break;

        case 'ArrowRight':
          //Filter out the events from outside the menu
          if (!targetElement.closest('.custom-key-handler-wrapper')) {
            return;
          }
          handleClose!(event);
          keyDownHandlerContext?.handleArrowRight();
          break;

        case 'Escape':
          handleClose!(event);
          break;

        default:
          return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    currentSelectedItemIndex,
    wrapperRef,
    handleClose,
    disableArrowKeyNavigation,
    keyDownHandlerContext,
    closeonTab,
  ]);

  return (
    <div className="custom-key-handler-wrapper" ref={wrapperRef}>
      {children}
    </div>
  );
};

function getFocusableElements(
  rootNode: HTMLElement | null,
): Array<HTMLElement> {
  if (!rootNode) {
    return [];
  }
  const focusableModalElements =
    (rootNode.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, div[tabindex="-1"]',
    ) as NodeListOf<HTMLElement>) || [];

  return Array.from(focusableModalElements);
}

/**
 * This method filters out all the disabled menu items
 */
function getEnabledElements(rootNode: HTMLElement | null): Array<HTMLElement> {
  const focusableElements = getFocusableElements(rootNode);
  return focusableElements.filter(
    (element) =>
      !element.querySelector('[role="button"][aria-disabled="true"]') &&
      !element.querySelector('[role="menuitem"][aria-disabled="true"]'),
  );
}
