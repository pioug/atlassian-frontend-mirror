import React, { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { keyName as keyNameNormalized } from 'w3c-keyname';
import { browser, ZERO_WIDTH_SPACE } from '@atlaskit/editor-common';

import { CloseSelectionOptions } from '../constants';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';

const QuerySpan = styled.span`
  outline: none;
`;

const isNavigationKey = (event: KeyboardEvent): boolean => {
  return ['Enter', 'Tab', 'ArrowDown', 'ArrowUp'].includes(event.key);
};

const isUndoRedoShortcut = (
  event: KeyboardEvent,
): 'historyUndo' | 'historyRedo' | false => {
  const key = keyNameNormalized(event as any);

  if (event.ctrlKey && key === 'y') {
    return 'historyRedo';
  }

  if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === 'Z') {
    return 'historyRedo';
  }

  if ((event.ctrlKey || event.metaKey) && key === 'z') {
    return 'historyUndo';
  }

  return false;
};

type InputQueryProps = {
  triggerQueryPrefix: string;
  onQueryChange: (query: string) => void;
  onItemSelect: (mode: SelectItemMode) => void;
  selectNextItem: () => void;
  selectPreviousItem: () => void;
  cancel: (props: {
    forceFocusOnEditor: boolean;
    setSelectionAt: CloseSelectionOptions;
    addPrefixTrigger: boolean;
    text: string;
  }) => void;
  onQueryFocus: () => void;
  forceFocus: boolean;
  onUndoRedo?: (inputType: 'historyUndo' | 'historyRedo') => boolean;
  reopenQuery?: string;
};
export const InputQuery: React.FC<InputQueryProps> = React.memo(
  ({
    triggerQueryPrefix,
    cancel,
    onQueryChange,
    onItemSelect,
    selectNextItem,
    selectPreviousItem,
    forceFocus,
    reopenQuery,
    onQueryFocus,
    onUndoRedo,
  }) => {
    const ref = useRef<HTMLSpanElement>(document.createElement('span'));
    const cleanedInputContent = useCallback(() => {
      const raw = ref.current.textContent || '';
      return raw.replace(ZERO_WIDTH_SPACE, '');
    }, []);

    const onKeyUp = useCallback(
      (event: React.KeyboardEvent<HTMLSpanElement>) => {
        const text = cleanedInputContent();

        onQueryChange(text);
      },
      [onQueryChange, cleanedInputContent],
    );

    const checkKeyEvent = useCallback(
      (event: KeyboardEvent) => {
        const key = keyNameNormalized(event as any);
        const sel = document.getSelection();
        const raw = ref.current.textContent || '';
        const text = cleanedInputContent();
        let stopDefault = false;

        switch (key) {
          case ' ': // space key
            if (text.length === 0) {
              cancel({
                forceFocusOnEditor: true,
                text: ' ',
                addPrefixTrigger: true,
                setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
              });
              stopDefault = true;
            }
            break;
          case 'Escape':
            cancel({
              text,
              forceFocusOnEditor: true,
              addPrefixTrigger: true,
              setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
            });
            break;
          case 'Backspace':
            if (
              raw === ZERO_WIDTH_SPACE ||
              raw.length === 0 ||
              sel?.anchorOffset === 0
            ) {
              event.stopPropagation();
              event.preventDefault();
              cancel({
                forceFocusOnEditor: true,
                text,
                addPrefixTrigger: false,
                setSelectionAt: CloseSelectionOptions.BEFORE_TEXT_INSERTED,
              });
            }
            break;
          case 'Enter':
            onItemSelect(
              event.shiftKey
                ? SelectItemMode.SHIFT_ENTER
                : SelectItemMode.ENTER,
            );
            break;
          case 'Tab':
            onItemSelect(SelectItemMode.TAB);
            break;
          case 'ArrowDown':
            selectNextItem();
            break;
          case 'ArrowUp':
            selectPreviousItem();
            break;
        }

        const undoRedoType = isUndoRedoShortcut(event);
        if (onUndoRedo && undoRedoType && onUndoRedo(undoRedoType)) {
          stopDefault = true;
        }

        if (isNavigationKey(event) || stopDefault) {
          event.stopPropagation();
          event.preventDefault();
          return false;
        }
      },
      [
        onUndoRedo,
        onItemSelect,
        selectNextItem,
        cancel,
        selectPreviousItem,
        cleanedInputContent,
      ],
    );

    const onClick = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        onQueryFocus();
        ref.current.focus();

        return false;
      },
      [onQueryFocus],
    );

    useEffect(() => {
      if (!ref.current) {
        return;
      }
      const { current: element } = ref;
      const onFocusIn = (event: FocusEvent) => {
        onQueryFocus();
      };

      const keyDown = (event: KeyboardEvent) => {
        const key = keyNameNormalized(event as any);

        if (
          ['ArrowLeft', 'ArrowRight'].includes(key) &&
          document.getSelection &&
          document.getSelection()
        ) {
          const q = ref.current.textContent || '';
          const sel = document.getSelection();

          const isMovingRight =
            sel && 'ArrowRight' === key && sel.anchorOffset === q.length;
          const isMovingLeft =
            sel && 'ArrowLeft' === key && sel.anchorOffset === 0;

          if (!isMovingRight && !isMovingLeft) {
            return;
          }

          cancel({
            forceFocusOnEditor: true,
            addPrefixTrigger: true,
            text: cleanedInputContent(),
            setSelectionAt: isMovingRight
              ? CloseSelectionOptions.AFTER_TEXT_INSERTED
              : CloseSelectionOptions.BEFORE_TEXT_INSERTED,
          });

          event.preventDefault();
          event.stopPropagation();
          return;
        }

        checkKeyEvent(event);
      };

      const onFocusOut = (event: FocusEvent) => {
        cancel({
          addPrefixTrigger: true,
          text: cleanedInputContent(),
          setSelectionAt: CloseSelectionOptions.BEFORE_TEXT_INSERTED,
          forceFocusOnEditor: false,
        });
      };

      const close = () => {
        cancel({
          addPrefixTrigger: false,
          text: '',
          forceFocusOnEditor: true,
          setSelectionAt: CloseSelectionOptions.BEFORE_TEXT_INSERTED,
        });
      };

      const beforeinput = (e: InputEvent) => {
        const { target } = e;
        if (e.isComposing || !(target instanceof HTMLElement)) {
          return;
        }

        if (
          e.inputType === 'historyUndo' &&
          (target.textContent?.length === 0 ||
            target.textContent === ZERO_WIDTH_SPACE)
        ) {
          e.preventDefault();
          e.stopPropagation();
          close();
          return;
        }

        if (e.data != null && target.textContent === ZERO_WIDTH_SPACE) {
          element.textContent = '';

          // We need to change the content on Safari
          // and set the cursor at the right place
          if (browser.safari) {
            e.preventDefault();
            const dataElement = document.createTextNode(e.data);
            element.appendChild(dataElement);
            const sel = window.getSelection();

            const range = document.createRange();
            range.setStart(dataElement, dataElement.length);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }
      };
      let onInput: Function | null = null;

      if (browser.safari) {
        // On Safari, for reasons beyond my understanding,
        // The undo behavior is totally different from other browsers
        // That why we need to have an specific branch only for Safari.
        const onInput = (e: InputEvent) => {
          const { target } = e;
          if (e.isComposing || !(target instanceof HTMLElement)) {
            return;
          }

          if (
            e.inputType === 'historyUndo' &&
            target.textContent?.length === 1
          ) {
            e.preventDefault();
            e.stopPropagation();
            close();
            return;
          }
        };

        element.addEventListener('input', onInput as any);
      }

      element.addEventListener('focusout', onFocusOut);
      element.addEventListener('focusin', onFocusIn);
      element.addEventListener('keydown', keyDown);
      element.addEventListener('beforeinput', beforeinput as any);

      return () => {
        element.removeEventListener('focusout', onFocusOut);
        element.removeEventListener('focusin', onFocusIn);
        element.removeEventListener('keydown', keyDown);
        element.removeEventListener('beforeinput', beforeinput as any);

        if (browser.safari) {
          element.removeEventListener('input', onInput as any);
        }
      };
    }, [
      triggerQueryPrefix,
      cleanedInputContent,
      onQueryFocus,
      cancel,
      checkKeyEvent,
    ]);

    useEffect(() => {
      const hasReopenQuery =
        typeof reopenQuery === 'string' && reopenQuery.trim().length > 0;
      if (ref.current && forceFocus) {
        ref.current.textContent = hasReopenQuery
          ? reopenQuery!
          : ZERO_WIDTH_SPACE;

        requestAnimationFrame(() => {
          if (!ref?.current) {
            return;
          }

          const sel = window.getSelection();
          if (sel && hasReopenQuery && ref.current.lastChild instanceof Text) {
            const lastChild = ref.current.lastChild;
            const range = document.createRange();
            range.setStart(ref.current.lastChild, lastChild.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }

          ref.current.focus();
        });
      }
    }, [forceFocus, reopenQuery]);

    return (
      <>
        {triggerQueryPrefix}
        <QuerySpan
          contentEditable={true}
          innerRef={ref}
          onKeyUp={onKeyUp}
          onClick={onClick}
          role="textbox"
          suppressContentEditableWarning={true}
          data-query-prefix={triggerQueryPrefix}
        />
      </>
    );
  },
);

InputQuery.displayName = 'InputQuery';
