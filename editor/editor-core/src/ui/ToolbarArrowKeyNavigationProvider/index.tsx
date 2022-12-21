/* eslint-disable no-console */
import { EditorView } from 'prosemirror-view';
import React, { ReactNode, useLayoutEffect, useRef } from 'react';

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
}: {
  children: ReactNode;
  editorView?: EditorView;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentSelectedItemIndex = useRef(0);

  const incrementIndex = (list: HTMLElement[]) => {
    if (currentSelectedItemIndex.current === list.length - 1) {
      currentSelectedItemIndex.current = 0;
    } else {
      currentSelectedItemIndex.current = currentSelectedItemIndex.current + 1;
    }
  };

  const decrementIndex = (list: HTMLElement[]) => {
    if (currentSelectedItemIndex.current === 0) {
      currentSelectedItemIndex.current = list.length - 1;
    } else {
      currentSelectedItemIndex.current = currentSelectedItemIndex.current - 1;
    }
  };

  const handleArrowRight = (): void => {
    const filteredFocusableElements = getFilteredFocusableElements(
      wrapperRef?.current,
    );

    incrementIndex(filteredFocusableElements);
    filteredFocusableElements[currentSelectedItemIndex.current]?.focus();
  };

  const handleArrowLeft = (): void => {
    const filteredFocusableElements = getFilteredFocusableElements(
      wrapperRef?.current,
    );

    decrementIndex(filteredFocusableElements);
    filteredFocusableElements[currentSelectedItemIndex.current]?.focus();
  };

  const handleTab = (): void => {
    const filteredFocusableElements = getFilteredFocusableElements(
      wrapperRef?.current,
    );
    filteredFocusableElements[currentSelectedItemIndex.current]?.focus();
  };

  const submenuKeydownHandleContext = {
    handleArrowLeft,
    handleArrowRight,
    handleTab,
  };

  useLayoutEffect(() => {
    if (!wrapperRef.current) {
      return;
    }
    const { current: element } = wrapperRef;

    /**
     * To handle the key events on the list
     * @param event
     */
    const handleKeyDown = (event: KeyboardEvent): void => {
      //To trap the focus inside the horizontal main toolbar for left and right arrow keys
      const targetElement = event.target as HTMLElement;

      //To filter out the events outside the main toolbar
      if (!targetElement.closest("[data-testid='ak-editor-main-toolbar']")) {
        return;
      }

      //The key events are from child components such as dropdown menus / popups are ignored
      if (
        document
          .querySelector(
            '[data-role="droplistContent"], [data-test-id="color-picker-menu"], [data-emoji-picker-container="true"]',
          )
          ?.contains(targetElement) ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown'
      ) {
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
      //to handle some usecases such as Tab in/out of main toolbar
      if (!wrapperRef.current?.contains(targetElement)) {
        currentSelectedItemIndex.current = -1;
      } else {
        currentSelectedItemIndex.current =
          filteredFocusableElements.indexOf(targetElement) > -1
            ? filteredFocusableElements.indexOf(targetElement)
            : currentSelectedItemIndex.current;
      }
      if (event.key === 'ArrowRight') {
        incrementIndex(filteredFocusableElements);
      } else if (event.key === 'ArrowLeft') {
        decrementIndex(filteredFocusableElements);
      }
      filteredFocusableElements[currentSelectedItemIndex.current]?.focus();
    };

    element?.addEventListener('keydown', handleKeyDown);
    return () => {
      element?.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSelectedItemIndex, wrapperRef, editorView]);

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
      !elm.closest('[data-test-id="color-picker-menu"]'),
  );
}
