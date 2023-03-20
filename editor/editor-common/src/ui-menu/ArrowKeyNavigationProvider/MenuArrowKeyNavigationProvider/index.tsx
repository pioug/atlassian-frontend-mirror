import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { MenuArrowKeyNavigationProviderProps } from '../types';

/**
 * This component is a wrapper of vertical menus which listens to keydown events of children
 * and handles up/down arrow key navigation
 */
export const MenuArrowKeyNavigationProvider: React.FC<
  Omit<MenuArrowKeyNavigationProviderProps, 'type'>
> = ({
  children,
  handleClose,
  disableArrowKeyNavigation,
  keyDownHandlerContext,
  closeOnTab,
  onSelection,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [currentSelectedItemIndex, setCurrentSelectedItemIndex] = useState(-1);

  const incrementIndex = useCallback(
    (list: HTMLElement[]) => {
      const currentIndex = currentSelectedItemIndex;
      let nextIndex = (currentIndex + 1) % list.length;
      // Skips disabled items. Previously this function relied on a list of enabled elements which caused a
      // difference between currentIndex and the item index in the menu.
      while (
        nextIndex !== currentIndex &&
        list[nextIndex].getAttribute('aria-disabled') === 'true'
      ) {
        nextIndex = (nextIndex + 1) % list.length;
      }
      setCurrentSelectedItemIndex(nextIndex);
      return nextIndex;
    },
    [currentSelectedItemIndex],
  );

  const decrementIndex = useCallback(
    (list: HTMLElement[]) => {
      const currentIndex = currentSelectedItemIndex;
      let nextIndex = (list.length + currentIndex - 1) % list.length;
      while (
        nextIndex !== currentIndex &&
        list[nextIndex].getAttribute('aria-disabled') === 'true'
      ) {
        nextIndex = (list.length + nextIndex - 1) % list.length;
      }
      setCurrentSelectedItemIndex(nextIndex);
      return nextIndex;
    },
    [currentSelectedItemIndex],
  );

  // this useEffect uses onSelection in it's dependency list which gets
  // changed as a result of the dropdown menu getting re-rendered in it's
  // parent component. Note that if onSelection gets updated to useMemo
  // this will no longer work.
  useEffect(() => {
    const currentIndex = currentSelectedItemIndex;
    const list = getFocusableElements(wrapperRef?.current);
    const currentElement = list[currentIndex];

    if (
      currentElement &&
      currentElement.getAttribute('aria-disabled') === 'true'
    ) {
      const focusIndex = incrementIndex(list);
      list[focusIndex]?.focus();
    }
  }, [currentSelectedItemIndex, onSelection, incrementIndex, decrementIndex]);

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
      if (event.key === 'Tab' && closeOnTab) {
        handleClose!(event);
        keyDownHandlerContext?.handleTab();
        return;
      }

      //To trap the focus inside the toolbar using left and right arrow keys
      const focusableElements = getFocusableElements(wrapperRef?.current);
      if (!focusableElements || focusableElements?.length === 0) {
        return;
      }

      if (!wrapperRef.current?.contains(targetElement)) {
        setCurrentSelectedItemIndex(-1);
      }

      switch (event.key) {
        case 'ArrowDown': {
          const focusIndex = incrementIndex(focusableElements);
          focusableElements[focusIndex]?.focus();
          event.preventDefault();
          break;
        }

        case 'ArrowUp': {
          const focusIndex = decrementIndex(focusableElements);
          focusableElements[focusIndex]?.focus();
          event.preventDefault();
          break;
        }

        //ArrowLeft/Right on the menu should close the menus
        //then logic to retain the focus can be handled in the parent components with KeydownHandlerContext
        case 'ArrowLeft':
          //Filter out the events from outside the menu
          if (!targetElement.closest('.custom-key-handler-wrapper')) {
            return;
          }
          if (
            !targetElement.closest('[data-testid="editor-floating-toolbar"]')
          ) {
            keyDownHandlerContext?.handleArrowLeft();
          }
          handleClose!(event);
          break;

        case 'ArrowRight':
          //Filter out the events from outside the menu
          if (!targetElement.closest('.custom-key-handler-wrapper')) {
            return;
          }
          if (
            !targetElement.closest('[data-testid="editor-floating-toolbar"]')
          ) {
            keyDownHandlerContext?.handleArrowRight();
          }
          handleClose!(event);
          break;

        case 'Escape':
          handleClose!(event);
          break;

        case 'Enter':
          if (typeof onSelection === 'function') {
            onSelection(currentSelectedItemIndex);
          }
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
    closeOnTab,
    onSelection,
    incrementIndex,
    decrementIndex,
  ]);

  return (
    <div
      className="menu-key-handler-wrapper custom-key-handler-wrapper"
      ref={wrapperRef}
    >
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
