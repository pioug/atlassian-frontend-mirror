import type { Valign } from '@atlaskit/adf-schema/layout-column';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, type Selection } from '@atlaskit/editor-prosemirror/state';
import { findChildrenByType, findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

import { DEFAULT_LAYOUT_COLUMN_VALIGN } from '../consts';

const findLayoutSectionFromSelection = (selection: Selection) => {
	const { layoutSection } = selection.$from.doc.type.schema.nodes;
	// NodeSelection on the layoutSection node itself
	if (selection instanceof NodeSelection && selection.node.type === layoutSection) {
		return { node: selection.node, pos: selection.from };
	}
	return findParentNodeOfType(layoutSection)(selection);
};

const findLayoutColumnsFromLayoutSection = (layoutSectionNode: PMNode, layoutSectionPos = 0) => {
	return findChildrenByType(
		layoutSectionNode,
		layoutSectionNode.type.schema.nodes.layoutColumn,
	).map(({ node, pos }) => ({
		node,
		pos: pos + layoutSectionPos + 1,
	}));
};

type FoundNode = {
	node: PMNode;
	pos: number;
};

export type SelectedLayoutColumns = {
	endIndex: number;
	layoutSectionNode: PMNode;
	layoutSectionPos: number;
	selectedLayoutColumns: FoundNode[];
	startIndex: number;
};

const getSelectedLayoutColumns = (
	selection: Selection,
	isColumnSelected: (column: FoundNode, index: number) => boolean,
): SelectedLayoutColumns | undefined => {
	const layoutSection = findLayoutSectionFromSelection(selection);

	if (!layoutSection) {
		return undefined;
	}

	const { node: layoutSectionNode, pos: layoutSectionPos } = layoutSection;
	const allLayoutColumns = findLayoutColumnsFromLayoutSection(layoutSectionNode, layoutSectionPos);

	if (!allLayoutColumns.length) {
		return undefined;
	}

	let startIndex = -1;
	let endIndex = -1;

	const selectedLayoutColumns = allLayoutColumns.filter((column, index) => {
		if (isColumnSelected(column, index)) {
			if (startIndex === -1) {
				startIndex = index;
			}
			endIndex = index;
			return true;
		}
		return false;
	});

	return {
		layoutSectionNode,
		layoutSectionPos,
		selectedLayoutColumns,
		startIndex,
		endIndex,
	};
};

export const getSelectedLayoutColumnsFromSelection = (
	selection: Selection,
): SelectedLayoutColumns | undefined => {
	return getSelectedLayoutColumns(selection, ({ node, pos }) => {
		// NodeSelection on a layout column is clearly selected.
		if (selection instanceof NodeSelection && selection.node === node) {
			return true;
		}

		// For TextSelection, only count columns that are fully contained within the selection
		// (not partial text selections inside a column).
		const nodeEndPos = pos + node.nodeSize;
		return !selection.empty && selection.from <= pos && selection.to >= nodeEndPos;
	});
};

export const getLayoutColumnsFromContentSelection = (
	selection: Selection,
): SelectedLayoutColumns | undefined => {
	return getSelectedLayoutColumns(selection, ({ node, pos }) => {
		if (selection instanceof NodeSelection && selection.node === node) {
			return true;
		}

		const nodeEndPos = pos + node.nodeSize;
		return selection.empty
			? selection.from > pos && selection.from < nodeEndPos
			: selection.from < nodeEndPos && selection.to > pos;
	});
};

export const getAllLayoutColumnsFromSelection = (
	selection: Selection,
): SelectedLayoutColumns | undefined => {
	const layoutSection = findLayoutSectionFromSelection(selection);

	if (!layoutSection) {
		return undefined;
	}

	const layoutColumns = findLayoutColumnsFromLayoutSection(layoutSection.node, layoutSection.pos);

	if (!layoutColumns?.length) {
		return undefined;
	}

	return {
		layoutSectionNode: layoutSection.node,
		layoutSectionPos: layoutSection.pos,
		selectedLayoutColumns: layoutColumns,
		startIndex: 0,
		endIndex: layoutColumns.length - 1,
	};
};

export const getLayoutColumnValign = (layoutColumn: PMNode | undefined): Valign | undefined =>
	layoutColumn
		? (layoutColumn.attrs.valign as Valign | undefined) ?? DEFAULT_LAYOUT_COLUMN_VALIGN
		: undefined;

export const getLayoutColumnMenuAnchorPos = (
	selection: Selection,
	anchorPosFromHandle?: number,
): number | undefined => {
	const selectedLayoutColumns = getSelectedLayoutColumnsFromSelection(selection);

	if (!selectedLayoutColumns) {
		return undefined;
	}

	const clickedSelectedColumn = selectedLayoutColumns.selectedLayoutColumns.find(
		({ pos }) => pos === anchorPosFromHandle,
	);

	return clickedSelectedColumn?.pos ?? selectedLayoutColumns.selectedLayoutColumns[0]?.pos;
};
