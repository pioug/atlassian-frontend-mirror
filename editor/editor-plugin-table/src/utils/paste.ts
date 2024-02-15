import { flatmap, mapSlice } from '@atlaskit/editor-common/utils';
import type {
  Node as PMNode,
  Schema,
} from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { flatten } from '@atlaskit/editor-prosemirror/utils';

import { getPluginState } from '../pm-plugins/plugin-factory';

// lifts up the content of each cell, returning an array of nodes
export const unwrapContentFromTable = (
  maybeTable: PMNode,
): PMNode | PMNode[] => {
  const { schema } = maybeTable.type;
  if (maybeTable.type === schema.nodes.table) {
    const content: PMNode[] = [];
    const { tableCell, tableHeader } = schema.nodes;
    maybeTable.descendants((maybeCell) => {
      if (maybeCell.type === tableCell || maybeCell.type === tableHeader) {
        content.push(...flatten(maybeCell, false).map((child) => child.node));
      }
      return true;
    });
    return content;
  }
  return maybeTable;
};

export const removeTableFromFirstChild = (
  node: PMNode,
  i: number,
): PMNode | PMNode[] => {
  return i === 0 ? unwrapContentFromTable(node) : node;
};

export const removeTableFromLastChild = (
  node: PMNode,
  i: number,
  fragment: Fragment,
): PMNode | PMNode[] => {
  return i === fragment.childCount - 1 ? unwrapContentFromTable(node) : node;
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
  const paragraphNodeSize = emptyParagraphNode
    ? emptyParagraphNode.nodeSize
    : 0;
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

export const transformSliceToRemoveOpenTable = (
  slice: Slice,
  schema: Schema,
): Slice => {
  // we're removing the table, tableRow and tableCell reducing the open depth by 3
  const depthDecrement = 3;

  // Case 1: A slice entirely within a single CELL
  if (
    // starts and ends inside of a cell
    slice.openStart >= 4 &&
    slice.openEnd >= 4 &&
    // slice is a table node
    slice.content.childCount === 1 &&
    slice.content.firstChild!.type === schema.nodes.table
  ) {
    // prosemirror-view has a bug that it duplicates table entry when selecting multiple paragraphs in a table cell.
    // https://github.com/ProseMirror/prosemirror/issues/1270
    // The structure becomes
    // table(genuine) > tableRow(genuine) > table(duplicated) > tableRow(duplicated) > tableCell/tableHeader(genuine) > contents(genuine)
    // As we are removing wrapping table anyway, we keep duplicated table and tableRow for simplicity
    let cleaned = slice;
    if (
      slice.content.firstChild?.content?.firstChild?.content?.firstChild
        ?.type === schema.nodes.table
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

  // Case 2: A slice starting within a CELL and ending outside the table
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

export const transformSliceToCorrectEmptyTableCells = (
  slice: Slice,
  schema: Schema,
): Slice => {
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
