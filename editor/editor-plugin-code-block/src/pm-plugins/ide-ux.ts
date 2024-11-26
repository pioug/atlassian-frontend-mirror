import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { CommandDispatch, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { filterCommand as filter } from '@atlaskit/editor-common/utils';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { setTextSelection } from '@atlaskit/editor-prosemirror/utils';

import type { CodeBlockPlugin } from '../index';

import { getAutoClosingBracketInfo, shouldAutoCloseBracket } from './ide-ux/bracket-handling';
import { indent, insertIndent, insertNewlineWithIndent, outdent } from './ide-ux/commands';
import {
	getEndOfCurrentLine,
	getLineInfo,
	getStartOfCurrentLine,
	isCursorInsideCodeBlock,
	isSelectionEntirelyInsideCodeBlock,
} from './ide-ux/line-handling';
import {
	isClosingCharacter,
	isCursorBeforeClosingCharacter,
} from './ide-ux/paired-character-handling';
import { getAutoClosingQuoteInfo, shouldAutoCloseQuote } from './ide-ux/quote-handling';
import { getCursor } from './utils';

const ideUX = (pluginInjectionApi: ExtractInjectionAPI<CodeBlockPlugin> | undefined) => {
	const editorAnalyticsAPI = pluginInjectionApi?.analytics?.actions;
	return new SafePlugin({
		props: {
			handleTextInput(view, from, to, text) {
				const { state, dispatch } = view;
				const compositionPluginState = pluginInjectionApi?.composition?.sharedState.currentState();
				if (isCursorInsideCodeBlock(state) && !compositionPluginState?.isComposing) {
					const beforeText = getStartOfCurrentLine(state).text;
					const afterText = getEndOfCurrentLine(state).text;

					// If text is a closing bracket/quote and we've already inserted it, move the selection after
					if (
						isCursorBeforeClosingCharacter(afterText) &&
						isClosingCharacter(text) &&
						afterText.startsWith(text)
					) {
						dispatch(setTextSelection(to + text.length)(state.tr));
						return true;
					}

					// Automatically add right-hand side bracket when user types the left bracket
					if (shouldAutoCloseBracket(beforeText, afterText)) {
						const { left, right } = getAutoClosingBracketInfo(beforeText + text, afterText);
						if (left && right) {
							const bracketPair = state.schema.text(text + right);
							let tr = state.tr.replaceWith(from, to, bracketPair);
							dispatch(setTextSelection(from + text.length)(tr));
							return true;
						}
					}

					// Automatically add closing quote when user types a starting quote
					if (shouldAutoCloseQuote(beforeText, afterText)) {
						const { left: leftQuote, right: rightQuote } = getAutoClosingQuoteInfo(
							beforeText + text,
							afterText,
						);
						if (leftQuote && rightQuote) {
							const quotePair = state.schema.text(text + rightQuote);
							let tr = state.tr.replaceWith(from, to, quotePair);
							dispatch(setTextSelection(from + text.length)(tr));
							return true;
						}
					}
				}
				return false;
			},
			handleKeyDown: keydownHandler({
				Backspace: (state: EditorState, dispatch?: CommandDispatch) => {
					if (isCursorInsideCodeBlock(state)) {
						const $cursor = getCursor(state.selection)!;
						const beforeText = getStartOfCurrentLine(state).text;
						const afterText = getEndOfCurrentLine(state).text;

						const {
							left: leftBracket,
							right: rightBracket,
							hasTrailingMatchingBracket,
						} = getAutoClosingBracketInfo(beforeText, afterText);
						if (leftBracket && rightBracket && hasTrailingMatchingBracket && dispatch) {
							dispatch(
								state.tr.delete(
									$cursor.pos - leftBracket.length,
									$cursor.pos + rightBracket.length,
								),
							);
							return true;
						}

						const {
							left: leftQuote,
							right: rightQuote,
							hasTrailingMatchingQuote,
						} = getAutoClosingQuoteInfo(beforeText, afterText);
						if (leftQuote && rightQuote && hasTrailingMatchingQuote && dispatch) {
							dispatch(
								state.tr.delete($cursor.pos - leftQuote.length, $cursor.pos + rightQuote.length),
							);
							return true;
						}

						const {
							indentToken: { size, token },
							indentText,
						} = getLineInfo(beforeText);
						if (beforeText === indentText) {
							if (indentText.endsWith(token.repeat(size)) && dispatch) {
								dispatch(
									state.tr.delete(
										$cursor.pos - (size - (indentText.length % size) || size),
										$cursor.pos,
									),
								);
								return true;
							}
						}
					}
					return false;
				},
				Enter: filter(isSelectionEntirelyInsideCodeBlock, insertNewlineWithIndent),
				'Mod-]': filter(isSelectionEntirelyInsideCodeBlock, indent(editorAnalyticsAPI)),
				'Mod-[': filter(isSelectionEntirelyInsideCodeBlock, outdent(editorAnalyticsAPI)),
				Tab: filter(
					isSelectionEntirelyInsideCodeBlock,
					(state: EditorState, dispatch?: CommandDispatch) => {
						if (!dispatch) {
							return false;
						}

						if (isCursorInsideCodeBlock(state)) {
							return insertIndent(state, dispatch);
						}
						return indent(editorAnalyticsAPI)(state, dispatch);
					},
				),
				'Shift-Tab': filter(isSelectionEntirelyInsideCodeBlock, outdent(editorAnalyticsAPI)),
				'Mod-a': (state: EditorState, dispatch?: CommandDispatch) => {
					if (isSelectionEntirelyInsideCodeBlock(state)) {
						const { $from, $to } = state.selection;
						const isFullCodeBlockSelection =
							$from.parentOffset === 0 && $to.parentOffset === $to.parent.nodeSize - 2;
						if (!isFullCodeBlockSelection && dispatch) {
							dispatch(
								state.tr.setSelection(TextSelection.create(state.doc, $from.start(), $to.end())),
							);
							return true;
						}
					}
					return false;
				},
			}),
		},
	});
};

export default ideUX;
