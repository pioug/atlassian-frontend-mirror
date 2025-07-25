import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { setGapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import {
	CodeBlockSharedCssClassName,
	getOrderedListInlineStyles,
	listItemCounterPadding,
} from '@atlaskit/editor-common/styles';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import { getItemCounterDigitsSize, isListNode, pluginFactory } from '@atlaskit/editor-common/utils';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ListState } from '../types';

import { isWrappingPossible } from './utils/selection';

const listPluginKey = new PluginKey<ListState>('listPlugin');
export const pluginKey = listPluginKey;

const initialState: ListState = {
	bulletListActive: false,
	bulletListDisabled: false,
	orderedListActive: false,
	orderedListDisabled: false,
	decorationSet: DecorationSet.empty,
};

export const getDecorations = (
	doc: Node,
	state: EditorState,
	featureFlags: FeatureFlags,
): DecorationSet => {
	const decorations: Decoration[] = [];

	// this stack keeps track of each (nested) list to calculate the indentation level
	const processedListsStack: { node: Node; startPos: number }[] = [];

	doc.nodesBetween(0, doc.content.size, (node, currentNodeStartPos) => {
		if (processedListsStack.length > 0) {
			let isOutsideLastList = true;
			while (isOutsideLastList && processedListsStack.length > 0) {
				const lastList = processedListsStack[processedListsStack.length - 1];
				const lastListEndPos = lastList.startPos + lastList.node.nodeSize;
				isOutsideLastList = currentNodeStartPos >= lastListEndPos;
				// once we finish iterating over each innermost list, pop the stack to
				// decrease the indent level attribute accordingly
				if (isOutsideLastList) {
					processedListsStack.pop();
				}
			}
		}

		if (isListNode(node)) {
			processedListsStack.push({ node, startPos: currentNodeStartPos });
			const from = currentNodeStartPos;
			const to = currentNodeStartPos + node.nodeSize;
			const depth = processedListsStack.length;

			decorations.push(
				Decoration.node(from, to, {
					'data-indent-level': `${depth}`,
				}),
			);

			if (node.type.name === 'orderedList') {
				// If a numbered list has item counters numbering >= 100, we'll need to add special
				// spacing to account for the extra digit chars
				const digitsSize = getItemCounterDigitsSize({
					itemsCount: node?.childCount,
					order: node?.attrs?.order,
				});

				if (digitsSize && digitsSize > (fg('platform_editor_ol_padding_fix') ? 1 : 2)) {
					decorations.push(
						Decoration.node(from, to, {
							style: getOrderedListInlineStyles(digitsSize, 'string'),
						}),
					);
				}
			}
		}
	});

	return DecorationSet.empty.add(doc, decorations);
};

const handleDocChanged =
	(featureFlags: FeatureFlags) =>
	(tr: ReadonlyTransaction, pluginState: ListState, editorState: EditorState): ListState => {
		const nextPluginState = handleSelectionChanged(tr, pluginState);
		const decorationSet = getDecorations(tr.doc, editorState, featureFlags);
		return {
			...nextPluginState,
			decorationSet,
		};
	};

const handleSelectionChanged = (tr: ReadonlyTransaction, pluginState: ListState): ListState => {
	const { bulletList, orderedList, taskList } = tr.doc.type.schema.nodes;
	const listParent = findParentNodeOfType([bulletList, orderedList, taskList])(tr.selection);

	const bulletListActive = !!listParent && listParent.node.type === bulletList;
	const orderedListActive = !!listParent && listParent.node.type === orderedList;
	const bulletListDisabled = !(
		bulletListActive ||
		orderedListActive ||
		isWrappingPossible(bulletList, tr.selection)
	);
	const orderedListDisabled = !(
		bulletListActive ||
		orderedListActive ||
		isWrappingPossible(orderedList, tr.selection)
	);

	if (
		bulletListActive !== pluginState.bulletListActive ||
		orderedListActive !== pluginState.orderedListActive ||
		bulletListDisabled !== pluginState.bulletListDisabled ||
		orderedListDisabled !== pluginState.orderedListDisabled
	) {
		const nextPluginState = {
			...pluginState,
			bulletListActive,
			orderedListActive,
			bulletListDisabled,
			orderedListDisabled,
		};
		return nextPluginState;
	}

	return pluginState;
};

const reducer =
	() =>
	(state: ListState): ListState => {
		return state;
	};

const createInitialState = (featureFlags: FeatureFlags) => (state: EditorState) => {
	return {
		...initialState,
		decorationSet: getDecorations(state.doc, state, featureFlags),
	};
};

export const createPlugin = (eventDispatch: Dispatch, featureFlags: FeatureFlags): SafePlugin => {
	const { getPluginState, createPluginState } = pluginFactory(listPluginKey, reducer(), {
		onDocChanged: handleDocChanged(featureFlags),
		onSelectionChanged: handleSelectionChanged,
	});

	return new SafePlugin({
		state: createPluginState(eventDispatch, createInitialState(featureFlags)),
		key: listPluginKey,
		props: {
			decorations(state) {
				const { decorationSet } = getPluginState(state);
				return decorationSet;
			},
			handleClick: (view: EditorView, pos, event: MouseEvent) => {
				const { state } = view;
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				if (['LI', 'UL'].includes((event?.target as HTMLElement).tagName)) {
					const nodeAtPos = state.tr.doc.nodeAt(pos);
					const { listItem, codeBlock } = view.state.schema.nodes;
					if (nodeAtPos?.type === listItem && nodeAtPos?.firstChild?.type === codeBlock) {
						const bufferPx = 50;
						const isCodeBlockNextToListMarker = Boolean(
							document
								?.elementFromPoint(
									event.clientX + (listItemCounterPadding + bufferPx),
									event.clientY,
								)
								?.closest(`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}`),
						);
						if (isCodeBlockNextToListMarker) {
							// +1 needed to put cursor inside li
							// otherwise gap cursor markup will be injected as immediate child of ul resulting in invalid html
							setGapCursorSelection(view, pos + 1, Side.LEFT);
							return true;
						}
					}
				}
				return false;
			},
		},
	});
};
