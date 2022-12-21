/** @jsx jsx */
import React, {
  useRef,
  useCallback,
  Fragment,
  useLayoutEffect,
  useState,
} from 'react';
import { css, jsx } from '@emotion/react';
import { keyName as keyNameNormalized } from 'w3c-keyname';
import { browser } from '@atlaskit/editor-common/utils';
import { getPluginState } from '../utils';
import type { EditorView } from 'prosemirror-view';

import {
  CloseSelectionOptions,
  TYPE_AHEAD_POPUP_CONTENT_CLASS,
} from '../constants';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { TYPE_AHEAD_DECORATION_ELEMENT_ID } from '../constants';
import { AssistiveText } from './AssistiveText';
import { typeAheadListMessages } from '../messages';
import { useIntl } from 'react-intl-next';
import { token } from '@atlaskit/tokens';
import * as colors from '@atlaskit/theme/colors';

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

const isSelectAllShortcut = (event: KeyboardEvent): boolean => {
  const key = keyNameNormalized(event as any);
  return (event.ctrlKey || event.metaKey) && key === 'a';
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
  editorView: EditorView;
  items: any[];
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
    editorView,
    items,
  }) => {
    const ref = useRef<HTMLInputElement>(document.createElement('input'));
    const sizeSpanRef = useRef<HTMLSpanElement>(document.createElement('span'));

    const [redoBuffer, setRedoBuffer] = useState<string[]>([]);
    const [query, setQuery] = useState<string | undefined>(reopenQuery);

    const onChange = useCallback(
      (event: React.FormEvent<HTMLInputElement>) => {
        const text = event.currentTarget.value;
        sizeSpanRef.current.textContent = text;
        setQuery(text);
        onQueryChange(text);
      },
      [onQueryChange],
    );

    const [isInFocus, setInFocus] = useState(false);

    const checkKeyEvent = useCallback(
      (event: KeyboardEvent) => {
        const key = keyNameNormalized(event as any);
        const text = ref.current.value;
        let stopDefault = false;
        const { selectedIndex } = getPluginState(editorView.state);
        setInFocus(true);

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
          case 'PageUp':
          case 'PageDown':
          case 'Home':
            cancel({
              text,
              forceFocusOnEditor: true,
              addPrefixTrigger: true,
              setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
            });
            stopDefault = true;
            break;
          case 'Backspace':
            if (text.length === 0 || ref.current.selectionStart === 0) {
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
            // ED-14758 - Under the W3C specification, any keycode sent under IME would return a keycode 229
            // event.isComposing can't be used alone as this also included a virtual keyboard under a keyboardless device, therefore, it seems the best practice would be intercepting the event as below.
            // Some suggested the other workaround maybe listen on`keypress` instead of `keydown`
            if (
              !event.isComposing ||
              (event.which !== 229 && event.keyCode !== 229)
            ) {
              if (selectedIndex === -1) {
                selectNextItem();
              }
              onItemSelect(
                event.shiftKey
                  ? SelectItemMode.SHIFT_ENTER
                  : SelectItemMode.ENTER,
              );
            }
            break;
          case 'Tab':
            if (selectedIndex === -1) {
              selectNextItem();
            }
            onItemSelect(SelectItemMode.TAB);
            break;
          case 'ArrowDown':
            if (selectedIndex === -1) {
              selectNextItem();
            }
            break;
          case 'ArrowUp':
            if (selectedIndex === -1) {
              selectPreviousItem();
            }
            break;
        }

        if (isSelectAllShortcut(event)) {
          cancel({
            forceFocusOnEditor: true,
            addPrefixTrigger: true,
            text: ref.current.value,
            setSelectionAt: CloseSelectionOptions.BEFORE_TEXT_INSERTED,
          });
          return true;
        }

        const undoRedoType = isUndoRedoShortcut(event);

        const hasReopenQuery = reopenQuery && reopenQuery.length > 0;
        if (onUndoRedo && undoRedoType) {
          if (
            !hasReopenQuery &&
            undoRedoType === 'historyUndo' &&
            text.length > 0
          ) {
            setRedoBuffer((buffer) => [ref.current.value, ...buffer]);
            const undoValue = text.substring(0, text.length - 1);
            ref.current.value = undoValue;
            sizeSpanRef.current.textContent = undoValue;
            stopDefault = true;
          } else if (undoRedoType === 'historyRedo' && redoBuffer.length > 0) {
            const redoValue = redoBuffer[0];
            ref.current.value = redoValue;
            sizeSpanRef.current.textContent = redoValue;
            setRedoBuffer((buffer) => buffer.slice(1));
            stopDefault = true;
          } else {
            stopDefault = onUndoRedo(undoRedoType);
          }
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
        selectPreviousItem,
        cancel,
        editorView.state,
        redoBuffer,
        reopenQuery,
      ],
    );

    const onClick = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        onQueryFocus();
        ref.current?.focus();

        return false;
      },
      [onQueryFocus],
    );

    const queryStyle = css({
      outline: 'none',
      position: 'absolute',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      letterSpacing: 'inherit',
      padding: 0,
      height: '100%',
      width: '100%',
      top: 0,
      left: 0,
      background: 'transparent',
      border: 'none',
      '&&': {
        color: `${token('color.link', colors.B400)}`,
      },
    });

    useLayoutEffect(() => {
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
          const q = ref.current?.value || '';
          const anchorOffset = ref.current?.selectionStart;

          const isMovingRight =
            'ArrowRight' === key && anchorOffset === q.length;
          const isMovingLeft =
            'ArrowLeft' === key && (anchorOffset === 0 || event.metaKey);

          if (!isMovingRight && !isMovingLeft) {
            return;
          }

          cancel({
            forceFocusOnEditor: true,
            addPrefixTrigger: true,
            text: ref.current.value,
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
        const { relatedTarget } = event;

        // Given the user is changing the focus
        // When the target is inside the TypeAhead Popup
        // Then the popup should stay open
        if (
          relatedTarget instanceof HTMLElement &&
          relatedTarget.closest &&
          relatedTarget.closest(`.${TYPE_AHEAD_POPUP_CONTENT_CLASS}`)
        ) {
          return;
        }

        // See ED-14909: Chrome may emit focusout events where an input
        // device was not directly responsible. (This rears in react v17+ consumers
        // where react-managed node removal now appears to propagate focusout events to
        // our event listener). As this path is strictly for click or other typeahead
        // dismissals that don't involve typeahead item selection, we carve out an
        // exception for Chrome-specific events where an input device was not the initiator.
        if (
          browser.chrome &&
          !(window.getSelection()?.type === 'Range') &&
          !('sourceCapabilities' in event && (event as any).sourceCapabilities)
        ) {
          return;
        }

        cancel({
          addPrefixTrigger: true,
          text: ref.current.value,
          setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
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
        setInFocus(false);
        const { target } = e;
        if (e.isComposing || !(target instanceof HTMLInputElement)) {
          return;
        }

        if (e.inputType === 'historyUndo' && target.textContent?.length === 0) {
          e.preventDefault();
          e.stopPropagation();
          close();
          return;
        }
      };
      let onInput: Function | null = null;

      if (browser.safari) {
        // On Safari, for reasons beyond my understanding,
        // The undo behavior is totally different from other browsers
        // That why we need to have an specific branch only for Safari.
        const onInput = (e: InputEvent) => {
          const { target } = e;
          if (e.isComposing || !(target instanceof HTMLInputElement)) {
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
      ref.current.value,
      onQueryFocus,
      cancel,
      checkKeyEvent,
      editorView.state,
    ]);

    useLayoutEffect(() => {
      const hasReopenQuery =
        typeof reopenQuery === 'string' && reopenQuery.trim().length > 0;
      if (ref.current && forceFocus) {
        ref.current.value = hasReopenQuery ? reopenQuery! : '';
        sizeSpanRef.current.textContent = hasReopenQuery ? reopenQuery! : '';

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
          setInFocus(true);
        });
      }
    }, [forceFocus, reopenQuery]);

    const assistiveHintID =
      TYPE_AHEAD_DECORATION_ELEMENT_ID + '__assistiveHint';
    const intl = useIntl();

    /**
      When we migrated to emotion from styled component, we started getting this error.
      jsx-a11y/interactive-supports-focus
      Task added in https://product-fabric.atlassian.net/wiki/spaces/E/pages/3182068181/Potential+improvements#Moderate-changes.
     */
    return (
      <Fragment>
        {triggerQueryPrefix}
        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}

        <span style={{ position: 'relative' }}>
          <span
            ref={sizeSpanRef}
            aria-hidden={true}
            style={{
              marginLeft: '1px',
              visibility: 'hidden',
            }}
          >
            {/* This span is used to control the width of input */}
          </span>
          <input
            css={queryStyle}
            ref={ref}
            onChange={onChange}
            onClick={onClick}
            role="combobox"
            aria-controls={TYPE_AHEAD_DECORATION_ELEMENT_ID}
            aria-autocomplete="list"
            aria-expanded={items.length !== 0}
            aria-labelledby={assistiveHintID}
            suppressContentEditableWarning
            data-query-prefix={triggerQueryPrefix}
            value={query}
          />
        </span>
        <span id={assistiveHintID} style={{ display: 'none' }}>
          {intl.formatMessage(typeAheadListMessages.inputQueryAssistiveLabel)}
        </span>

        <AssistiveText
          assistiveText={
            items.length === 0
              ? intl.formatMessage(typeAheadListMessages.noSearchResultsLabel, {
                  itemsLength: items.length,
                })
              : ''
          }
          isInFocus={items.length === 0 || isInFocus}
          id={TYPE_AHEAD_DECORATION_ELEMENT_ID}
        />
      </Fragment>
    );
  },
);

InputQuery.displayName = 'InputQuery';
