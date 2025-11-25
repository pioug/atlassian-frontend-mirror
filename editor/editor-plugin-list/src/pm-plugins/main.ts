import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { setGapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import {
	CodeBlockSharedCssClassName,
	getOrderedListInlineStyles,
	listItemCounterPadding,
} from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import { getItemCounterDigitsSize, isListNode, pluginFactory } from '@atlaskit/editor-common/utils';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type {
	EditorState,
	ReadonlyTransaction,
	Selection,
} from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { insm } from '@atlaskit/insm';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ListPlugin } from '../listPluginType';
import type { ListState } from '../types';

import { isWrappingPossible } from './utils/selection';

type EditorStateConfig = Parameters<typeof EditorState.create>[0];

const listPluginKey = new PluginKey<ListState>('listPlugin');
export const pluginKey = listPluginKey;

const initialState: ListState = {
	bulletListActive: false,
	bulletListDisabled: false,
	orderedListActive: false,
	orderedListDisabled: false,
	decorationSet: DecorationSet.empty,
};

export const computeListDecorations = (doc: Node, from = 0, to = doc.content.size) => {
	const decorations: Decoration[] = [];

	// this stack keeps track of each (nested) list to calculate the indentation level
	const processedListsStack: { node: Node; startPos: number }[] = [];

	// @ts-ignore - Workaround for help-center local consumption

	doc.nodesBetween(from, to, (node, currentNodeStartPos) => {
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

				if (digitsSize && digitsSize > 1) {
					decorations.push(
						Decoration.node(from, to, {
							style: getOrderedListInlineStyles(digitsSize, 'string'),
						}),
					);
				}
			}
		}
	});

	return decorations;
};

export const updateListDecorations = (decorationSet: DecorationSet, tr: ReadonlyTransaction) => {
	// @ts-ignore - Workaround for help-center local consumption

	let nextDecorationSet = decorationSet.map(tr.mapping, tr.doc);

	// @ts-ignore - Workaround for help-center local consumption

	tr.mapping.maps.forEach((stepMap, index) => {
		// @ts-ignore - Workaround for help-center local consumption

		stepMap.forEach((oldStart, oldEnd) => {
			// @ts-ignore - Workaround for help-center local consumption

			const start = tr.mapping.slice(index).map(oldStart, -1);
			// @ts-ignore - Workaround for help-center local consumption

			const end = tr.mapping.slice(index).map(oldEnd);

			// Remove decorations in this range
			// @ts-ignore - Workaround for help-center local consumption

			const decorationsToRemove = nextDecorationSet.find(start, end);
			nextDecorationSet = nextDecorationSet.remove(decorationsToRemove);

			// Recompute decorations for this range
			// Expand the range by 1 on each side to catch adjacent list nodes
			const from = Math.max(0, start - 1);
			const to = Math.min(tr.doc.content.size, end + 1);
			const decorationsToAdd = computeListDecorations(tr.doc, from, to);
			nextDecorationSet = nextDecorationSet.add(tr.doc, decorationsToAdd);
		});
	});

	return nextDecorationSet;
};

// delete getDecorations during platform_editor_new_list_decorations_logic experiment clean up
export const getDecorations = (
	doc: Node,
	state: EditorState,
	featureFlags: FeatureFlags,
): DecorationSet => {
	const decorations: Decoration[] = [];

	// this stack keeps track of each (nested) list to calculate the indentation level
	const processedListsStack: { node: Node; startPos: number }[] = [];

	// @ts-ignore - Workaround for help-center local consumption

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

				if (digitsSize && digitsSize > 1) {
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

const getListState = (doc: Node, selection: Selection): Omit<ListState, 'decorationSet'> => {
	const { bulletList, orderedList, taskList } = doc.type.schema.nodes;
	const listParent = findParentNodeOfType([bulletList, orderedList, taskList])(selection);

	const bulletListActive = !!listParent && listParent.node.type === bulletList;
	const orderedListActive = !!listParent && listParent.node.type === orderedList;
	const bulletListDisabled = !(
		bulletListActive ||
		orderedListActive ||
		isWrappingPossible(bulletList, selection)
	);
	const orderedListDisabled = !(
		bulletListActive ||
		orderedListActive ||
		isWrappingPossible(orderedList, selection)
	);

	return {
		bulletListActive,
		bulletListDisabled,
		orderedListActive,
		orderedListDisabled,
	};
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
	const { bulletListActive, orderedListActive, bulletListDisabled, orderedListDisabled } =
		getListState(tr.doc, tr.selection);

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

const createInitialState =
	(featureFlags: FeatureFlags, api?: ExtractInjectionAPI<ListPlugin>) => (state: EditorState) => {
		const isToolbarAIFCEnabled = Boolean(api?.toolbar);
		const getInitialDecorations = () => {
			insm.session?.startFeature('listDecorationsInit');
			const decorations = computeListDecorations(state.doc);
			insm.session?.endFeature('listDecorationsInit');
			return decorations;
		};
		return {
			// When plugin is initialised, editor state is defined with selection
			// hence returning the list state based on the selection to avoid list button in primary toolbar flickering during initial load
			...(isToolbarAIFCEnabled &&
			expValEquals('platform_editor_toolbar_aifc_patch_3', 'isEnabled', true)
				? getListState(state.doc, state.selection)
				: initialState),
			decorationSet: expValEquals('platform_editor_new_list_decorations_logic', 'isEnabled', true)
				? DecorationSet.empty.add(state.doc, getInitialDecorations())
				: getDecorations(state.doc, state, featureFlags),
		};
	};

export const createPlugin = (
	eventDispatch: Dispatch,
	featureFlags: FeatureFlags,
	api?: ExtractInjectionAPI<ListPlugin>,
): SafePlugin => {
	const { getPluginState, createPluginState } = pluginFactory(listPluginKey, reducer(), {
		onDocChanged: handleDocChanged(featureFlags),
		onSelectionChanged: handleSelectionChanged,
	});

	const pluginState = createPluginState(eventDispatch, createInitialState(featureFlags, api));

	const pluginStateInit = (_: EditorStateConfig, state: EditorState): ListState => {
		return createInitialState(featureFlags)(state);
	};

	const pluginStateApply = (
		tr: ReadonlyTransaction,
		oldPluginState: ListState,
		_oldEditorState: EditorState,
		_newEditorState: EditorState,
	): ListState => {
		let nextPluginState = oldPluginState;
		if (tr.docChanged) {
			nextPluginState = handleSelectionChanged(tr, nextPluginState);

			insm.session?.startFeature('listDecorationUpdate');
			const nextDecorationSet = updateListDecorations(nextPluginState.decorationSet, tr);
			insm.session?.endFeature('listDecorationUpdate');

			nextPluginState = {
				...nextPluginState,
				decorationSet: nextDecorationSet,
			};
		} else if (tr.selectionSet) {
			nextPluginState = handleSelectionChanged(tr, nextPluginState);
		}

		if (nextPluginState !== oldPluginState) {
			eventDispatch(listPluginKey, nextPluginState);
		}

		return nextPluginState;
	};

	return new SafePlugin({
		state: {
			init: expValEquals('platform_editor_new_list_decorations_logic', 'isEnabled', true)
				? pluginStateInit
				: pluginState.init,
			apply: expValEquals('platform_editor_new_list_decorations_logic', 'isEnabled', true)
				? pluginStateApply
				: pluginState.apply,
		},
		key: listPluginKey,
		props: {
			// @ts-ignore - Workaround for help-center local consumption

			decorations(state) {
				const { decorationSet } = expValEquals(
					'platform_editor_new_list_decorations_logic',
					'isEnabled',
					true,
				)
					? (listPluginKey.getState(state) as ListState)
					: getPluginState(state);
				return decorationSet;
			},
			// @ts-ignore - Workaround for help-center local consumption

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
