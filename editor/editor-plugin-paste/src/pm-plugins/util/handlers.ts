// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';

import type { MentionAttributes } from '@atlaskit/adf-schema';
import type { EditorAnalyticsAPI, InputMethodInsertMedia } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { CardOptions, QueueCardsFromTransactionAction } from '@atlaskit/editor-common/card';
import { insideTable } from '@atlaskit/editor-common/core-utils';
import type { ExtensionAutoConvertHandler } from '@atlaskit/editor-common/extensions';
import { anyMarkActive } from '@atlaskit/editor-common/mark';
import {
	getParentOfTypeCount,
	getPositionAfterTopParentNodeOfType,
} from '@atlaskit/editor-common/nesting';
import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import type { Command, CommandDispatch } from '@atlaskit/editor-common/types';
import {
	canLinkBeCreatedInRange,
	insideTableCell,
	isInListItem,
	isLinkMark,
	isListItemNode,
	isListNode,
	isNodeEmpty,
	isParagraph,
	isText,
	linkifyContent,
	mapSlice,
} from '@atlaskit/editor-common/utils';
import type { RunMacroAutoConvert } from '@atlaskit/editor-plugin-extension';
import type { FindRootParentListNode } from '@atlaskit/editor-plugin-list';
import type { InsertMediaAsMediaSingle } from '@atlaskit/editor-plugin-media/types';
import { Fragment, Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Mark, MarkType, Schema } from '@atlaskit/editor-prosemirror/model';
import { AllSelection, NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import {
	canInsert,
	contains,
	findParentNodeOfType,
	findParentNodeOfTypeClosestToPos,
	hasParentNode,
	hasParentNodeOfType,
	safeInsert,
} from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { replaceSelectedTable } from '@atlaskit/editor-tables/utils';
import type { CardAdf, CardAppearance, DatasourceAdf } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';
import { closeHistory } from '@atlaskit/prosemirror-history';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
// TODO: ED-20519 - Needs Macro extraction

import {
	startTrackingPastedMacroPositions,
	stopTrackingPastedMacroPositions,
} from '../../editor-commands/commands';
import { getPluginState as getPastePluginState } from '../plugin-factory';

import {
	insertSliceForLists,
	insertSliceForTaskInsideList,
	insertSliceInsideBlockquote,
	updateSelectionAfterReplace,
} from './edge-cases';
import { insertSliceInsideOfPanelNodeSelected } from './edge-cases/lists';

import {
	addReplaceSelectedTableAnalytics,
	applyTextMarksToSlice,
	hasOnlyNodesOfType,
	isEmptyNode,
	isSelectionInsidePanel,
} from './index';

const insideExpand = (state: EditorState): Boolean => {
	const { expand, nestedExpand } = state.schema.nodes;

	return hasParentNodeOfType([expand, nestedExpand])(state.selection);
};

/** Helper type for single arg function */
type Func<A, B> = (a: A) => B;

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Compose 1 to n functions.
 * @param func first function
 * @param funcs additional functions
 */
function compose<
	F1 extends Func<any, any>,
	FN extends Array<Func<any, any>>,
	R extends FN extends []
		? F1
		: FN extends [Func<infer A, any>]
			? (a: A) => ReturnType<F1>
			: FN extends [any, Func<infer A, any>]
				? (a: A) => ReturnType<F1>
				: FN extends [any, any, Func<infer A, any>]
					? (a: A) => ReturnType<F1>
					: FN extends [any, any, any, Func<infer A, any>]
						? (a: A) => ReturnType<F1>
						: FN extends [any, any, any, any, Func<infer A, any>]
							? (a: A) => ReturnType<F1>
							: Func<any, ReturnType<F1>>, // Doubtful we'd ever want to pipe this many functions, but in the off chance someone does, we can still infer the return type
>(func: F1, ...funcs: FN): R {
	const allFuncs = [func, ...funcs];
	return function composed(raw: any) {
		return allFuncs.reduceRight((memo, func) => func(memo), raw);
	} as R;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// remove text attribute from mention for copy/paste (GDPR)
export function handleMention(slice: Slice, schema: Schema): Slice {
	return mapSlice(slice, (node) => {
		// We should move this to the mention plugin when we refactor how paste works in the future
		// For now we can just null check mention exists in the schema to ensure we don't crash if it doesn't
		// exist.
		if (node.type.name === schema.nodes.mention?.name) {
			const mention = node.attrs as MentionAttributes;
			const newMention = { ...mention, text: '' };
			return schema.nodes.mention.create(newMention, node.content, node.marks);
		}
		return node;
	});
}

export function handlePasteIntoTaskOrDecisionOrPanel(
	slice: Slice,
	queueCardsFromChangedTr: QueueCardsFromTransactionAction | undefined,
): Command {
	return (state: EditorState, dispatch?: CommandDispatch): boolean => {
		const {
			schema,
			tr: { selection },
		} = state;

		const {
			marks: { code: codeMark },
			nodes: {
				decisionItem,
				emoji,
				hardBreak,
				mention,
				paragraph,
				taskItem,
				text,
				panel,
				bulletList,
				orderedList,
				taskList,
				listItem,
				expand,
				heading,
				codeBlock,
			},
		} = schema;

		const selectionIsValidNode =
			state.selection instanceof NodeSelection &&
			['decisionList', 'decisionItem', 'taskList', 'taskItem'].includes(
				state.selection.node.type.name,
			);
		const selectionHasValidParentNode = hasParentNodeOfType([decisionItem, taskItem, panel])(
			state.selection,
		);
		const selectionIsCodeBlock = hasParentNodeOfType([codeBlock])(state.selection);
		const selectionIsListItem = hasParentNodeOfType([listItem])(state.selection);
		const panelNode = isSelectionInsidePanel(selection);
		const selectionIsPanel = Boolean(panelNode);
		const isSliceWholePanel =
			slice.content.firstChild?.type === panel && slice.openStart === 0 && slice.openEnd === 0;

		// we avoid handling codeBlock-in-panel use case in this function
		// returning false will allow code to flow into `handleCodeBlock` function
		// Partial content copied from panels will have panel in the slice
		// Return false to avoid handling this situation when pasted into list in panel and let `handlePastePanelOrDecisionContentIntoList` handle it
		if (
			selectionIsPanel &&
			(selectionIsCodeBlock ||
				(selectionIsListItem &&
					!isSliceWholePanel &&
					expValEquals('platform_editor_pasting_text_in_panel', 'isEnabled', true)))
		) {
			return false;
		}

		// Some types of content should be handled by the default handler, not this function.
		// Check through slice content to see if it contains an invalid node.
		let sliceIsInvalid = false;
		let sliceHasTask = false;

		slice.content.nodesBetween(0, slice.content.size, (node) => {
			if (
				node.type === bulletList ||
				node.type === orderedList ||
				node.type === expand ||
				node.type === heading ||
				node.type === listItem
			) {
				sliceIsInvalid = true;
			}
			if (selectionIsPanel && node.type === taskList) {
				sliceHasTask = true;
			}
		});
		// If the selection is a panel,
		// and the slice's first node is a paragraph
		// and it is not from a depth that would indicate it being from inside from another node (e.g. text from a decision)
		// then we can rely on the default behaviour.
		const selectionIsTaskOrDecision = hasParentNode(
			(node) => node.type === taskItem || node.type === decisionItem,
		)(selection);

		const sliceIsAPanelReceivingLowDepthText =
			selectionIsPanel &&
			!selectionIsTaskOrDecision &&
			slice.content.firstChild?.type === paragraph &&
			slice.openEnd < 2;

		if (
			sliceIsInvalid ||
			sliceIsAPanelReceivingLowDepthText ||
			(!selectionIsValidNode && !selectionHasValidParentNode)
		) {
			return false;
		}

		type Fn = (slice: Slice) => Slice;
		const filters: [Fn, ...Array<Fn>] = [linkifyContent(schema)];

		const selectionMarks = selection.$head.marks();

		if (
			selection instanceof TextSelection &&
			Array.isArray(selectionMarks) &&
			selectionMarks.length > 0 &&
			hasOnlyNodesOfType(paragraph, text, emoji, mention, hardBreak)(slice) &&
			(!codeMark.isInSet(selectionMarks) || anyMarkActive(state, codeMark)) // check if there is a code mark anywhere in the selection
		) {
			filters.push(applyTextMarksToSlice(schema, selection.$head.marks()));
		}

		const transformedSlice = compose.apply(null, filters)(slice);
		const isFirstChildTaskNode =
			transformedSlice.content.firstChild.type === taskList ||
			transformedSlice.content.firstChild.type === taskItem;

		const tr = closeHistory(state.tr);
		if (
			panelNode &&
			sliceHasTask &&
			slice.content.firstChild?.type === panel &&
			isEmptyNode(panelNode) &&
			selection.$from.node() === selection.$to.node()
		) {
			return Boolean(insertSliceInsideOfPanelNodeSelected(panelNode)({ tr, slice }));
		}
		const transformedSliceIsValidNode =
			(transformedSlice.content.firstChild.type.inlineContent ||
				['decisionList', 'decisionItem', 'taskItem', 'taskList', 'panel'].includes(
					transformedSlice.content.firstChild.type.name,
				)) &&
			(!isInListItem(state) || (isInListItem(state) && isFirstChildTaskNode));
		// If the slice or the selection are valid nodes to handle,
		// and the slice is not a whole node (i.e. openStart is 1 and openEnd is 0)
		// or the slice's first node is a paragraph,
		// then we can replace the selection with our slice.
		const pastingIntoExtendedPanel =
			selectionIsPanel && panel.validContent(transformedSlice.content);
		if (
			((transformedSliceIsValidNode || selectionIsValidNode) &&
				!pastingIntoExtendedPanel &&
				!(
					(transformedSlice.openStart === 1 && transformedSlice.openEnd === 0) ||
					// Whole codeblock node has reverse slice depths.
					(transformedSlice.openStart === 0 && transformedSlice.openEnd === 1)
				)) ||
			transformedSlice.content.firstChild?.type === paragraph
		) {
			tr.replaceSelection(transformedSlice).scrollIntoView();
		} else {
			const isWholeContentSelected =
				selection.$from.pos === selection.$from.start() &&
				selection.$to.end() === selection.$to.pos;
			if (
				pastingIntoExtendedPanel &&
				selection.$from.pos !== selection.$to.pos &&
				!isWholeContentSelected
			) {
				// Do a replaceSelection if the entire panel content isn't selected
				//tr.replaceSelection(transformedSlice).scrollIntoView();
				tr.replaceSelection(
					new Slice(transformedSlice.content, 0, transformedSlice.openEnd),
				).scrollIntoView();
			} else if (
				['mediaSingle'].includes(transformedSlice.content.firstChild.type.name) &&
				selectionIsPanel
			) {
				const parentNode = findParentNodeOfType(panel)(selection);
				if (selectionIsPanel && parentNode && isNodeEmpty(parentNode.node)) {
					tr.insert(selection.$from.pos, transformedSlice.content).scrollIntoView();
					// Place the cursor at the the end of the insersertion
					const endPos = tr.selection.from + transformedSlice.size;
					tr.setSelection(new TextSelection(tr.doc.resolve(endPos)));
				} else {
					tr.replaceSelection(transformedSlice).scrollIntoView();
				}
			} else {
				if (pastingIntoExtendedPanel && isWholeContentSelected) {
					// if the entire panel content is selected, doing a replaceSelection removes the panel as well. Hence we do delete followed by safeInsert
					tr.delete(selection.$from.pos, selection.$to.pos);
				}
				// This maintains both the selection (destination) and the slice (paste content).
				safeInsert(transformedSlice.content)(tr).scrollIntoView();
				if (transformedSlice.content.lastChild?.type?.name === 'rule') {
					tr.setSelection(
						TextSelection.near(
							tr.doc.resolve(tr.selection.$from.pos + transformedSlice.content.size),
						),
					);
				} else {
					// safeInsert doesn't set correct cursor position
					// it moves the cursor to beginning of the node
					// we manually shift the cursor to end of the node
					const nextPos = tr.doc.resolve(tr.selection.$from.end());
					tr.setSelection(new TextSelection(nextPos));
				}
			}
		}

		queueCardsFromChangedTr?.(state, tr, INPUT_METHOD.CLIPBOARD);
		if (dispatch) {
			dispatch(tr);
		}
		return true;
	};
}

export function handlePasteNonNestableBlockNodesIntoList(slice: Slice): Command {
	return (state: EditorState, dispatch?: CommandDispatch): boolean => {
		const { tr } = state;
		const { selection } = tr;
		const { $from, $to, from, to } = selection;
		const { orderedList, bulletList, listItem } = state.schema.nodes;

		// Selected nodes
		const selectionParentListItemNode = findParentNodeOfType(listItem)(selection);
		const selectionParentListNodeWithPos = findParentNodeOfType([bulletList, orderedList])(
			selection,
		);
		const selectionParentListNode = selectionParentListNodeWithPos?.node;

		// Slice info
		const sliceContent = slice.content;
		const sliceIsListItems =
			isListNode(sliceContent.firstChild) && isListNode(sliceContent.lastChild);

		// Find case of slices that can be inserted into a list item
		// (eg. paragraphs, list items, code blocks, media single)
		// These scenarios already get handled elsewhere and don't need to split the list
		let sliceContainsBlockNodesOtherThanThoseAllowedInListItem = false;
		slice.content.forEach((child) => {
			if (!listItem || (child.isBlock && !listItem.spec.content?.includes(child.type.name))) {
				sliceContainsBlockNodesOtherThanThoseAllowedInListItem = true;
			}
		});

		if (
			!selectionParentListItemNode ||
			!sliceContent ||
			canInsert($from, sliceContent) || // eg. inline nodes that can be inserted in a list item
			!sliceContainsBlockNodesOtherThanThoseAllowedInListItem ||
			sliceIsListItems ||
			!selectionParentListNodeWithPos
		) {
			return false;
		}

		// Offsets
		const listWrappingOffset = $to.depth - selectionParentListNodeWithPos.depth + 1; // difference in depth between to position and list node
		const listItemWrappingOffset = $to.depth - selectionParentListNodeWithPos.depth; // difference in depth between to position and list item node

		// Anything to do with nested lists should safeInsert and not be handled here
		if (checkIfSelectionInNestedList(state)) {
			return false;
		}

		// Node after the insert position
		const nodeAfterInsertPositionIsListItem =
			tr.doc.nodeAt(to + listItemWrappingOffset)?.type.name === 'listItem';

		// Get the next list items position (used later to find the split out ordered list)
		const indexOfNextListItem = $to.indexAfter($to.depth - listItemWrappingOffset);
		const positionOfNextListItem = tr.doc
			.resolve(selectionParentListNodeWithPos.pos + 1)
			.posAtIndex(indexOfNextListItem);

		// These nodes paste as plain text by default so need to be handled differently
		const sliceContainsNodeThatPastesAsPlainText =
			sliceContent.firstChild &&
			['taskItem', 'taskList', 'heading', 'blockquote'].includes(sliceContent.firstChild.type.name);

		// Work out position to replace up to
		let replaceTo;
		if (sliceContainsNodeThatPastesAsPlainText && nodeAfterInsertPositionIsListItem) {
			replaceTo = to + listItemWrappingOffset;
		} else if (sliceContainsNodeThatPastesAsPlainText || !nodeAfterInsertPositionIsListItem) {
			replaceTo = to;
		} else {
			replaceTo = to + listWrappingOffset;
		}

		// handle the insertion of the slice
		if (
			slice.content.firstChild?.type.name === 'blockquote' &&
			contains(slice.content.firstChild, state.schema.nodes.listItem)
		) {
			insertSliceInsideBlockquote({ tr, slice });
		} else if (
			sliceContainsNodeThatPastesAsPlainText ||
			nodeAfterInsertPositionIsListItem ||
			(sliceContent.childCount > 1 && sliceContent.firstChild?.type.name !== 'paragraph')
		) {
			tr.replaceWith(from, replaceTo, sliceContent).scrollIntoView();
		} else {
			// When the selection is not at the end of a list item
			// eg. middle of list item, start of list item
			tr.replaceSelection(slice).scrollIntoView();
		}

		// Find the ordered list node after the pasted content so we can set it's order
		const mappedPositionOfNextListItem = tr.mapping.map(positionOfNextListItem);
		if (mappedPositionOfNextListItem > tr.doc.nodeSize) {
			return false;
		}
		const nodeAfterPastedContentResolvedPos = findParentNodeOfTypeClosestToPos(
			tr.doc.resolve(mappedPositionOfNextListItem),
			[orderedList],
		);

		// Work out the new split out lists 'order' (the number it starts from)
		const originalParentOrderedListNodeOrder = selectionParentListNode?.attrs.order;
		const numOfListItemsInOriginalList = findParentNodeOfTypeClosestToPos(
			tr.doc.resolve(from - 1),
			[orderedList],
		)?.node.childCount;

		// Set the new split out lists order attribute
		if (
			typeof originalParentOrderedListNodeOrder === 'number' &&
			numOfListItemsInOriginalList &&
			nodeAfterPastedContentResolvedPos
		) {
			tr.setNodeMarkup(nodeAfterPastedContentResolvedPos.pos, orderedList, {
				...nodeAfterPastedContentResolvedPos.node.attrs,
				order: originalParentOrderedListNodeOrder + numOfListItemsInOriginalList,
			});
		}

		// dispatch transaction
		if (tr.docChanged) {
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}

		return false;
	};
}

export const doesSelectionWhichStartsOrEndsInListContainEntireList = (
	selection: Selection,
	findRootParentListNode: FindRootParentListNode | undefined,
): boolean => {
	const { $from, $to, from, to } = selection;
	const selectionParentListItemNodeResolvedPos = findRootParentListNode
		? findRootParentListNode($from) || findRootParentListNode($to)
		: null;

	const selectionParentListNode = selectionParentListItemNodeResolvedPos?.parent;

	if (!selectionParentListItemNodeResolvedPos || !selectionParentListNode) {
		return false;
	}

	const startOfEntireList =
		$from.pos < $to.pos
			? selectionParentListItemNodeResolvedPos.pos + $from.depth - 1
			: selectionParentListItemNodeResolvedPos.pos + $to.depth - 1;
	const endOfEntireList =
		$from.pos < $to.pos
			? selectionParentListItemNodeResolvedPos.pos +
				selectionParentListNode.nodeSize -
				$to.depth -
				1
			: selectionParentListItemNodeResolvedPos.pos +
				selectionParentListNode.nodeSize -
				$from.depth -
				1;

	if (!startOfEntireList || !endOfEntireList) {
		return false;
	}

	if (from < to) {
		return startOfEntireList >= $from.pos && endOfEntireList <= $to.pos;
	} else if (from > to) {
		return startOfEntireList >= $to.pos && endOfEntireList <= $from.pos;
	} else {
		return false;
	}
};

export function handlePastePanelOrDecisionContentIntoList(
	slice: Slice,
	findRootParentListNode: FindRootParentListNode | undefined,
): Command {
	return (state: EditorState, dispatch?: CommandDispatch): boolean => {
		const { schema, tr } = state;
		const { selection } = tr;
		// Check this pasting action is related to copy content from panel node into a selected the list node
		const blockNode = slice.content.firstChild;
		const isSliceWholeNode = slice.openStart === 0 && slice.openEnd === 0;
		const selectionParentListItemNode = selection.$to.node(selection.$to.depth - 1);

		const sliceIsWholeNodeButShouldNotReplaceSelection =
			isSliceWholeNode &&
			!doesSelectionWhichStartsOrEndsInListContainEntireList(selection, findRootParentListNode);

		if (
			!selectionParentListItemNode ||
			selectionParentListItemNode?.type !== schema.nodes.listItem ||
			!blockNode ||
			!['panel', 'decisionList'].includes(blockNode?.type.name) ||
			slice.content.childCount > 1 ||
			blockNode?.content.firstChild === undefined ||
			sliceIsWholeNodeButShouldNotReplaceSelection
		) {
			return false;
		}

		// Paste the panel node contents extracted instead of pasting the entire panel node
		tr.replaceSelection(slice).scrollIntoView();
		if (dispatch) {
			dispatch(tr);
		}
		return true;
	};
}

const innerTextRangeOfTextblock = (
	doc: PMNode,
	posOfBlock: number,
): { from: number; to: number } | null => {
	const block = doc.nodeAt(posOfBlock);
	if (!block || !block.isTextblock) {
		return null;
	}

	// raw content bounds
	const contentStart = posOfBlock + 1; // +1 to move from node's start token to content start
	const contentEnd = contentStart + block.content.size;

	// clamp to doc coord space
	const start = Math.max(0, Math.min(contentStart, doc.content.size));
	const end = Math.max(0, Math.min(contentEnd, doc.content.size));
	if (end <= start) {
		return null;
	}

	// snap to nearest valid text positions
	const startSel = TextSelection.findFrom(doc.resolve(start), 1, true);
	const endSel = TextSelection.findFrom(doc.resolve(end), -1, true);
	if (!startSel || !endSel) {
		return null;
	}

	const from = startSel.$from.pos;
	const to = endSel.$to.pos;
	return to > from ? { from, to } : null;
};

function resolveSingleTextblockRangeIfAllSelected(
	state: EditorState,
): { from: number; to: number } | null {
	const sel = state.selection;
	if (!(sel instanceof AllSelection)) {
		return null;
	}

	let count = 0;
	let posOfBlock = -1;

	state.doc.nodesBetween(sel.from, sel.to, (node: PMNode, pos) => {
		if (!node.isTextblock) {
			return true;
		}
		count++;
		if (count > 1) {
			return false;
		}
		posOfBlock = pos;
		return true;
	});

	if (count !== 1) {
		return null;
	}

	return innerTextRangeOfTextblock(state.doc, posOfBlock);
}

// If we paste a link onto some selected text, apply the link as a mark
export function handlePasteLinkOnSelectedText(slice: Slice): Command {
	return (state, dispatch) => {
		const {
			schema,
			selection,
			selection: { from, to },
			tr,
		} = state;
		let linkMark;

		// check if we have a link on the clipboard
		if (slice.content.childCount === 1 && isParagraph(slice.content.child(0), schema)) {
			const paragraph = slice.content.child(0);
			if (paragraph.content.childCount === 1 && isText(paragraph.content.child(0), schema)) {
				const text = paragraph.content.child(0);

				// If pasteType is plain text, then
				//  @atlaskit/editor-markdown-transformer in getMarkdownSlice decode
				//  url before setting text property of text node.
				//  However href of marks will be without decoding.
				//  So, if there is character (e.g space) in url eligible escaping then
				//  mark.attrs.href will not be equal to text.text.
				//  That's why decoding mark.attrs.href before comparing.
				// However, if pasteType is richText, that means url in text.text
				//  and href in marks, both won't be decoded.
				linkMark = text.marks.find(
					(mark) =>
						isLinkMark(mark, schema) &&
						(mark.attrs.href === text.text || decodeURI(mark.attrs.href) === text.text),
				);
			}
		}

		// derive a linkable range if possible for Select‑All over a single textblock
		const selectAllRange = fg('platform_editor_link_paste_select_all')
			? resolveSingleTextblockRangeIfAllSelected(state)
			: null;

		const rangeFrom = selectAllRange?.from ?? from;
		const rangeTo = selectAllRange?.to ?? to;

		// if we have a link, apply it to the selected text if we have any and it's allowed
		if (
			linkMark &&
			(selection instanceof TextSelection || Boolean(selectAllRange)) &&
			!selection.empty &&
			canLinkBeCreatedInRange(rangeFrom, rangeTo)(state)
		) {
			tr.addMark(rangeFrom, rangeTo, linkMark);
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}

		return false;
	};
}

export function handlePasteAsPlainText(
	slice: Slice,
	_event: ClipboardEvent,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Command {
	return (state: EditorState, dispatch?, view?: EditorView): boolean => {
		if (!view) {
			return false;
		}

		// prosemirror-bump-fix
		// Yes, this is wrong by default. But, we need to keep the private PAI usage to unblock the prosemirror bump
		// So, this code will make sure we are checking for both version (current and the newest prosemirror-view version
		const isShiftKeyPressed =
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(view as any).shiftKey || (view as any).input?.shiftKey;
		// In case of SHIFT+CMD+V ("Paste and Match Style") we don't want to run the usual
		// fuzzy matching of content. ProseMirror already handles this scenario and will
		// provide us with slice containing paragraphs with plain text, which we decorate
		// with "stored marks".
		// @see prosemirror-view/src/clipboard.js:parseFromClipboard()).
		// @see prosemirror-view/src/input.js:doPaste().
		if (isShiftKeyPressed) {
			let tr = closeHistory(state.tr);

			const { selection } = tr;

			// <- using the same internal flag that prosemirror-view is using

			// if user has selected table we need custom logic to replace the table
			tr = replaceSelectedTable(state, slice);

			// add analytics after replacing selected table
			tr = addReplaceSelectedTableAnalytics(state, tr, editorAnalyticsAPI);

			// otherwise just replace the selection
			if (!tr.docChanged) {
				tr.replaceSelection(slice);
			}

			(state.storedMarks || []).forEach((mark) => {
				tr.addMark(selection.from, selection.from + slice.size, mark);
			});
			tr.scrollIntoView();
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}
		return false;
	};
}

export function handlePastePreservingMarks(
	slice: Slice,
	queueCardsFromChangedTr: QueueCardsFromTransactionAction | undefined,
): Command {
	return (state: EditorState, dispatch?): boolean => {
		const {
			schema,
			tr: { selection },
		} = state;

		const {
			marks: { code: codeMark, annotation: annotationMark },
			nodes: { bulletList, emoji, hardBreak, heading, listItem, mention, orderedList, text },
		} = schema;

		if (!(selection instanceof TextSelection)) {
			return false;
		}

		const selectionMarks = selection.$head.marks();
		if (selectionMarks.length === 0) {
			return false;
		}

		// special case for codeMark: will preserve mark only if codeMark is currently active
		// won't preserve mark if cursor is on the edge on the mark (namely inactive)
		const hasActiveCodeMark =
			codeMark && codeMark.isInSet(selectionMarks) && anyMarkActive(state, codeMark);
		const hasAnnotationMark = annotationMark && annotationMark.isInSet(selectionMarks);
		const selectionIsHeading = hasParentNodeOfType([heading])(state.selection);

		// if the pasted data is one of the node types below
		// we apply current selection marks to the pasted slice
		if (
			hasOnlyNodesOfType(
				bulletList,
				hardBreak,
				heading,
				listItem,
				text,
				emoji,
				mention,
				orderedList,
			)(slice) ||
			selectionIsHeading ||
			hasActiveCodeMark ||
			hasAnnotationMark
		) {
			const transformedSlice = applyTextMarksToSlice(schema, selectionMarks)(slice);

			const tr = closeHistory(state.tr)
				.replaceSelection(transformedSlice)
				.setStoredMarks(selectionMarks)
				.scrollIntoView();

			queueCardsFromChangedTr?.(state, tr, INPUT_METHOD.CLIPBOARD);
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}

		return false;
	};
}

async function getSmartLinkAdf(
	text: string,
	type: CardAppearance,
	cardOptions: CardOptions,
): Promise<CardAdf | DatasourceAdf> {
	if (!cardOptions.provider) {
		throw Error('No card provider found');
	}
	const provider = await cardOptions.provider;
	return await provider.resolve(text, type);
}

function insertAutoMacro(
	slice: Slice,
	macro: PMNode,
	view?: EditorView,
	from?: number,
	to?: number,
): boolean {
	if (view) {
		// insert the text or linkified/md-converted clipboard data
		const selection = view.state.tr.selection;
		let tr: Transaction;
		let before: number;
		if (typeof from === 'number' && typeof to === 'number') {
			tr = view.state.tr.replaceRange(from, to, slice);
			before = tr.mapping.map(from, -1);
		} else {
			tr = view.state.tr.replaceSelection(slice);
			before = tr.mapping.map(selection.from, -1);
		}
		view.dispatch(tr);

		// replace the text with the macro as a separate transaction
		// so the autoconversion generates 2 undo steps
		view.dispatch(
			closeHistory(view.state.tr)
				.replaceRangeWith(before, before + slice.size, macro)
				.scrollIntoView(),
		);
		return true;
	}
	return false;
}

export function handleMacroAutoConvert(
	text: string,
	slice: Slice,
	queueCardsFromChangedTr: QueueCardsFromTransactionAction | undefined,
	runMacroAutoConvert: RunMacroAutoConvert | undefined,
	cardsOptions?: CardOptions,
	extensionAutoConverter?: ExtensionAutoConvertHandler,
): Command {
	return (state: EditorState, dispatch?: CommandDispatch, view?: EditorView) => {
		let macro: PMNode | null = null;

		// try to use auto convert from extension provider first
		if (extensionAutoConverter) {
			const extension = extensionAutoConverter(text);
			if (extension) {
				macro = PMNode.fromJSON(state.schema, extension);
			}
		}

		// then try from macro provider (which will be removed some time in the future)
		if (!macro) {
			macro = runMacroAutoConvert?.(state, text) ?? null;
		}

		if (macro) {
			/**
			 * if FF enabled, run through smart links and check for result
			 */
			if (
				cardsOptions &&
				cardsOptions.resolveBeforeMacros &&
				cardsOptions.resolveBeforeMacros.length
			) {
				if (cardsOptions.resolveBeforeMacros.indexOf(macro.attrs.extensionKey) < 0) {
					return insertAutoMacro(slice, macro, view);
				}

				if (!view) {
					throw new Error('View is missing');
				}

				// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
				const trackingId = uuid();
				const trackingFrom = `handleMacroAutoConvert-from-${trackingId}`;
				const trackingTo = `handleMacroAutoConvert-to-${trackingId}`;

				startTrackingPastedMacroPositions({
					[trackingFrom]: state.selection.from,
					[trackingTo]: state.selection.to,
				})(state, dispatch);

				getSmartLinkAdf(text, 'inline', cardsOptions)
					.then(() => {
						// we use view.state rather than state because state becomes a stale
						// state reference after getSmartLinkAdf's async work
						const { pastedMacroPositions } = getPastePluginState(view.state);
						if (dispatch) {
							handleMarkdown(
								slice,
								queueCardsFromChangedTr,
								pastedMacroPositions[trackingFrom],
								pastedMacroPositions[trackingTo],
							)(view.state, dispatch);
						}
					})
					.catch(() => {
						const { pastedMacroPositions } = getPastePluginState(view.state);
						insertAutoMacro(
							slice,
							macro as PMNode,
							view,
							pastedMacroPositions[trackingFrom],
							pastedMacroPositions[trackingTo],
						);
					})
					.finally(() => {
						stopTrackingPastedMacroPositions([trackingFrom, trackingTo])(view.state, dispatch);
					});
				return true;
			}

			return insertAutoMacro(slice, macro, view);
		}
		return !!macro;
	};
}

export function handleCodeBlock(text: string): Command {
	return (state, dispatch) => {
		const { codeBlock } = state.schema.nodes;
		if (text && hasParentNodeOfType(codeBlock)(state.selection)) {
			const tr = closeHistory(state.tr);

			tr.scrollIntoView();
			if (dispatch) {
				dispatch(tr.insertText(text));
			}
			return true;
		}
		return false;
	};
}

function isOnlyMedia(state: EditorState, slice: Slice) {
	const { media } = state.schema.nodes;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return slice.content.childCount === 1 && slice.content.firstChild!.type === media;
}

function isOnlyMediaSingle(state: EditorState, slice: Slice) {
	const { mediaSingle } = state.schema.nodes;
	return (
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		mediaSingle && slice.content.childCount === 1 && slice.content.firstChild!.type === mediaSingle
	);
}

export function handleMediaSingle(
	inputMethod: InputMethodInsertMedia,
	insertMediaAsMediaSingle: InsertMediaAsMediaSingle | undefined,
) {
	return function (slice: Slice): Command {
		return (state, dispatch, view) => {
			if (view) {
				if (isOnlyMedia(state, slice)) {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					return insertMediaAsMediaSingle?.(view, slice.content.firstChild!, inputMethod) ?? false;
				}

				if (insideTable(state) && isOnlyMediaSingle(state, slice)) {
					const tr = state.tr.replaceSelection(slice);
					const nextPos = tr.doc.resolve(tr.mapping.map(state.selection.$from.pos));
					if (dispatch) {
						dispatch(tr.setSelection(new GapCursorSelection(nextPos, Side.RIGHT)));
					}
					return true;
				}
			}
			return false;
		};
	};
}

const hasTopLevelExpand = (slice: Slice): boolean => {
	let hasExpand = false;
	slice.content.forEach((node: PMNode) => {
		if (node.type.name === 'expand' || node.type.name === 'nestedExpand') {
			hasExpand = true;
		}
	});
	return hasExpand;
};

export function handleTableContentPasteInBodiedExtension(slice: Slice): Command {
	return (state, dispatch) => {
		const isInsideBodyExtension = hasParentNodeOfType(state.schema.nodes.bodiedExtension)(
			state.selection,
		);

		if (!insideTable(state) || !isInsideBodyExtension) {
			return false;
		}

		const { bodiedExtension } = state.schema.nodes;
		const newSlice = mapSlice(slice, (maybeNode) => {
			if (maybeNode.type === bodiedExtension) {
				return bodiedExtension.createChecked(maybeNode.attrs, maybeNode.content, maybeNode.marks);
			}
			return maybeNode;
		});

		if (dispatch) {
			dispatch(state.tr.replaceSelection(newSlice));
			return true;
		}
		return false;
	};
}

export function handleNestedTablePaste(slice: Slice, isNestingTablesSupported?: boolean): Command {
	return (state, dispatch) => {
		if (!isNestingTablesSupported || !insideTable(state)) {
			return false;
		}

		const { schema, selection } = state;

		let sliceHasTable = false;

		slice.content.forEach((node) => {
			if (node.type === state.schema.nodes.table) {
				sliceHasTable = true;
			}
		});

		if (sliceHasTable) {
			if (
				editorExperiment('nested-tables-in-tables', true, {
					exposure: true,
				})
			) {
				/* TEST COHORT */
				// if slice has table - if pasting to deeply nested location place paste after top table
				if (getParentOfTypeCount(schema.nodes.table)(selection.$from) > 1) {
					const positionAfterTopTable = getPositionAfterTopParentNodeOfType(schema.nodes.table)(
						selection.$from,
					);

					let { tr } = state;
					tr = safeInsert(slice.content, positionAfterTopTable)(tr);
					tr.scrollIntoView();

					if (dispatch) {
						dispatch(tr);
						return true;
					}
				}
			} else {
				/* CONTROL COHORT */
				// if slice has table - place paste after top table
				const positionAfterTopTable = getPositionAfterTopParentNodeOfType(schema.nodes.table)(
					selection.$from,
				);

				let { tr } = state;
				tr = safeInsert(slice.content, positionAfterTopTable)(tr);
				tr.scrollIntoView();

				if (dispatch) {
					dispatch(tr);
					return true;
				}
			}
		}

		return false;
	};
}

export function handleExpandPaste(slice: Slice): Command {
	return (state, dispatch) => {
		const isInsideNestableExpand = !!insideExpand(state);

		// Do not handle expand if it's not being pasted into a table or expand
		// OR if it's nested within another node when being pasted into a table/expand
		if ((!insideTable(state) && !isInsideNestableExpand) || !hasTopLevelExpand(slice)) {
			return false;
		}

		const { expand, nestedExpand } = state.schema.nodes;
		let { tr } = state;
		let hasExpand = false;

		const newSlice = mapSlice(slice, (maybeNode) => {
			if (maybeNode.type === expand || maybeNode.type === nestedExpand) {
				hasExpand = true;
				try {
					return nestedExpand.createChecked(maybeNode.attrs, maybeNode.content, maybeNode.marks);
				} catch (e) {
					tr = safeInsert(maybeNode, tr.selection.$to.pos)(tr);
					return Fragment.empty;
				}
			}
			return maybeNode;
		});

		if (hasExpand && dispatch) {
			// If the slice is a subset, we can let PM replace the selection
			// it will insert as text where it can't place the node.
			// Otherwise we use safeInsert to insert below instead of
			// replacing/splitting the current node.
			if (slice.openStart > 1 && slice.openEnd > 1) {
				dispatch(tr.replaceSelection(newSlice));
			} else {
				dispatch(safeInsert(newSlice.content)(tr));
			}
			return true;
		}
		return false;
	};
}

export function handleMarkdown(
	markdownSlice: Slice,
	queueCardsFromChangedTr: QueueCardsFromTransactionAction | undefined,
	from?: number,
	to?: number,
): Command {
	return (state, dispatch) => {
		const tr = closeHistory(state.tr);
		const pastesFrom = typeof from === 'number' ? from : tr.selection.from;

		if (typeof from === 'number' && typeof to === 'number') {
			tr.replaceRange(from, to, markdownSlice);
		} else {
			tr.replaceSelection(markdownSlice);
		}

		const textPosition = tr.doc.resolve(
			Math.min(pastesFrom + markdownSlice.size, tr.doc.content.size),
		);

		tr.setSelection(TextSelection.near(textPosition, -1));

		queueCardsFromChangedTr?.(state, tr, INPUT_METHOD.CLIPBOARD);
		if (dispatch) {
			dispatch(tr.scrollIntoView());
		}
		return true;
	};
}

function removePrecedingBackTick(tr: Transaction) {
	const {
		$from: { nodeBefore },
		from,
	} = tr.selection;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	if (nodeBefore && nodeBefore.isText && nodeBefore.text!.endsWith('`')) {
		tr.delete(from - 1, from);
	}
}

function hasInlineCode(state: EditorState, slice: Slice) {
	return (
		slice.content.firstChild &&
		slice.content.firstChild.marks.some((m: Mark) => m.type === state.schema.marks.code)
	);
}

function rollupLeafListItems(list: PMNode, leafListItems: PMNode[]) {
	list.content.forEach((child) => {
		if (isListNode(child) || (isListItemNode(child) && isListNode(child.firstChild))) {
			rollupLeafListItems(child, leafListItems);
		} else {
			leafListItems.push(child);
		}
	});
}

function shouldFlattenList(state: EditorState, slice: Slice) {
	const node = slice.content.firstChild;
	return node && insideTable(state) && isListNode(node) && slice.openStart > slice.openEnd;
}

function sliceHasTopLevelMarks(slice: Slice) {
	let hasTopLevelMarks = false;
	slice.content.descendants((node) => {
		if (node.marks.length > 0) {
			hasTopLevelMarks = true;
		}
		return false;
	});
	return hasTopLevelMarks;
}

function getTopLevelMarkTypesInSlice(slice: Slice) {
	const markTypes = new Set<MarkType>();
	slice.content.descendants((node) => {
		node.marks.map((mark) => mark.type).forEach((markType) => markTypes.add(markType));
		return false;
	});
	return markTypes;
}

export function handleParagraphBlockMarks(state: EditorState, slice: Slice) {
	if (slice.content.size === 0) {
		return slice;
	}

	const {
		schema,
		selection: { $from },
	} = state;

	// If no paragraph in the slice contains marks, there's no need for special handling
	// Note: this doesn't check for marks applied to lower level nodes such as text
	if (!sliceHasTopLevelMarks(slice)) {
		return slice;
	}

	// If pasting a single paragraph into pre-existing content, match destination formatting
	const destinationHasContent = $from.parent.textContent.length > 0;
	if (slice.content.childCount === 1 && destinationHasContent) {
		return slice;
	}

	// Check the parent of (paragraph -> text) because block marks are assigned to a wrapper
	// element around the paragraph node
	const grandparent = $from.node(Math.max(0, $from.depth - 1));
	const markTypesInSlice = getTopLevelMarkTypesInSlice(slice);
	const forbiddenMarkTypes: MarkType[] = [];
	for (const markType of markTypesInSlice) {
		if (!grandparent.type.allowsMarkType(markType)) {
			forbiddenMarkTypes.push(markType);
		}
	}

	if (forbiddenMarkTypes.length === 0) {
		// In a slice containing one or more paragraphs at the document level (not wrapped in
		// another node), the first paragraph will only have its text content captured and pasted
		// since openStart is 1. We decrement the open depth of the slice so it retains any block
		// marks applied to it. We only care about the depth at the start of the selection so
		// there's no need to change openEnd - the rest of the slice gets pasted correctly.
		const openStart = Math.max(0, slice.openStart - 1);
		return new Slice(slice.content, openStart, slice.openEnd);
	}

	// If the paragraph or heading contains marks forbidden by the parent node
	// (e.g. alignment/indentation), drop those marks from the slice
	return mapSlice(slice, (node) => {
		if (node.type === schema.nodes.paragraph) {
			return schema.nodes.paragraph.createChecked(
				undefined,
				node.content,
				node.marks.filter((mark) => !forbiddenMarkTypes.includes(mark.type)),
			);
		} else if (node.type === schema.nodes.heading) {
			// Preserve heading attributes to keep formatting
			return schema.nodes.heading.createChecked(
				node.attrs,
				node.content,
				node.marks.filter((mark) => !forbiddenMarkTypes.includes(mark.type)),
			);
		}
		return node;
	});
}

/**
 * ED-6300: When a nested list is pasted in a table cell and the slice has openStart > openEnd,
 * it splits the table. As a workaround, we flatten the list to even openStart and openEnd.
 *
 * Note: this only happens if the first child is a list
 *
 * Example: copying "one" and "two"
 * - zero
 *   - one
 * - two
 *
 * Before:
 * ul
 *   ┗━ li
 *     ┗━ ul
 *       ┗━ li
 *         ┗━ p -> "one"
 *   ┗━ li
 *     ┗━ p -> "two"
 *
 * After:
 * ul
 *   ┗━ li
 *     ┗━ p -> "one"
 *   ┗━ li
 *     ┗━p -> "two"
 */
export function flattenNestedListInSlice(slice: Slice) {
	if (!slice.content.firstChild) {
		return slice;
	}

	const listToFlatten = slice.content.firstChild;
	const leafListItems: PMNode[] = [];
	rollupLeafListItems(listToFlatten, leafListItems);

	const contentWithFlattenedList = slice.content.replaceChild(
		0,
		listToFlatten.type.createChecked(listToFlatten.attrs, leafListItems),
	);
	return new Slice(contentWithFlattenedList, slice.openEnd, slice.openEnd);
}

export function handleRichText(
	slice: Slice,
	queueCardsFromChangedTr: QueueCardsFromTransactionAction | undefined,
): Command {
	return (state, dispatch) => {
		const { codeBlock, heading, paragraph, panel } = state.schema.nodes;
		const { selection, schema } = state;
		const firstChildOfSlice = slice.content?.firstChild;
		const lastChildOfSlice = slice.content?.lastChild;

		// In case user is pasting inline code,
		// any backtick ` immediately preceding it should be removed.
		let tr = state.tr;
		if (hasInlineCode(state, slice)) {
			removePrecedingBackTick(tr);
		}

		if (shouldFlattenList(state, slice)) {
			slice = flattenNestedListInSlice(slice);
		}

		closeHistory(tr);

		const isFirstChildListNode = isListNode(firstChildOfSlice);
		const isLastChildListNode = isListNode(lastChildOfSlice);
		const isSliceContentListNodes = isFirstChildListNode || isLastChildListNode;

		const isFirstChildTaskListNode = firstChildOfSlice?.type?.name === 'taskList';
		const isLastChildTaskListNode = lastChildOfSlice?.type?.name === 'taskList';
		const isSliceContentTaskListNodes = isFirstChildTaskListNode || isLastChildTaskListNode;

		// We want to use safeInsert to insert invalid content, as it inserts at the closest non schema violating position
		// rather than spliting the selection parent node in half (which is what replaceSelection does)
		// Exception is paragraph and heading nodes, these should be split, provided their parent supports the pasted content
		const textNodes = [heading, paragraph];
		const selectionParent = selection.$to.node(selection.$to.depth - 1);
		const noNeedForSafeInsert =
			selection.$to.node().type.validContent(slice.content) ||
			(textNodes.includes(selection.$to.node().type) &&
				selectionParent.type.validContent(slice.content));
		const panelParentOverCurrentSelection = findParentNodeOfType(panel)(tr.selection);
		const isTargetPanelEmpty =
			panelParentOverCurrentSelection && panelParentOverCurrentSelection.node?.content.size === 2;

		if (!isSliceContentTaskListNodes && (isSliceContentListNodes || isTargetPanelEmpty)) {
			insertSliceForLists({ tr, slice, schema });
		} else if (noNeedForSafeInsert) {
			if (
				firstChildOfSlice?.type?.name === 'blockquote' &&
				firstChildOfSlice?.content.firstChild?.type.name &&
				['bulletList', 'orderedList', 'mediaSingle'].includes(
					firstChildOfSlice?.content.firstChild?.type.name,
				)
			) {
				// checks if parent node is a blockquote and child node is either a bulletlist or orderedlist or mediaSingle
				insertSliceInsideBlockquote({ tr, slice });
			} else {
				tr.replaceSelection(slice);
				// when cursor is inside a table cell, and slice.content.lastChild is a panel, expand, or decisionList
				// need to make sure the cursor position is is right after the panel, expand, or decisionList
				// still in the same table cell, see issue: https://product-fabric.atlassian.net/browse/ED-17862
				const shouldUpdateCursorPosAfterPaste = [
					'panel',
					'nestedExpand',
					'decisionList',
					'codeBlock',
				].includes(slice.content.lastChild?.type?.name || '');
				const lastChild = slice.content.lastChild;
				const $nextPos = tr.doc.resolve(tr.mapping.map(selection.from));
				const nextSelection = lastChild?.type.isTextblock
					? TextSelection.findFrom($nextPos, -1, true)
					: new GapCursorSelection($nextPos, Side.RIGHT);
				if (nextSelection) {
					tr.setSelection(nextSelection);
				} else if (insideTableCell(state) && shouldUpdateCursorPosAfterPaste) {
					const nextPos = tr.doc.resolve(tr.mapping.map(selection.$from.pos));
					tr.setSelection(new GapCursorSelection(nextPos, Side.RIGHT));
				}
			}
		} else {
			// need to scan the slice if there's a block node or list items inside it
			let sliceHasList = false;
			slice.content.nodesBetween(0, slice.content.size, (node, start) => {
				if (node.type === state.schema.nodes.listItem) {
					sliceHasList = true;
					return false;
				}
			});
			if (
				(insideTableCell(state) &&
					isInListItem(state) &&
					canInsert(selection.$from, slice.content) &&
					canInsert(selection.$to, slice.content)) ||
				sliceHasList
			) {
				tr.replaceSelection(slice);
			} else if (checkTaskListInList(state, slice) && !checkIfSelectionInNestedList(state)) {
				insertSliceForTaskInsideList({ tr, slice });
			} else {
				// need safeInsert rather than replaceSelection, so that nodes aren't split in half
				// e.g. when pasting a layout into a table, replaceSelection splits the table in half and adds the layout in the middle
				tr = safeInsert(slice.content, tr.selection.$to.pos)(tr);
				if (checkTaskListInList(state, slice)) {
					updateSelectionAfterReplace({ tr });
				}
			}
		}

		tr.setStoredMarks([]);
		if (tr.selection.empty && tr.selection.$from.parent.type === codeBlock) {
			tr.setSelection(TextSelection.near(tr.selection.$from, 1) as Selection);
		}
		tr.scrollIntoView();

		// queue link cards, ignoring any errors
		queueCardsFromChangedTr?.(state, tr, INPUT_METHOD.CLIPBOARD);
		if (dispatch) {
			dispatch(tr);
		}
		return true;
	};
}

function isUrlString(text: string): Boolean {
	try {
		new URL(text);

		return true;
	} catch {
		return false;
	}
}

function isLinkOrUrlString(slice: Slice, schema: Schema): Boolean {
	if (slice.content.childCount !== 1 || !isParagraph(slice.content.child(0), schema)) {
		return false;
	}

	const paragraph = slice.content.child(0);

	if (paragraph.content.childCount !== 1 || !isText(paragraph.content.child(0), schema)) {
		return false;
	}

	const { marks, text = '' } = paragraph.content.child(0);

	const hasLinkMark = marks.some((mark) => isLinkMark(mark, schema));

	return hasLinkMark || isUrlString(text);
}

export function handlePasteIntoCaption(slice: Slice): Command {
	return (state, dispatch) => {
		if (fg('platform_editor_fix_captions_on_copy')) {
			if (isLinkOrUrlString(slice, state.schema)) {
				return false;
			}
		}

		const { caption } = state.schema.nodes;
		const tr = state.tr;
		if (hasParentNodeOfType(caption)(state.selection)) {
			// We let PM replace the selection and it will insert as text where it can't place the node
			// This is totally fine as caption is just a simple block that only contains inline contents
			// And it is more in line with WYSIWYG expectations
			tr.replaceSelection(slice).scrollIntoView();
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}
		return false;
	};
}

export const handleSelectedTable =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(slice: Slice): Command =>
	(state, dispatch) => {
		let tr = replaceSelectedTable(state, slice);

		// add analytics after replacing selected table
		tr = addReplaceSelectedTableAnalytics(state, tr, editorAnalyticsAPI);

		if (tr.docChanged) {
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}
		return false;
	};

export function checkTaskListInList(state: EditorState, slice: Slice): boolean {
	return Boolean(
		isInListItem(state) &&
			['taskList', 'taskItem'].includes(slice.content.firstChild?.type?.name || ''),
	);
}

export function checkIfSelectionInNestedList(state: EditorState): boolean {
	const { selection, tr } = state;
	const { orderedList, bulletList, listItem } = state.schema.nodes;
	const selectionParentListItemNode = findParentNodeOfType(listItem)(selection);
	const selectionParentListNodeWithPos = findParentNodeOfType([bulletList, orderedList])(selection);

	if (!selectionParentListItemNode || !selectionParentListNodeWithPos) {
		return false;
	}

	const grandParentListNode = findParentNodeOfTypeClosestToPos(
		tr.doc.resolve(selectionParentListNodeWithPos.pos),
		[bulletList, orderedList],
	);
	const selectionIsInNestedList = !!grandParentListNode;
	let selectedListItemHasNestedList = false;
	selectionParentListItemNode.node.content.forEach((child) => {
		if (isListNode(child)) {
			selectedListItemHasNestedList = true;
		}
	});

	return selectedListItemHasNestedList || selectionIsInNestedList;
}
