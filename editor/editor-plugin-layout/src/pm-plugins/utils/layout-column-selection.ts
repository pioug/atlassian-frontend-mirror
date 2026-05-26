import type { Valign } from '@atlaskit/adf-schema/layout-column';
import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export type SelectedLayoutColumn = {
	index: number;
	node: PMNode;
	pos: number;
};

export type SelectedLayoutColumns = {
	layoutSectionNode: PMNode;
	layoutSectionPos: number;
	selectedColumnIndices: number[];
	selectedColumns: SelectedLayoutColumn[];
};

const isLayoutColumn = (node: PMNode | null | undefined): node is PMNode =>
	node?.type.name === 'layoutColumn';

const isLayoutSection = (node: PMNode | null | undefined): node is PMNode =>
	node?.type.name === 'layoutSection';

const getLayoutColumnIndexAtPos = ($pos: ResolvedPos): number | undefined => {
	for (let depth = $pos.depth; depth > 0; depth--) {
		if (isLayoutColumn($pos.node(depth)) && isLayoutSection($pos.node(depth - 1))) {
			return $pos.index(depth - 1);
		}
	}

	return undefined;
};

const getLayoutSectionDepth = (selection: Selection): number | undefined => {
	const { $from, $to } = selection;
	const sharedDepth = $from.sharedDepth($to.pos);

	for (let depth = sharedDepth; depth > 0; depth--) {
		if (isLayoutSection($from.node(depth))) {
			return depth;
		}
	}

	return undefined;
};

export const getSelectedLayoutColumns = (
	selection: Selection | undefined,
): SelectedLayoutColumns | undefined => {
	if (!selection) {
		return undefined;
	}

	if (selection instanceof NodeSelection && isLayoutColumn(selection.node)) {
		const { $from } = selection;
		const layoutSectionNode = $from.parent;

		if (!isLayoutSection(layoutSectionNode)) {
			return undefined;
		}

		const selectedColumnIndex = $from.index($from.depth);
		return {
			layoutSectionNode,
			layoutSectionPos: $from.before($from.depth),
			selectedColumnIndices: [selectedColumnIndex],
			selectedColumns: [
				{
					index: selectedColumnIndex,
					node: selection.node,
					pos: selection.from,
				},
			],
		};
	}

	if (selection.empty) {
		return undefined;
	}

	if (!editorExperiment('platform_editor_block_menu', true)) {
		return undefined;
	}

	const layoutSectionDepth = getLayoutSectionDepth(selection);
	if (layoutSectionDepth === undefined) {
		return undefined;
	}

	const { $from, $to } = selection;
	const layoutSectionNode = $from.node(layoutSectionDepth);
	const layoutSectionPos = $from.before(layoutSectionDepth);
	const selectedColumns: SelectedLayoutColumn[] = [];
	let invalidSelection = false;

	layoutSectionNode.forEach((column, offset, index) => {
		const columnStart = layoutSectionPos + 1 + offset;
		const columnEnd = columnStart + column.nodeSize;
		const intersectsColumn = selection.from < columnEnd && selection.to > columnStart;

		if (!intersectsColumn) {
			return;
		}

		if (!isLayoutColumn(column)) {
			invalidSelection = true;
			return;
		}

		selectedColumns.push({ index, node: column, pos: columnStart });
	});

	// TextSelection inside a single column is normal text editing, not a selected column set.
	if (invalidSelection || selectedColumns.length < 2) {
		return undefined;
	}

	const firstColumn = selectedColumns[0];
	const lastColumn = selectedColumns[selectedColumns.length - 1];

	const startColumnIndex = getLayoutColumnIndexAtPos($from);
	const endColumnIndex = getLayoutColumnIndexAtPos($to);
	if (
		(startColumnIndex !== undefined && startColumnIndex !== firstColumn.index) ||
		(endColumnIndex !== undefined && endColumnIndex !== lastColumn.index)
	) {
		return undefined;
	}

	return {
		layoutSectionNode,
		layoutSectionPos,
		selectedColumnIndices: selectedColumns.map(({ index }) => index),
		selectedColumns,
	};
};

export const getLayoutSectionColumnCount = (layoutSection: PMNode | undefined): number =>
	layoutSection?.type.name === 'layoutSection' ? layoutSection.childCount : 0;

export const getLayoutColumnValign = (layoutColumn: PMNode | undefined): Valign | undefined =>
	layoutColumn ? ((layoutColumn.attrs.valign as Valign | undefined) ?? 'top') : undefined;

export const getLayoutColumnMenuAnchorPos = (
	selection: Selection | undefined,
	anchorPosFromHandle?: number,
): number | undefined => {
	const selectedLayoutColumns = getSelectedLayoutColumns(selection);
	if (!selectedLayoutColumns) {
		return undefined;
	}

	const clickedSelectedColumn = selectedLayoutColumns.selectedColumns.find(
		({ pos }) => pos === anchorPosFromHandle,
	);

	return clickedSelectedColumn?.pos ?? selectedLayoutColumns.selectedColumns[0]?.pos;
};
