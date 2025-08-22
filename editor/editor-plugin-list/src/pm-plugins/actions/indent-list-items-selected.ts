import { normalizeListItemsSelection } from '@atlaskit/editor-common/lists';
import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import { isListItemNode, isListNode } from '@atlaskit/editor-common/utils';
import type { NodeRange, NodeType } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';

import { findFirstParentListItemNode } from '../utils/find';

export const indentListItemsSelected = (tr: Transaction) => {
	const originalSelection = tr.selection;
	const normalizedSelection = normalizeListItemsSelection({
		selection: originalSelection,
		doc: tr.doc,
	});
	const { $from, $to } = normalizedSelection;
	const range = calculateRange({ selection: normalizedSelection });
	if (!range) {
		return false;
	}

	const listItemsSelected = {
		from: findFirstParentListItemNode($from),
		to: findFirstParentListItemNode($to),
	};

	if (listItemsSelected.from === null || listItemsSelected.to === null) {
		return null;
	}

	const resolvedPos = tr.doc.resolve(listItemsSelected.from.pos);
	const listItemIndex = resolvedPos.index();
	// @ts-ignore
	const positionListItemPosition = resolvedPos.posAtIndex(listItemIndex - 1);
	const currentListItemPosition = resolvedPos.posAtIndex(listItemIndex);
	const previousListItem = tr.doc.nodeAt(positionListItemPosition);
	const currentListItem = tr.doc.nodeAt(currentListItemPosition);
	const currentListItemContent = currentListItem?.content?.content;
	const hasLastItemExtension =
		currentListItemContent !== undefined && currentListItemContent?.length > 0
			? currentListItemContent[currentListItemContent.length - 1].type.name === 'extension'
			: false;

	if (!previousListItem || !isListItemNode(previousListItem)) {
		return null;
	}

	if (isListItemNode(previousListItem) && listItemIndex === 0) {
		return null;
	}

	const listItemSelectedCommonParent = range.parent;
	const previousNestedList = isListNode(previousListItem.lastChild)
		? previousListItem.lastChild
		: null;
	const listNodeType = previousNestedList
		? previousNestedList.type
		: listItemSelectedCommonParent.type;
	const nestedList = listItemsSelected.to.node.lastChild;

	const nestedItemsOffset = nestedList && isListNode(nestedList) ? nestedList.nodeSize : 0;
	const from = listItemsSelected.from.pos;
	const to = listItemsSelected.to.pos + listItemsSelected.to.node.nodeSize - nestedItemsOffset;
	const [sliceSelected, nestedListItemsLeftover] = createIndentedListItemsSlice({
		tr,
		listNodeType,
		range,
		from,
		to,
		hasLastItemExtension,
	});
	const hasPreviousNestedList = Boolean(previousNestedList);
	const start = from - 1;
	tr.replaceRange(hasPreviousNestedList ? start - 1 : start, range.end, sliceSelected);
	const leftoverContentPosition = tr.mapping.map(to) - 2;
	if (nestedListItemsLeftover.openStart === 0) {
		tr.insert(leftoverContentPosition, nestedListItemsLeftover.content);
	} else {
		tr.replace(
			leftoverContentPosition - nestedListItemsLeftover.openStart,
			leftoverContentPosition - nestedListItemsLeftover.openStart,
			nestedListItemsLeftover,
		);
	}

	const nextSelection = calculateNewSelection({
		originalSelection,
		normalizedSelection,
		tr,
		hasPreviousNestedList,
	});

	tr.setSelection(nextSelection);
};

type CalculateRange = (props: { selection: Selection }) => NodeRange | null;
const calculateRange: CalculateRange = ({ selection }) => {
	const { $from, $to } = selection;
	const range = $from.blockRange($to, isListNode);
	if (!range) {
		return null;
	}

	return range;
};

type CalculateNewSelectionProps = {
	hasPreviousNestedList: boolean;
	normalizedSelection: Selection;
	originalSelection: Selection;
	tr: Transaction;
};

const calculateNewSelection = ({
	tr,
	normalizedSelection,
	originalSelection,
	hasPreviousNestedList,
}: CalculateNewSelectionProps) => {
	const offset = hasPreviousNestedList ? 2 : 0;
	const { $from, $to } = normalizedSelection;
	if (normalizedSelection instanceof GapCursorSelection) {
		const nextSelectionFrom = tr.doc.resolve($from.pos - offset);
		return new GapCursorSelection(nextSelectionFrom, normalizedSelection.side);
	}

	if (originalSelection instanceof NodeSelection) {
		return NodeSelection.create(tr.doc, $from.pos - offset);
	}

	const { $from: nextSelectionFrom } = Selection.near(tr.doc.resolve($from.pos - offset));
	const { $to: nextSelectionTo } = Selection.near(tr.doc.resolve($to.pos - offset), -1);
	return new TextSelection(nextSelectionFrom, nextSelectionTo);
};

type CreateIndentedListItemsSliceProps = {
	from: number;
	hasLastItemExtension: boolean;
	listNodeType: NodeType;
	range: NodeRange;
	to: number;
	tr: Transaction;
};
const createIndentedListItemsSlice = ({
	tr,
	from,
	to,
	listNodeType,
	range,
	hasLastItemExtension,
}: CreateIndentedListItemsSliceProps): [Slice, Slice] => {
	const listItemsSlice = tr.doc.slice(from, hasLastItemExtension ? to : to - 2);
	const listFragment = Fragment.from(listNodeType.create(null, listItemsSlice.content));

	const nonSelectedListItemsSlice = tr.doc.slice(to, range.end - 2);

	const openStart = tr.doc.slice(from - 1, range.end).openStart;
	const slice = new Slice(listFragment, openStart, 0);

	return [slice, nonSelectedListItemsSlice];
};
