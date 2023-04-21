import React, { useLayoutEffect, useRef, useState } from 'react';

import { ColorPaletteArrowKeyNavigationProps } from '../types';
/**
 * This component is a wrapper for color picker which listens to keydown events of children
 * and handles arrow key navigation
 */
export const ColorPaletteArrowKeyNavigationProvider: React.FC<
  Omit<ColorPaletteArrowKeyNavigationProps, 'type'>
> = ({
  children,
  selectedRowIndex,
  selectedColumnIndex,
  isOpenedByKeyboard,
  isPopupPositioned,
  handleClose,
  closeOnTab,
  editorRef,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentSelectedColumnIndex = useRef(
    selectedColumnIndex === -1 ? 0 : selectedColumnIndex,
  );
  const currentSelectedRowIndex = useRef(
    selectedRowIndex === -1 ? 0 : selectedRowIndex,
  );
  const [listenerTargetElement] = useState<HTMLElement | null>(
    editorRef.current,
  );

  const incrementRowIndex = (
    rowElements: HTMLElement[],
    columnElements: HTMLElement[],
  ) => {
    if (currentSelectedRowIndex.current === rowElements.length - 1) {
      currentSelectedRowIndex.current = 0;
    } else {
      currentSelectedRowIndex.current = currentSelectedRowIndex.current + 1;
    }
  };

  const decrementRowIndex = (
    rowElements: HTMLElement[],
    columnElements: HTMLElement[],
  ) => {
    if (currentSelectedRowIndex.current === 0) {
      currentSelectedRowIndex.current = rowElements.length - 1;
    } else {
      currentSelectedRowIndex.current = currentSelectedRowIndex.current - 1;
    }
  };

  useLayoutEffect(() => {
    const incrementColumnIndex = (
      rowElements: HTMLElement[],
      columnElements: HTMLElement[],
    ) => {
      if (currentSelectedColumnIndex.current === columnElements.length - 1) {
        incrementRowIndex(rowElements, columnElements);
        currentSelectedColumnIndex.current = 0;
      } else {
        currentSelectedColumnIndex.current =
          currentSelectedColumnIndex.current + 1;
      }
    };

    const decrementColumnIndex = (
      rowElements: HTMLElement[],
      columnElements: HTMLElement[],
    ) => {
      if (currentSelectedColumnIndex.current === 0) {
        decrementRowIndex(rowElements, columnElements);
        currentSelectedColumnIndex.current = columnElements.length - 1;
      } else {
        currentSelectedColumnIndex.current =
          currentSelectedColumnIndex.current - 1;
      }
    };

    const focusColorSwatch = () => {
      const colorSwatchesRowElements = getColorSwatchesRows(
        wrapperRef?.current,
      );
      const currentSelectedColorSwatchRowElement =
        colorSwatchesRowElements[currentSelectedRowIndex.current];
      const focusableElements = getFocusableElements(
        currentSelectedColorSwatchRowElement,
      );
      if (!focusableElements || focusableElements?.length === 0) {
        return;
      }
      focusableElements[currentSelectedColumnIndex.current]?.focus();
    };

    /**
     * To handle the key events on the list
     * @param event
     */
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Tab' && closeOnTab) {
        handleClose!(event);
        return;
      }

      const colorSwatchesRowElements = getColorSwatchesRows(
        wrapperRef?.current,
      );
      const currentSelectedColorSwatchRowElement =
        colorSwatchesRowElements[currentSelectedRowIndex.current];
      const focusableElements = getFocusableElements(
        currentSelectedColorSwatchRowElement,
      );

      switch (event.key) {
        case 'ArrowDown':
          incrementRowIndex(colorSwatchesRowElements, focusableElements);
          focusColorSwatch();
          event.preventDefault();
          break;

        case 'ArrowUp':
          decrementRowIndex(colorSwatchesRowElements, focusableElements);
          focusColorSwatch();
          event.preventDefault();
          break;

        case 'ArrowLeft':
          decrementColumnIndex(colorSwatchesRowElements, focusableElements);
          focusColorSwatch();
          event.preventDefault();
          break;

        case 'ArrowRight':
          incrementColumnIndex(colorSwatchesRowElements, focusableElements);
          focusColorSwatch();
          event.preventDefault();
          break;

        case 'Escape':
          handleClose!(event);
          break;

        default:
          return;
      }
    };

    listenerTargetElement &&
      listenerTargetElement.addEventListener('keydown', handleKeyDown);
    // set focus to current selected color swatch if only opened by keyboard
    if (isOpenedByKeyboard && isPopupPositioned) {
      // Using timeout because, we need to wait till color palette is rendered
      //  and visible on screen, then only focus color swatch, otherwise focus will be
      //  moved to body
      setTimeout(() => {
        focusColorSwatch();
      });
    }
    return () => {
      listenerTargetElement &&
        listenerTargetElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    currentSelectedColumnIndex,
    isOpenedByKeyboard,
    isPopupPositioned,
    wrapperRef,
    handleClose,
    closeOnTab,
    listenerTargetElement,
  ]);

  return (
    <div className="custom-key-handler-wrapper" ref={wrapperRef}>
      {children}
    </div>
  );
};

function getColorSwatchesRows(
  rootNode: HTMLElement | null,
): Array<HTMLElement> {
  if (!rootNode) {
    return [];
  }
  const colorSwatchesRowElements =
    (rootNode.querySelectorAll(
      'div[role=radiogroup]',
    ) as NodeListOf<HTMLElement>) || [];

  return Array.from(colorSwatchesRowElements);
}

function getFocusableElements(
  rootNode: HTMLElement | null,
): Array<HTMLElement> {
  if (!rootNode) {
    return [];
  }
  const focusableModalElements =
    (rootNode.querySelectorAll(
      'button[role=radio]:not([disabled])',
    ) as NodeListOf<HTMLElement>) || [];

  return Array.from(focusableModalElements);
}
