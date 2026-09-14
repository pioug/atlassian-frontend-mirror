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
import type {
	EditorState,
	ReadonlyTransaction,
	Selection,
} from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { ListPlugin } from '../listPluginType';
import type { ListState } from '../types';

import { applyListNormalisationFixes } from './transforms';
import { isWrappingPossible } from './utils/selection';

const listPluginKey = new PluginKey<ListState>('listPlugin');
export const pluginKey: PluginKey<ListState> = listPluginKey;

const initialState: ListState = {
	bulletListActive: false,
	bulletListDisabled: false,
	orderedListActive: false,
	orderedListDisabled: false,
	decorationSet: DecorationSet.empty,
	listStructureToken: 0,
};

/**
 * Numbered lists whose item counters reach 2+ digits need extra gutter spacing so the counter
 * does not collide with the item content.
 */
const getItemCounterPaddingStyle = (node: Node): string | undefined => {
	if (node.type.name !== 'orderedList') {
		return undefined;
	}
	const digitsSize = getItemCounterDigitsSize({
		itemsCount: node?.childCount,
		order: node?.attrs?.order,
	});
	return digitsSize && digitsSize > 1
		? getOrderedListInlineStyles(digitsSize, 'string')
		: undefined;
};

/**
 * Builds the decorations for a range aligned to top-level block boundaries — or for the whole
 * document, which is the same thing.
 *
 * Indentation level is no longer decorated: the `:is(ul, ol)` rules in
 * `editor-core/src/ui/EditorContentContainer/styles/list.ts` derive the marker from the list's
 * ancestors in CSS instead. All that remains is the ordered-list counter gutter, which depends on
 * the item count and start number and so cannot be expressed as a selector.
 *
 * Textblocks only hold inline content, so they can never contain a list. Skipping their subtrees
 * avoids visiting every text node in the range.
 */
const getDecorationsForRange = (doc: Node, from: number, to: number): Decoration[] => {
	const decorations: Decoration[] = [];

	doc.nodesBetween(from, to, (node, currentNodeStartPos) => {
		if (node.isTextblock) {
			return false;
		}

		const style = getItemCounterPaddingStyle(node);
		if (style) {
			decorations.push(
				Decoration.node(currentNodeStartPos, currentNodeStartPos + node.nodeSize, { style }),
			);
		}

		return true;
	});

	return decorations;
};

/**
 * Full-document rebuild on the improved path, used when the decoration set has no previous value
 * to update. The whole document is just one aligned range.
 */
export const getDecorationsForDocument = (doc: Node): DecorationSet =>
	DecorationSet.empty.add(doc, getDecorationsForRange(doc, 0, doc.content.size));

export const getDecorations = (
	doc: Node,
	_state: EditorState,
	_featureFlags: FeatureFlags,
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

/**
 * The parts of a transaction the decoration update needs, so that both `Transaction` and
 * `ReadonlyTransaction` can be passed in.
 */
type TransactionSteps = Pick<ReadonlyTransaction, 'mapping' | 'steps'>;

/**
 * Expands the ranges touched by a transaction out to whole top-level blocks. A list decoration
 * depends only on the subtree of the top-level block containing it, so recomputing whole blocks is
 * enough — and it keeps the depth calculation free of any ancestor accounting.
 */
const getDirtyTopLevelRanges = (
	tr: TransactionSteps,
	doc: Node,
): { from: number; to: number }[] => {
	const docSize = doc.content.size;
	const wholeDoc = [{ from: 0, to: docSize }];

	const boundsAt = (pos: number) => {
		// resolving a position strictly inside a block gives us its boundaries in O(depth)
		const inside = Math.max(1, Math.min(pos, Math.max(1, docSize - 1)));
		const $inside = doc.resolve(inside);
		if ($inside.depth > 0) {
			return { from: $inside.before(1), to: $inside.after(1) };
		}
		// exactly between two top-level blocks — cover both neighbours
		const $before = doc.resolve(Math.max(1, inside - 1));
		const $after = doc.resolve(Math.min(Math.max(1, docSize - 1), inside + 1));
		return {
			from: $before.depth > 0 ? $before.before(1) : 0,
			to: $after.depth > 0 ? $after.after(1) : docSize,
		};
	};

	const ranges: { from: number; to: number }[] = [];

	for (let index = 0; index < tr.steps.length; index++) {
		const step = tr.steps[index];
		// Duck-typed rather than matched on step class so that unknown step types fall back to a
		// full recompute instead of being silently skipped.
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { from, to, pos } = step as any;
		const positions: number[] =
			typeof from === 'number' && typeof to === 'number'
				? [from, to]
				: typeof pos === 'number'
					? [pos]
					: [];

		if (positions.length === 0) {
			return wholeDoc;
		}

		// Step positions are in the document before this step, so map through the later steps. The
		// range start is biased left and the end biased right, so that neither slides across a
		// block boundary and leaves a dirty block out of the recompute.
		const remainder = tr.mapping.slice(index);
		const start = boundsAt(remainder.map(Math.min(...positions), -1));
		const end = boundsAt(remainder.map(Math.max(...positions), 1));
		ranges.push({ from: Math.min(start.from, end.from), to: Math.max(start.to, end.to) });
	}

	ranges.sort((a, b) => a.from - b.from);

	const merged: { from: number; to: number }[] = [];
	for (const range of ranges) {
		const last = merged[merged.length - 1];
		if (last && range.from <= last.to) {
			last.to = Math.max(last.to, range.to);
		} else {
			merged.push({ ...range });
		}
	}
	return merged;
};

/**
 * Maps the previous decoration set through the transaction and recomputes only the top-level blocks
 * it touched, instead of rebuilding the whole set from a full document scan.
 */
export const updateDecorations = (
	previousDecorationSet: DecorationSet,
	tr: TransactionSteps,
	doc: Node,
): DecorationSet => {
	let decorationSet = previousDecorationSet.map(tr.mapping, doc);

	for (const { from, to } of getDirtyTopLevelRanges(tr, doc)) {
		// find() also returns decorations that merely touch the range, so removal is restricted to
		// the ones fully inside it — those are exactly the decorations recomputed below. Removing a
		// decoration that only touches the boundary would drop it permanently.
		const stale = decorationSet
			.find(from, to)
			.filter((decoration) => decoration.from >= from && decoration.to <= to);
		if (stale.length > 0) {
			decorationSet = decorationSet.remove(stale);
		}

		const fresh = getDecorationsForRange(doc, from, to);
		if (fresh.length > 0) {
			decorationSet = decorationSet.add(doc, fresh);
		}
	}

	return decorationSet;
};

/**
 * The selection-derived part of the plugin state. `decorationSet` and `listStructureToken` are
 * excluded because they depend on the previous state rather than on the current selection.
 */
const getListState = (
	doc: Node,
	selection: Selection,
): Omit<ListState, 'decorationSet' | 'listStructureToken'> => {
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

/**
 * Bumps `listStructureToken` only when the selection sits inside a list, so that editing a
 * document with no list involvement does not churn toolbar renders.
 */
const withListStructureToken = (nextPluginState: ListState, pluginState: ListState): number => {
	const isInList =
		nextPluginState.bulletListActive ||
		nextPluginState.orderedListActive ||
		pluginState.bulletListActive ||
		pluginState.orderedListActive;
	return isInList ? pluginState.listStructureToken + 1 : pluginState.listStructureToken;
};

const handleDocChangedOld =
	(featureFlags: FeatureFlags) =>
	(tr: ReadonlyTransaction, pluginState: ListState, editorState: EditorState): ListState => {
		const nextPluginState = handleSelectionChanged(tr, pluginState);
		return {
			...nextPluginState,
			decorationSet: getDecorations(tr.doc, editorState, featureFlags),
			listStructureToken: withListStructureToken(nextPluginState, pluginState),
		};
	};

const handleDocChangedNew =
	() =>
	(tr: ReadonlyTransaction, pluginState: ListState, editorState: EditorState): ListState => {
		const nextPluginState = handleSelectionChanged(tr, pluginState);
		return {
			...nextPluginState,
			decorationSet: updateDecorations(pluginState.decorationSet, tr, tr.doc),
			listStructureToken: withListStructureToken(nextPluginState, pluginState),
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

const createInitialStateOld =
	(featureFlags: FeatureFlags, api?: ExtractInjectionAPI<ListPlugin>) => (state: EditorState) => {
		const isToolbarAIFCEnabled = Boolean(api?.toolbar);
		return {
			// When plugin is initialised, editor state is defined with selection
			// hence returning the list state based on the selection to avoid list button in primary toolbar flickering during initial load
			...(isToolbarAIFCEnabled ? getListState(state.doc, state.selection) : initialState),
			decorationSet: getDecorations(state.doc, state, featureFlags),
			listStructureToken: 0,
		};
	};

const createInitialStateNew =
	(featureFlags: FeatureFlags, api?: ExtractInjectionAPI<ListPlugin>) => (state: EditorState) => {
		const isToolbarAIFCEnabled = Boolean(api?.toolbar);
		return {
			// When plugin is initialised, editor state is defined with selection
			// hence returning the list state based on the selection to avoid list button in primary toolbar flickering during initial load
			...(isToolbarAIFCEnabled ? getListState(state.doc, state.selection) : initialState),
			decorationSet: getDecorationsForDocument(state.doc),
			listStructureToken: 0,
		};
	};

export const createPlugin = (
	eventDispatch: Dispatch,
	featureFlags: FeatureFlags,
	api?: ExtractInjectionAPI<ListPlugin>,
): SafePlugin => {
	const { getPluginState, createPluginState } = pluginFactory(listPluginKey, reducer(), {
		// Resolved once per editor instance rather than per transaction, so the exposure event fires
		// once and the decoration hot path stays free of experiment lookups.
		onDocChanged: isExperimentEnabled('platform_editor_list_performance_improv')
			? handleDocChangedNew()
			: handleDocChangedOld(featureFlags),
		onSelectionChanged: handleSelectionChanged,
	});

	return new SafePlugin({
		state: createPluginState(
			eventDispatch,
			isExperimentEnabled('platform_editor_list_performance_improv')
				? createInitialStateNew(featureFlags, api)
				: createInitialStateOld(featureFlags, api),
		),
		key: listPluginKey,

		appendTransaction(transactions, _oldState, newState) {
			if (!expValEqualsNoExposure('platform_editor_flexible_list_schema', 'isEnabled', true)) {
				return null;
			}
			if (!transactions.some((t) => t.docChanged)) {
				return null;
			}
			// Efficiently scans only affected list nodes — exits early if none are found.
			const tr = applyListNormalisationFixes({
				tr: newState.tr,
				transactions,
				doc: newState.doc,
				schema: newState.schema,
			});
			if (tr.docChanged) {
				return tr;
			}
			return null;
		},

		props: {
			decorations(state: EditorState) {
				const { decorationSet } = getPluginState(state);
				return decorationSet;
			},
			handleClick: (view: EditorView, pos: number, event: MouseEvent) => {
				const { state } = view;
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				if (['LI', 'UL'].includes((event?.target as HTMLElement).tagName)) {
					const nodeAtPos = state.tr.doc.nodeAt(pos);
					const { listItem, codeBlock } = view.state.schema.nodes;
					if (nodeAtPos?.type === listItem && nodeAtPos?.firstChild?.type === codeBlock) {
						const bufferPx = 50;
						const isCodeBlockNextToListMarker = Boolean(
							// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
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
