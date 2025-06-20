import { getParentOfTypeCount } from '@atlaskit/editor-common/nesting';
import { flatmap, mapChildren, mapSlice } from '@atlaskit/editor-common/utils';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { Slice, Fragment, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { flatten, hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { CellSelection } from '@atlaskit/editor-tables';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { getPluginState } from '../plugin-factory';

// lifts up the content of each cell, returning an array of nodes
export const unwrapContentFromTable = (maybeTable: PMNode): PMNode | PMNode[] => {
	const { schema } = maybeTable.type;
	if (maybeTable.type === schema.nodes.table) {
		const content: PMNode[] = [];
		const { tableCell, tableHeader } = schema.nodes;
		maybeTable.descendants((maybeCell) => {
			if (maybeCell.type === tableCell || maybeCell.type === tableHeader) {
				content.push(...flatten(maybeCell, false).map((child) => child.node));
				return false;
			}
			return true;
		});
		return content;
	}
	return maybeTable;
};

// Flattens nested tables after a given nesting depth
// If this looks familiar, it's a heavily modified version of `mapFragment` which has been
// adjusted to support tracking nesting depth. This wasn't possible by using `mapFragment` directly
const unwrapNestedTables = (
	content: Fragment,
	schema: Schema,
	unwrapNestDepth: number,
	currentNestDepth = 0,
): PMNode[] => {
	const flattenNested = (node: PMNode, tableDepth: number) => {
		if (node.type === schema.nodes.table) {
			if (tableDepth >= unwrapNestDepth) {
				return unwrapContentFromTable(node);
			}
			return node;
		}
		return node;
	};

	const children = [] as PMNode[];
	for (let i = 0, size = content.childCount; i < size; i++) {
		const node = content.child(i);
		const transformed = node.isLeaf
			? flattenNested(node, currentNestDepth)
			: flattenNested(
					node.copy(
						Fragment.fromArray(
							unwrapNestedTables(
								node.content,
								schema,
								unwrapNestDepth,
								node.type === schema.nodes.table ? currentNestDepth + 1 : currentNestDepth,
							),
						),
					),
					currentNestDepth,
				);
		if (transformed) {
			if (Array.isArray(transformed)) {
				children.push(...transformed);
			} else {
				children.push(transformed);
			}
		}
	}
	return children;
};

export const removeTableFromFirstChild = (node: PMNode, i: number): PMNode | PMNode[] => {
	return i === 0 ? unwrapContentFromTable(node) : node;
};

export const removeTableFromLastChild = (
	node: PMNode,
	i: number,
	fragment: Fragment,
): PMNode | PMNode[] => {
	return i === fragment.childCount - 1 ? unwrapContentFromTable(node) : node;
};

export const transformSliceToRemoveNestedTables = (
	slice: Slice,
	schema: Schema,
	selection: Selection,
): Slice => {
	const isNestingAllowed = editorExperiment('nested-tables-in-tables', true);
	const { table, tableCell, tableHeader } = schema.nodes;
	let openEnd = slice.openEnd;

	const newFragment = flatmap(slice.content, (node, i, fragment) => {
		// if pasted content is a node that supports nesting a table
		// such as layoutSection or expand allow 1 level by default
		let allowedTableNesting = 1;
		const isCellSelection = selection instanceof CellSelection;
		const isPasteInTable = hasParentNodeOfType([table, tableCell, tableHeader])(selection);
		const isPasteInNestedTable = getParentOfTypeCount(schema.nodes.table)(selection.$from) > 1;
		const isPasteFullTableInsideEmptyCellEnabled = fg(
			'platform_editor_paste_full_table_inside_empty_cell',
		);

		// Pasted content only contains a table and no other content
		const isCellPaste =
			isPasteInTable &&
			slice.content.childCount === 1 &&
			slice.content.firstChild?.type === table &&
			(!isPasteFullTableInsideEmptyCellEnabled || (slice.openStart !== 0 && slice.openEnd !== 0));

		if (isNestingAllowed) {
			// if nesting is allowed we bump up the default nesting allowance to 2 to support
			// two levels of nesting in nodes that support table nesting already such as layoutSection and expands
			allowedTableNesting = 2;

			// however if pasted content is a table, allow just one level
			if (node.type === schema.nodes.table) {
				allowedTableNesting = 1;

				// if paste is inside a table, allow no further nesting
				if (isPasteInTable) {
					allowedTableNesting = 0;
				}

				// unless we are pasting inside a nested table, then bounce back to 1 level
				// because editor-plugin-paste will lift the table to the parent table (just below it)
				if (isPasteInNestedTable) {
					allowedTableNesting = 1;
				}

				// paste of table cells into a table cell - content is spread across multiple cells
				// by editor-tables so needs to be treated a little differently
				if (
					isCellPaste ||
					(isCellSelection && fg('platform_editor_nested_tables_cellselection_paste'))
				) {
					allowedTableNesting = 1;
					if (isPasteInNestedTable) {
						allowedTableNesting = 0;
					}
				}
			}

			// Prevent invalid openEnd after pasting tables with a selection that ends inside a nested table cell.
			// If the slice ends with a selection that ends inside a nested table, and we paste inside a table we
			// need to adjust the openEnd because it is no longer correct. If we don't, Prosemirror fires an exception
			// because it iterates to a non-existent depth and the transform will not be applied
			if (
				slice.openEnd >= 7 && // depth of a nested table cell
				slice.content.childCount > 1 &&
				slice.content.lastChild?.type === table &&
				isPasteInTable
			) {
				// re-point the slice's openEnd to non-nested table cell depth
				openEnd = 4;
			}
		} else {
			// for layouts and expands, we start with 1 level of nesting as set above

			// if pasted content is a table, don't allow further nesting
			if (node.type === schema.nodes.table) {
				allowedTableNesting = 0;
			}
		}

		if (
			isCellSelection &&
			!isCellPaste &&
			fg('platform_editor_nested_tables_cellselection_paste')
		) {
			// if pasting into a cell selection, we need to flatten the parent table as well
			return unwrapNestedTables(Fragment.fromArray([node]), schema, allowedTableNesting);
		} else {
			// after we've worked out what the allowed nesting depth is, unwrap nested tables
			const newChildren = unwrapNestedTables(node.content, schema, allowedTableNesting);
			return node.copy(Fragment.fromArray(newChildren));
		}
	});

	return new Slice(newFragment, slice.openStart, openEnd);
};

/**
 * When we copy from a table cell with a hardBreak at the end,
 * the slice generated will come with a hardBreak outside of the table.
 * This code will look for that pattern and fix it.
 */
export const transformSliceToFixHardBreakProblemOnCopyFromCell = (
	slice: Slice,
	schema: Schema,
): Slice => {
	const { paragraph, table, hardBreak } = schema.nodes;
	const emptyParagraphNode = paragraph.createAndFill();

	const hardBreakNode = hardBreak?.createAndFill();
	const paragraphNodeSize = emptyParagraphNode ? emptyParagraphNode.nodeSize : 0;
	const hardBreakNodeSize = hardBreakNode ? hardBreakNode.nodeSize : 0;
	const paragraphWithHardBreakSize = paragraphNodeSize + hardBreakNodeSize;

	if (
		slice.content.childCount === 2 &&
		slice.content.firstChild &&
		slice.content.lastChild &&
		slice.content.firstChild.type === table &&
		slice.content.lastChild.type === paragraph &&
		slice.content.lastChild.nodeSize === paragraphWithHardBreakSize
	) {
		const nodes = unwrapContentFromTable(slice.content.firstChild);
		if (nodes instanceof Array) {
			return new Slice(
				Fragment.from(
					// keep only the content and discard the hardBreak
					nodes[0],
				),
				slice.openStart,
				slice.openEnd,
			);
		}
	}

	return slice;
};

const isNodeSingleCellTable = (node: PMNode, schema: Schema): boolean => {
	return (
		node.childCount === 1 &&
		node.firstChild?.type === schema.nodes.tableRow &&
		node.firstChild.childCount === 1 &&
		(node.firstChild.firstChild?.type === schema.nodes.tableCell ||
			node.firstChild.firstChild?.type === schema.nodes.tableHeader)
	);
};

const isFragmentSingleCellTable = (fragment: Fragment, schema: Schema): boolean => {
	return (
		fragment.childCount === 1 &&
		fragment.firstChild !== null &&
		isNodeSingleCellTable(fragment.firstChild, schema)
	);
};

const containsNonTableBlockChildren = (fragment: Fragment, schema: Schema): boolean => {
	let containsNonTableBlock = false;
	const { table, tableCell, tableHeader } = schema.nodes;

	fragment.forEach((node) => {
		if (node.isBlock && ![table, tableCell, tableHeader].includes(node.type)) {
			containsNonTableBlock = true;
		}
	});

	return containsNonTableBlock;
};

export const transformSliceToRemoveOpenTable = (slice: Slice, schema: Schema): Slice => {
	// Case 1: A slice of a block selection inside a nested table
	// Prosemirror wraps nested block selections in their respective tables
	// We are using `safeInsert` to paste nested tables, so we do not want to preserve this wrapping

	// slice starts and ends inside a nested table at the same depth
	if (slice.openStart >= 7 && slice.openEnd >= 7) {
		let cleaned = slice;
		let descendedDepth = 0;
		const tableDepthDecrement = 2;

		// if the slice is a single cell table and contains cells with single cell tables, descend into it until we find textblock children
		if (isFragmentSingleCellTable(slice.content, schema)) {
			slice.content.firstChild?.descendants((node) => {
				if (isNodeSingleCellTable(node, schema)) {
					descendedDepth += tableDepthDecrement;
				} else if (node.type === schema.nodes.table) {
					return false;
				} else if (containsNonTableBlockChildren(node.content, schema)) {
					descendedDepth += tableDepthDecrement;
					// create a new slice with the content of non-table block children and the depth of the nested tables subtracted
					cleaned = new Slice(
						node.content,
						slice.openStart - descendedDepth - tableDepthDecrement,
						slice.openEnd - descendedDepth - tableDepthDecrement,
					);
					return false;
				}
			});
		}

		if (!cleaned.eq(slice)) {
			return cleaned;
		}
	}

	// Case 2: A slice entirely within a single CELL
	if (
		// starts and ends inside of a cell
		slice.openStart >= 4 &&
		slice.openEnd >= 4 &&
		// slice is a table node
		slice.content.childCount === 1 &&
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		slice.content.firstChild!.type === schema.nodes.table
	) {
		// we're removing the table, tableRow and tableCell reducing the open depth by 3
		const depthDecrement = 3;

		// prosemirror-view has a bug that it duplicates table entry when selecting multiple paragraphs in a table cell.
		// https://github.com/ProseMirror/prosemirror/issues/1270
		// The structure becomes
		// table(genuine) > tableRow(genuine) > table(duplicated) > tableRow(duplicated) > tableCell/tableHeader(genuine) > contents(genuine)
		// As we are removing wrapping table anyway, we keep duplicated table and tableRow for simplicity
		let cleaned = slice;
		if (
			slice.content.firstChild?.content?.firstChild?.content?.firstChild?.type ===
			schema.nodes.table
		) {
			cleaned = new Slice(
				slice.content.firstChild.content.firstChild.content,
				slice.openStart - 2,
				slice.openEnd - 2,
			);
		}

		return new Slice(
			flatmap(cleaned.content, unwrapContentFromTable),
			cleaned.openStart - depthDecrement,
			cleaned.openEnd - depthDecrement,
		);
	}

	// Case 3: A slice starting within a CELL and ending outside the table
	if (
		// starts inside of a cell but ends outside of the starting table
		slice.openStart >= 4 &&
		// slice starts from a table node (and spans across more than one node)
		slice.content.childCount > 1 &&
		slice.content.firstChild?.type === schema.nodes.table
	) {
		// repoint the slice's cutting depth so that cell content where the slice starts
		// does not get lifted out of the cell on paste
		return new Slice(slice.content, 1, slice.openEnd);
	}

	return slice;
};

export const transformSliceToCorrectEmptyTableCells = (slice: Slice, schema: Schema): Slice => {
	const { tableCell, tableHeader } = schema.nodes;
	return mapSlice(slice, (node) => {
		if (
			node &&
			(node.type === tableCell || node.type === tableHeader) &&
			!node.content.childCount
		) {
			return node.type.createAndFill(node.attrs) || node;
		}

		return node;
	});
};

export function isHeaderRowRequired(state: EditorState) {
	const tableState = getPluginState(state);
	return tableState && tableState.pluginConfig.isHeaderRowRequired;
}

export const transformSliceTableLayoutDefaultToCenter = (slice: Slice, schema: Schema): Slice => {
	const { table } = schema.nodes;
	const children = [] as PMNode[];
	mapChildren(slice.content, (node: PMNode) => {
		if (node.type === table && node.attrs.layout === 'default') {
			children.push(
				table.createChecked({ ...node.attrs, layout: 'center' }, node.content, node.marks),
			);
		} else {
			children.push(node);
		}
	});

	return new Slice(Fragment.fromArray(children), slice.openStart, slice.openEnd);
};
