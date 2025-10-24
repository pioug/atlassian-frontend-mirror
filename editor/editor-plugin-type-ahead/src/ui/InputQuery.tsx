/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';
import { useIntl } from 'react-intl-next';
import { keyName as keyNameNormalized } from 'w3c-keyname';

import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import { SelectItemMode, typeAheadListMessages } from '@atlaskit/editor-common/type-ahead';
import type { TypeAheadItem } from '@atlaskit/editor-common/types';
import { AssistiveText } from '@atlaskit/editor-common/ui';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import {
	CloseSelectionOptions,
	TYPE_AHEAD_DECORATION_ELEMENT_ID,
	TYPE_AHEAD_POPUP_CONTENT_CLASS,
} from '../pm-plugins/constants';
import { getPluginState } from '../pm-plugins/utils';

const placeholderStyles = css({
	'&::after': {
		content: 'attr(data-place-holder)',
		color: token('color.text.subtlest'),
		position: 'relative',
		padding: token('space.025'),
		left: token('space.negative.050'),
		backgroundColor: token('color.background.neutral'),
		// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
		borderRadius: token('radius.small', '3px'),
	},
});

const queryWithoutPlaceholderStyles = css({
	'&::after': {
		content: `''`,
	},
});

const querySpanStyles = css({
	outline: 'none',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& input': {
		width: '5px',
		border: 'none',
		background: 'transparent',
		padding: 0,
		margin: 0,
		// TODO: ED-17022 - Fixes firefox caret position
		// Do not migrate font when em is used as unit
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
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
	cancel: (props: {
		addPrefixTrigger: boolean;
		forceFocusOnEditor: boolean;
		setSelectionAt: CloseSelectionOptions;
		text: string;
	}) => void;
	editorView: EditorView;
	forceFocus: boolean;
	items: TypeAheadItem[];
	onItemSelect: (mode: SelectItemMode) => void;
	onQueryChange: (query: string) => void;
	onQueryFocus: () => void;
	onUndoRedo?: (inputType: 'historyUndo' | 'historyRedo') => boolean;
	reopenQuery?: string;
	selectNextItem: () => void;
	selectPreviousItem: () => void;
	triggerQueryPrefix: string;
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
		const isEditorInsertionEnabled = editorExperiment('platform_editor_insertion', 'variant1');
		const isEditorControlsEnabled = editorExperiment('platform_editor_controls', 'variant1');
		const isSearchPlaceholderEnabled =
			isEditorInsertionEnabled ||
			(editorExperiment('platform_editor_controls', 'variant1') &&
				fg('platform_editor_quick_insert_placeholder'));
		const selection = editorView.state.selection;
		const { table } = editorView.state.schema.nodes;
		const [showPlaceholder, setShowPlaceholder] = useState(
			isSearchPlaceholderEnabled &&
				triggerQueryPrefix === '/' &&
				// When triggered in very narrow table column, placeholder becomes ellipsis only
				// hence we disable it for now and revisit this scenario in ED-27480
				!findParentNodeOfType(table)(selection),
		);

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

		const onInput = useCallback(() => {
			if (cleanedInputContent()) {
				setShowPlaceholder(false);
			}
		}, [cleanedInputContent]);

		const [isInFocus, setInFocus] = useState(false);

		const checkKeyEvent = useCallback(
			(event: KeyboardEvent) => {
				const key = keyNameNormalized(event);
				const sel = document.getSelection();
				const raw = ref.current?.textContent || '';
				const text = cleanedInputContent();
				let stopDefault = false;
				const { selectedIndex, removePrefixTriggerOnCancel } =
					getPluginState(editorView.state) || {};
				setInFocus(true);

				switch (key) {
					case ' ': // space key
						if (text.length === 0) {
							cancel({
								forceFocusOnEditor: true,
								text: ' ',
								addPrefixTrigger: isEditorControlsEnabled ? !removePrefixTriggerOnCancel : true,
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
							addPrefixTrigger: isEditorControlsEnabled ? !removePrefixTriggerOnCancel : true,
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
						// TODO: ED-14758 - Under the W3C specification, any keycode sent under IME would return a keycode 229
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
						// TODO: DTR-1401 - why is this calling select item when hitting tab? fix this in DTR-1401
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
				isEditorControlsEnabled,
			],
		);

		// Remove when cleaning up platform_editor_a11y_remove_input_query_on_click
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

			const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
				? getBrowserInfo()
				: browserLegacy;
			const { current: element } = ref;
			const { removePrefixTriggerOnCancel } = getPluginState(editorView.state) || {};
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
						addPrefixTrigger: isEditorControlsEnabled ? !removePrefixTriggerOnCancel : true,
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

			const onPaste = (event: ClipboardEvent) => {
				const html = event.clipboardData?.getData('text/html');
				const plainText = event.clipboardData?.getData('text/plain');

				if (html && plainText) {
					event.preventDefault();

					// insert the plain text into the type-ahead input field
					const selection = window.getSelection();
					if (selection && ref.current) {
						if (selection.rangeCount > 0) {
							const range = selection.getRangeAt(0);
							range.deleteContents();
							range.insertNode(document.createTextNode(plainText));
							range.collapse(false);
						}
					}
				}
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

				// Chrome and Edge may emit focusout events without direct input.
				// This path handles dismissals that don't involve item selection, so we ignore these events.
				// In Edge this also lead to duplication in the trigger character (@, /, :) as `cancel` would be called twice
				if (
					(browser.ie || browser.chrome) &&
					!(window.getSelection()?.type === 'Range') &&
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					!(event as any).sourceCapabilities
				) {
					return;
				}

				cancel({
					addPrefixTrigger: isEditorControlsEnabled ? !removePrefixTriggerOnCancel : true,
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
			const onInput: (e: Event) => void = () => {};

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

				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				element.addEventListener('input', onInput);
			}

			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			element.addEventListener('focusout', onFocusOut);
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			element.addEventListener('focusin', onFocusIn);
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			element.addEventListener('keydown', keyDown);
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			element.addEventListener('beforeinput', beforeinput);
			if (expValEquals('platform_editor_paste_rich_text_bugfix', 'isEnabled', true)) {
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				element.addEventListener('paste', onPaste);
			}

			return () => {
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				element.removeEventListener('focusout', onFocusOut);
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				element.removeEventListener('focusin', onFocusIn);
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				element.removeEventListener('keydown', keyDown);
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				element.removeEventListener('beforeinput', beforeinput);
				if (expValEquals('platform_editor_paste_rich_text_bugfix', 'isEnabled', true)) {
					// Ignored via go/ees005
					// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
					element.removeEventListener('paste', onPaste);
				}

				if (browser.safari) {
					// Ignored via go/ees005
					// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
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
			isEditorControlsEnabled,
		]);

		useLayoutEffect(() => {
			const hasReopenQuery = typeof reopenQuery === 'string' && reopenQuery.trim().length > 0;
			if (ref.current && forceFocus) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

		const classNames = useMemo(() => {
			const classes = [];
			if (showPlaceholder) {
				// to avoid the placeholder wrapped to next line when triggered at the end of the line
				// see placeholderWrapStyles in editor-core/src/ui/ContentStyles/index.tsx
				classes.push('placeholder-decoration-wrap');

				if (selection.$from.depth > 1) {
					// to hide placeholder overflow as ellipsis
					// see placeholderWrapStyles in editor-core/src/ui/ContentStyles/index.tsx
					classes.push('placeholder-decoration-hide-overflow');
				}
			}

			return classes.join(' ');
		}, [showPlaceholder, selection]);

		const assistiveHintID = TYPE_AHEAD_DECORATION_ELEMENT_ID + '__assistiveHint';
		const intl = useIntl();

		return (
			<Fragment>
				{triggerQueryPrefix}
				{/* When cleaning up platform_editor_a11y_remove_input_query_on_click remove the eslint disable */}
				{/* eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/interactive-supports-focus -- See https://go/a11y-interactive-supports-focus for more details */}
				<span
					css={[
						querySpanStyles,
						isSearchPlaceholderEnabled && queryWithoutPlaceholderStyles,
						showPlaceholder && placeholderStyles,
					]}
					contentEditable={true}
					ref={ref}
					onKeyUp={onKeyUp}
					onClick={fg('platform_editor_a11y_remove_input_query_on_click') ? undefined : onClick}
					tabIndex={fg('platform_editor_a11y_remove_input_query_on_click') ? -1 : undefined}
					onInput={isSearchPlaceholderEnabled ? onInput : undefined}
					role="combobox"
					aria-controls={TYPE_AHEAD_DECORATION_ELEMENT_ID}
					aria-autocomplete="list"
					aria-expanded={items.length !== 0}
					aria-labelledby={assistiveHintID}
					suppressContentEditableWarning
					data-query-prefix={triggerQueryPrefix}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className={classNames}
					data-place-holder={intl.formatMessage(
						typeAheadListMessages.quickInsertInputPlaceholderLabel,
					)}
				>
					{query === null ? (
						<input
							ref={inputRef}
							type="text"
							aria-label={intl.formatMessage(getAriaLabel(triggerQueryPrefix, intl))}
						/>
					) : (
						query
					)}
				</span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
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
