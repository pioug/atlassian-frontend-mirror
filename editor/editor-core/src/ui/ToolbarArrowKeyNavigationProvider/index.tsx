/* eslint-disable no-console */
import { EditorView } from 'prosemirror-view';
import React, { ReactNode, useCallback, useLayoutEffect, useRef } from 'react';

export interface KeyDownHandlerContext {
  handleArrowLeft: () => void;
  handleArrowRight: () => void;
  handleTab: () => void;
}

/*
 **  The context is used to handle the keydown events of submenus.
 **  Because the keyboard navigation is explicitly managed for main toolbar items
 **  Few key presses such as Tab,Arrow Right/Left need ot be handled here via context
 */
export const KeyDownHandlerContext = React.createContext<KeyDownHandlerContext>(
  {
    handleArrowLeft: () => {},
    handleArrowRight: () => {},
    handleTab: () => {},
  },
);

/**
 * This component is a wrapper of main toolbar which listens to keydown events of children
 * and handles left/right arrow key navigation for all focusable elements
 * @param
 * @returns
 */
export const ToolbarArrowKeyNavigationProvider = ({
  children,
  editorView,
  childComponentSelector,
  handleEscape,
  disableArrowKeyNavigation,
  isShortcutToFocusToolbar,
}: {
  children: ReactNode;
  editorView?: EditorView;
  //Selector is used to filterout the keyevents originated outside of toolbars/any child component
  childComponentSelector: string;
  handleEscape?: (event: KeyboardEvent) => void;
  disableArrowKeyNavigation?: boolean;
  isShortcutToFocusToolbar?: (event: KeyboardEvent) => boolean;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedItemIndex = useRef(0);

  const incrementIndex = useCallback((list: HTMLElement[]) => {
    let index = 0;
    if (document.activeElement) {
      index = list.indexOf(document.activeElement as HTMLElement);
      index = (index + 1) % list.length;
    }
    selectedItemIndex.current = index;
  }, []);

  const decrementIndex = useCallback((list: HTMLElement[]) => {
    let index = 0;
    if (document.activeElement) {
      index = list.indexOf(document.activeElement as HTMLElement);
      index = (list.length + index - 1) % list.length;
    }
    selectedItemIndex.current = index;
  }, []);

  const handleArrowRight = (): void => {
    const filteredFocusableElements = getFilteredFocusableElements(
      wrapperRef?.current,
    );

    incrementIndex(filteredFocusableElements);
    filteredFocusableElements[selectedItemIndex.current]?.focus();
  };

  const handleArrowLeft = (): void => {
    const filteredFocusableElements = getFilteredFocusableElements(
      wrapperRef?.current,
    );

    decrementIndex(filteredFocusableElements);
    filteredFocusableElements[selectedItemIndex.current]?.focus();
  };

  const handleTab = (): void => {
    const filteredFocusableElements = getFilteredFocusableElements(
      wrapperRef?.current,
    );
    filteredFocusableElements[selectedItemIndex.current]?.focus();
  };

  const focusAndScrollToElement = (element: HTMLElement): void => {
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
    element.focus();
  };

  const submenuKeydownHandleContext = {
    handleArrowLeft,
    handleArrowRight,
    handleTab,
  };

  useLayoutEffect(() => {
    if (!wrapperRef.current || disableArrowKeyNavigation) {
      return;
    }
    const { current: element } = wrapperRef;

    /**
     * To handle the key events on the list
     * @param event
     */
    const handleKeyDown = (event: KeyboardEvent): void => {
      //To trap the focus inside the horizontal toolbar for left and right arrow keys
      const targetElement = event.target as HTMLElement;

      //To filter out the events outside the child component
      if (!targetElement.closest(`${childComponentSelector}`)) {
        return;
      }

      //The key events are from child components such as dropdown menus / popups are ignored
      if (
        document
          .querySelector(
            '[data-role="droplistContent"], [data-test-id="color-picker-menu"], [data-emoji-picker-container="true"]',
          )
          ?.contains(targetElement) ||
        document
          .querySelector('[data-test-id="color-picker-menu"]')
          ?.contains(targetElement) ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown' ||
        disableArrowKeyNavigation
      ) {
        return;
      }
      const menuWrapper = document.querySelector('.menu-key-handler-wrapper');
      if (menuWrapper) {
        // if menu wrapper exists, then a menu is open and arrow keys will be handled by MenuArrowKeyNavigationProvider
        return;
      }

      const filteredFocusableElements = getFilteredFocusableElements(
        wrapperRef?.current,
      );
      if (
        !filteredFocusableElements ||
        filteredFocusableElements?.length === 0
      ) {
        return;
      }

      //This is kind of hack to reset the current focused toolbar item
      //to handle some use cases such as Tab in/out of main toolbar
      if (!wrapperRef.current?.contains(targetElement)) {
        selectedItemIndex.current = -1;
      } else {
        selectedItemIndex.current =
          filteredFocusableElements.indexOf(targetElement) > -1
            ? filteredFocusableElements.indexOf(targetElement)
            : selectedItemIndex.current;
      }

      switch (event.key) {
        case 'ArrowRight':
          incrementIndex(filteredFocusableElements);
          focusAndScrollToElement(
            filteredFocusableElements[selectedItemIndex.current],
          );
          event.preventDefault();
          break;
        case 'ArrowLeft':
          decrementIndex(filteredFocusableElements);
          focusAndScrollToElement(
            filteredFocusableElements[selectedItemIndex.current],
          );
          event.preventDefault();
          break;
        case 'Escape':
          handleEscape!(event);
          break;
        default:
      }
    };

    const globalKeyDownHandler = (event: KeyboardEvent): void => {
      //To focus the first element in the toolbar
      if (isShortcutToFocusToolbar!(event)) {
        const filteredFocusableElements = getFilteredFocusableElements(
          wrapperRef?.current,
        );
        filteredFocusableElements[0]?.focus();
        filteredFocusableElements[0]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }
    };

    element?.addEventListener('keydown', handleKeyDown);
    if (isShortcutToFocusToolbar) {
      document.addEventListener('keydown', globalKeyDownHandler);
    }
    return () => {
      element?.removeEventListener('keydown', handleKeyDown);
      if (isShortcutToFocusToolbar) {
        document.removeEventListener('keydown', globalKeyDownHandler);
      }
    };
  }, [
    selectedItemIndex,
    wrapperRef,
    editorView,
    disableArrowKeyNavigation,
    handleEscape,
    childComponentSelector,
    incrementIndex,
    decrementIndex,
    isShortcutToFocusToolbar,
  ]);

  return (
    <div className="custom-key-handler-wrapper" ref={wrapperRef}>
      <KeyDownHandlerContext.Provider value={submenuKeydownHandleContext}>
        {children}
      </KeyDownHandlerContext.Provider>
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
      'a[href], button:not([disabled]), textarea, input, select, div[tabindex="-1"], div[tabindex="0"]',
    ) as NodeListOf<HTMLElement>) || [];
  return Array.from(focusableModalElements);
}

function getFilteredFocusableElements(
  rootNode: HTMLElement | null,
): Array<HTMLElement> {
  //The focusable elements from child components such as dropdown menus / popups are ignored
  return getFocusableElements(rootNode).filter(
    (elm) =>
      !elm.closest('[data-role="droplistContent"]') &&
      !elm.closest('[data-emoji-picker-container="true"]') &&
      !elm.closest('[data-test-id="color-picker-menu"]') &&
      !elm.closest('.scroll-buttons'),
  );
}
