/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useCallback, useLayoutEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';
import { useIntl } from 'react-intl-next';
import { keyName as keyNameNormalized } from 'w3c-keyname';

import { browser } from '@atlaskit/editor-common/browser';
import { SelectItemMode, typeAheadListMessages } from '@atlaskit/editor-common/type-ahead';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import {
	CloseSelectionOptions,
	TYPE_AHEAD_DECORATION_ELEMENT_ID,
	TYPE_AHEAD_POPUP_CONTENT_CLASS,
} from '../constants';
import type { TypeAheadItem } from '../types';
import { getPluginState } from '../utils';

import { AssistiveText } from './AssistiveText';

const querySpanStyles = css({
	outline: 'none',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& input': {
		width: '5px',
		border: 'none',
		background: 'transparent',
		padding: 0,
		margin: 0,
		// ED-17022 Fixes firefox caret position
		fontSize: '1em',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: blockNodesVerticalMargin,
		caretColor: token('color.text.accent.blue', '#0052CC'),
	},
});

const isNavigationKey = (event: KeyboardEvent): boolean => {
	return ['Enter', 'Tab', 'ArrowDown', 'ArrowUp'].includes(event.key);
};

const isUndoRedoShortcut = (event: KeyboardEvent): 'historyUndo' | 'historyRedo' | false => {
	const key = keyNameNormalized(event);

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

const getAriaLabel = (triggerPrefix: string, intl: IntlShape) => {
	switch (triggerPrefix) {
		case '@':
			return typeAheadListMessages.mentionInputLabel;
		case '/':
			return typeAheadListMessages.quickInsertInputLabel;
		case ':':
			return typeAheadListMessages.emojiInputLabel;
		default:
			return typeAheadListMessages.quickInsertInputLabel;
	}
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
	items: TypeAheadItem[];
};

export const InputQuery = React.memo(
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
	}: InputQueryProps) => {
		const ref = useRef<HTMLSpanElement>(document.createElement('span'));
		const inputRef = useRef<HTMLInputElement | null>(null);
		const [query, setQuery] = useState<string | null>(null);

		const cleanedInputContent = useCallback(() => {
			const raw = ref.current?.textContent || '';
			return raw;
		}, []);

		const onKeyUp = useCallback(
			(event: React.KeyboardEvent<HTMLSpanElement>) => {
				const text = cleanedInputContent();

				onQueryChange(text);
			},
			[onQueryChange, cleanedInputContent],
		);
		const [isInFocus, setInFocus] = useState(false);

		const checkKeyEvent = useCallback(
			(event: KeyboardEvent) => {
				const key = keyNameNormalized(event);
				const sel = document.getSelection();
				const raw = ref.current?.textContent || '';
				const text = cleanedInputContent();
				let stopDefault = false;
				const { selectedIndex } = getPluginState(editorView.state) || {};
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
						if (raw.length === 0 || sel?.anchorOffset === 0) {
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
						if (!event.isComposing && event.which !== 229 && event.keyCode !== 229) {
							if (selectedIndex === -1) {
								/**
								 * TODO DTR-1401: (also see ED-17200) There are two options
								 * here, either
								 * - set the index directly to 1 in WrapperTypeAhead.tsx's
								 *   `insertSelectedItem` at the cost of breaking some of the a11y
								 *   focus changes,
								 * - or do this jank at the cost of some small analytics noise.
								 *
								 * The focus behaviour still needs cleanup
								 */
								selectPreviousItem();
								selectNextItem();
							}
							onItemSelect(event.shiftKey ? SelectItemMode.SHIFT_ENTER : SelectItemMode.ENTER);
						}
						break;
					case 'Tab':
						if (selectedIndex === -1) {
							/**
							 * TODO DTR-1401: (also see ED-17200) There are two options
							 * here, either
							 * - set the index directly to 1 in WrapperTypeAhead.tsx's
							 *   `insertSelectedItem` at the cost of breaking some of the a11y
							 *   focus changes,
							 * - or do this jank at the cost of some small analytics noise.
							 *
							 */
							selectPreviousItem();
							selectNextItem();
						}
						// TODO DTR-1401: why is this calling select item when hitting tab? fix this in DTR-1401
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
				selectPreviousItem,
				cancel,
				cleanedInputContent,
				editorView.state,
			],
		);

		const onClick = useCallback(
			(event: React.MouseEvent) => {
				event.stopPropagation();
				event.preventDefault();
				onQueryFocus();
				inputRef.current?.focus();

				return false;
			},
			[onQueryFocus],
		);

		useLayoutEffect(() => {
			if (!ref.current) {
				return;
			}
			const { current: element } = ref;
			const onFocusIn = (event: FocusEvent) => {
				onQueryFocus();
			};

			const keyDown = (event: KeyboardEvent) => {
				const key = keyNameNormalized(event);

				if (
					['ArrowLeft', 'ArrowRight'].includes(key) &&
					document.getSelection &&
					document.getSelection()
				) {
					const q = ref.current?.textContent || '';
					const sel = document.getSelection();

					const isMovingRight = sel && 'ArrowRight' === key && sel.anchorOffset === q.length;
					const isMovingLeft =
						sel && 'ArrowLeft' === key && (sel.anchorOffset === 0 || event.metaKey);

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
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					!('sourceCapabilities' in event && (event as any).sourceCapabilities)
				) {
					return;
				}

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
				setInFocus(false);
				const { target } = e;
				if (e.isComposing || !(target instanceof HTMLElement)) {
					return;
				}

				if (e.inputType === 'historyUndo' && target.textContent?.length === 0) {
					e.preventDefault();
					e.stopPropagation();
					close();
					return;
				}

				if (e.data != null && inputRef.current === null) {
					setQuery('');

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
			let onInput: (e: Event) => void = () => {};

			if (browser.safari) {
				// On Safari, for reasons beyond my understanding,
				// The undo behavior is totally different from other browsers
				// That why we need to have an specific branch only for Safari.
				const onInput = (e: Event) => {
					const { target } = e;
					if (!(e instanceof InputEvent) || e.isComposing || !(target instanceof HTMLElement)) {
						return;
					}

					if (e.inputType === 'historyUndo' && target.textContent?.length === 1) {
						e.preventDefault();
						e.stopPropagation();
						close();
						return;
					}
				};

				element.addEventListener('input', onInput);
			}

			element.addEventListener('focusout', onFocusOut);
			element.addEventListener('focusin', onFocusIn);
			element.addEventListener('keydown', keyDown);
			element.addEventListener('beforeinput', beforeinput);

			return () => {
				element.removeEventListener('focusout', onFocusOut);
				element.removeEventListener('focusin', onFocusIn);
				element.removeEventListener('keydown', keyDown);
				element.removeEventListener('beforeinput', beforeinput);

				if (browser.safari) {
					element.removeEventListener('input', onInput);
				}
			};
		}, [
			triggerQueryPrefix,
			cleanedInputContent,
			onQueryFocus,
			cancel,
			checkKeyEvent,
			editorView.state,
		]);

		useLayoutEffect(() => {
			const hasReopenQuery = typeof reopenQuery === 'string' && reopenQuery.trim().length > 0;
			if (ref.current && forceFocus) {
				setQuery(hasReopenQuery ? reopenQuery! : null);

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

		const assistiveHintID = TYPE_AHEAD_DECORATION_ELEMENT_ID + '__assistiveHint';
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
				<span
					css={querySpanStyles}
					contentEditable={true}
					ref={ref}
					onKeyUp={onKeyUp}
					onClick={onClick}
					role="combobox"
					aria-controls={TYPE_AHEAD_DECORATION_ELEMENT_ID}
					aria-autocomplete="list"
					aria-expanded={items.length !== 0}
					aria-labelledby={assistiveHintID}
					suppressContentEditableWarning
					data-query-prefix={triggerQueryPrefix}
				>
					{query === null ? <input ref={inputRef} type="text" /> : query}
				</span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<span id={assistiveHintID} style={{ display: 'none' }}>
					{intl.formatMessage(getAriaLabel(triggerQueryPrefix, intl))},
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
