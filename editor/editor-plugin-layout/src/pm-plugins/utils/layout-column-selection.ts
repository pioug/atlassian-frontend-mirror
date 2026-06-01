import type { Valign } from '@atlaskit/adf-schema/layout-column';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, type Selection } from '@atlaskit/editor-prosemirror/state';
import { findChildrenByType, findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

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

export const getSelectedLayoutColumnsFromSelection = (
	selection: Selection,
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

	const selectedLayoutColumns = allLayoutColumns.filter(({ node, pos }, index) => {
		const isSelected = selection.from <= pos && selection.to >= pos + node.nodeSize;
		if (isSelected) {
			if (startIndex === -1) {
				startIndex = index;
			}
			endIndex = index;
		}
		return isSelected;
	});

	return {
		layoutSectionNode,
		layoutSectionPos,
		selectedLayoutColumns,
		startIndex,
		endIndex,
	};
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
	layoutColumn ? ((layoutColumn.attrs.valign as Valign | undefined) ?? 'top') : undefined;

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
