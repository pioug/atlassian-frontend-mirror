import {
  EditorSelectionAPI,
  GapCursorSelection,
  isSelectionAtEndOfNode,
  isSelectionAtStartOfNode,
  RelativeSelectionPos,
  Side,
} from '@atlaskit/editor-common/selection';
import type { Command } from '@atlaskit/editor-common/types';
import {
  Node as PmNode,
  ResolvedPos,
} from '@atlaskit/editor-prosemirror/model';
import { Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTable, isTableSelected } from '@atlaskit/editor-tables/utils';

export enum TableSelectionDirection {
  TopToBottom = 'TopToBottom',
  BottomToTop = 'BottomToTop',
}

export const arrowLeftFromTable =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  (): Command =>
  (state, dispatch) => {
    const { selection } = state;
    if (selection instanceof CellSelection) {
      return arrowLeftFromCellSelection(editorSelectionAPI)(selection)(
        state,
        dispatch,
      );
    } else if (selection instanceof GapCursorSelection) {
      return arrowLeftFromGapCursor(editorSelectionAPI)(selection)(
        state,
        dispatch,
      );
    } else if (selection instanceof TextSelection) {
      return arrowLeftFromText(editorSelectionAPI)(selection)(state, dispatch);
    }
    return false;
  };

export const arrowRightFromTable =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  (): Command =>
  (state, dispatch) => {
    const { selection } = state;

    if (selection instanceof CellSelection) {
      return arrowRightFromCellSelection(editorSelectionAPI)(selection)(
        state,
        dispatch,
      );
    } else if (selection instanceof GapCursorSelection) {
      return arrowRightFromGapCursor(editorSelectionAPI)(selection)(
        state,
        dispatch,
      );
    } else if (selection instanceof TextSelection) {
      return arrowRightFromText(editorSelectionAPI)(selection)(state, dispatch);
    }
    return false;
  };

const arrowLeftFromCellSelection =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  (selection: CellSelection): Command =>
  (state, dispatch) => {
    if (isTableSelected(state.selection) && editorSelectionAPI) {
      const { selectionRelativeToNode } =
        editorSelectionAPI.getSelectionPluginState(state);
      if (selectionRelativeToNode === RelativeSelectionPos.Start) {
        // we have full table cell selection and want to set gap cursor selection before table
        return setGapCursorBeforeTable(editorSelectionAPI)()(state, dispatch);
      } else if (selectionRelativeToNode === RelativeSelectionPos.End) {
        // we have full table cell selection and want to set selection at end of last cell
        return setSelectionAtEndOfLastCell(editorSelectionAPI)(selection)(
          state,
          dispatch,
        );
      } else if (selectionRelativeToNode === undefined) {
        // we have full table cell selection and want to set selection at start of first cell
        return setSelectionAtStartOfFirstCell(editorSelectionAPI)(
          selection,
          RelativeSelectionPos.Before,
        )(state, dispatch);
      }
    }
    return false;
  };

const arrowRightFromCellSelection =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  (selection: CellSelection): Command =>
  (state, dispatch) => {
    if (isTableSelected(state.selection) && editorSelectionAPI) {
      const { selectionRelativeToNode } =
        editorSelectionAPI.getSelectionPluginState(state);

      if (selectionRelativeToNode === RelativeSelectionPos.Start) {
        // we have full table cell selection and want to set selection at start of first cell
        return setSelectionAtStartOfFirstCell(editorSelectionAPI)(selection)(
          state,
          dispatch,
        );
      } else if (
        selectionRelativeToNode === RelativeSelectionPos.End ||
        selectionRelativeToNode === undefined
      ) {
        // we have full table cell selection and want to set gap cursor selection after table
        return setGapCursorAfterTable(editorSelectionAPI)()(state, dispatch);
      }
    }
    return false;
  };

const arrowLeftFromGapCursor =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  (selection: GapCursorSelection): Command =>
  (state, dispatch) => {
    const { doc } = state;
    const { $from, from, side } = selection;

    if (side === Side.RIGHT) {
      if ($from.nodeBefore && $from.nodeBefore.type.name === 'table') {
        // we have a gap cursor after a table node and want to set a full table cell selection
        return selectFullTable(editorSelectionAPI)({
          node: $from.nodeBefore,
          startPos: doc.resolve(from - 1).start($from.depth + 1),
          dir: TableSelectionDirection.TopToBottom,
        })(state, dispatch);
      }
    } else if (side === Side.LEFT) {
      const table = findTable(selection);
      if (
        table &&
        isSelectionAtStartOfTable($from, selection) &&
        editorSelectionAPI
      ) {
        const { selectionRelativeToNode } =
          editorSelectionAPI.getSelectionPluginState(state);
        if (selectionRelativeToNode === RelativeSelectionPos.Before) {
          // we have a gap cursor at start of first table cell and want to set a gap cursor selection before table
          return setGapCursorBeforeTable(editorSelectionAPI)()(state, dispatch);
        } else {
          // we have a gap cursor at start of first table cell and want to set a full table cell selection
          return selectFullTable(editorSelectionAPI)({
            node: table.node,
            startPos: table.start,
            dir: TableSelectionDirection.BottomToTop,
          })(state, dispatch);
        }
      }
    }
    return false;
  };

const arrowRightFromGapCursor =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  (selection: GapCursorSelection): Command =>
  (state, dispatch) => {
    const { $from, from, $to, side } = selection;

    if (side === Side.LEFT) {
      if ($from.nodeAfter && $from.nodeAfter.type.name === 'table') {
        // we have a gap cursor before a table node and want to set a full table cell selection
        return selectFullTable(editorSelectionAPI)({
          node: $from.nodeAfter,
          startPos: from + 1,
          dir: TableSelectionDirection.BottomToTop,
        })(state, dispatch);
      }
    } else if (side === Side.RIGHT) {
      const table = findTable(selection);
      if (table && isSelectionAtEndOfTable($to, selection)) {
        // we have a gap cursor at end of last table cell and want to set a full table cell selection
        return selectFullTable(editorSelectionAPI)({
          node: table.node,
          startPos: table.start,
          dir: TableSelectionDirection.TopToBottom,
        })(state, dispatch);
      }
    }
    return false;
  };

const arrowLeftFromText =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  (selection: TextSelection): Command =>
  (state, dispatch) => {
    const table = findTable(selection);
    if (table) {
      const { $from } = selection;
      if (
        isSelectionAtStartOfTable($from, selection) &&
        $from.parent.type.name === 'paragraph' &&
        $from.depth === table.depth + 3 && // + 3 for: row, cell & paragraph nodes
        editorSelectionAPI
      ) {
        const { selectionRelativeToNode } =
          editorSelectionAPI.getSelectionPluginState(state);
        if (selectionRelativeToNode === RelativeSelectionPos.Before) {
          // we have a text selection at start of first table cell, directly inside a top level paragraph,
          // and want to set gap cursor selection before table
          return setGapCursorBeforeTable(editorSelectionAPI)()(state, dispatch);
        } else {
          // we have a text selection at start of first table cell, directly inside a top level paragraph,
          // and want to set a full table cell selection
          return selectFullTable(editorSelectionAPI)({
            node: table.node,
            startPos: table.start,
            dir: TableSelectionDirection.BottomToTop,
          })(state, dispatch);
        }
      }
    }
    return false;
  };

const arrowRightFromText =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  (selection: TextSelection): Command =>
  (state, dispatch) => {
    const table = findTable(selection);
    if (table) {
      const { $to } = selection;
      if (
        isSelectionAtEndOfTable($to, selection) &&
        $to.parent.type.name === 'paragraph' &&
        $to.depth === table.depth + 3 // + 3 for: row, cell & paragraph nodes
      ) {
        // we have a text selection at end of last table cell, directly inside a top level paragraph,
        // and want to set a full table cell selection
        return selectFullTable(editorSelectionAPI)({
          node: table.node,
          startPos: table.start,
          dir: TableSelectionDirection.TopToBottom,
        })(state, dispatch);
      }
    }
    return false;
  };

/**
 * Sets a cell selection over all the cells in the table node
 * We use this instead of selectTable from prosemirror-utils so we can control which
 * cell is the anchor and which is the head, and also so we can set the relative selection
 * pos in the selection plugin
 */
const selectFullTable =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  ({
    node,
    startPos,
    dir,
  }: {
    node: PmNode;
    startPos: number;
    dir: TableSelectionDirection;
  }): Command =>
  (state, dispatch) => {
    const { doc } = state;
    const { map } = TableMap.get(node);
    const $firstCell = doc.resolve(startPos + map[0]);
    const $lastCell = doc.resolve(startPos + map[map.length - 1]);

    let fullTableSelection: Selection;
    let selectionRelativeToNode: RelativeSelectionPos;
    if (dir === TableSelectionDirection.TopToBottom) {
      fullTableSelection = new CellSelection($firstCell, $lastCell) as any;
      selectionRelativeToNode = RelativeSelectionPos.End;
    } else {
      fullTableSelection = new CellSelection($lastCell, $firstCell) as any;
      selectionRelativeToNode = RelativeSelectionPos.Start;
    }
    if (editorSelectionAPI) {
      const tr = editorSelectionAPI.setSelectionRelativeToNode({
        selectionRelativeToNode,
        selection: fullTableSelection,
      })(state);

      if (dispatch) {
        dispatch(tr);
        return true;
      }
    }
    return false;
  };

const setSelectionAtStartOfFirstCell =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  (
    selection: CellSelection,
    selectionRelativeToNode?: RelativeSelectionPos,
  ): Command =>
  (state, dispatch) => {
    const { $anchorCell, $headCell } = selection;
    const $firstCell =
      $anchorCell.pos < $headCell.pos ? $anchorCell : $headCell;
    const $firstPosInsideCell = state.doc.resolve($firstCell.pos + 1);

    // check if first pos should have a gap cursor, otherwise find closest text selection
    const selectionAtStartOfCell = GapCursorSelection.valid($firstPosInsideCell)
      ? new GapCursorSelection($firstPosInsideCell, Side.LEFT)
      : Selection.findFrom($firstPosInsideCell, 1);

    if (editorSelectionAPI) {
      const tr = editorSelectionAPI.setSelectionRelativeToNode({
        selectionRelativeToNode,
        selection: selectionAtStartOfCell,
      })(state);

      if (dispatch) {
        dispatch(tr);
        return true;
      }
    }
    return false;
  };

const setSelectionAtEndOfLastCell =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  (
    selection: CellSelection,
    selectionRelativeToNode?: RelativeSelectionPos,
  ): Command =>
  (state, dispatch) => {
    const { $anchorCell, $headCell } = selection;
    const $lastCell = $anchorCell.pos > $headCell.pos ? $anchorCell : $headCell;
    const lastPosInsideCell =
      $lastCell.pos +
      ($lastCell.nodeAfter ? $lastCell.nodeAfter.content.size : 0) +
      1;
    const $lastPosInsideCell = state.doc.resolve(lastPosInsideCell);

    // check if last pos should have a gap cursor, otherwise find closest text selection
    const selectionAtEndOfCell = GapCursorSelection.valid($lastPosInsideCell)
      ? new GapCursorSelection($lastPosInsideCell, Side.RIGHT)
      : Selection.findFrom($lastPosInsideCell, -1);

    if (editorSelectionAPI) {
      const tr = editorSelectionAPI.setSelectionRelativeToNode({
        selectionRelativeToNode,
        selection: selectionAtEndOfCell,
      })(state);

      if (dispatch) {
        dispatch(tr);
        return true;
      }
    }
    return false;
  };

const setGapCursorBeforeTable =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  (): Command =>
  (state, dispatch) => {
    const table = findTable(state.selection);
    if (table) {
      const $beforeTablePos = state.doc.resolve(table.pos);
      if (GapCursorSelection.valid($beforeTablePos)) {
        const selectionBeforeTable = new GapCursorSelection(
          $beforeTablePos,
          Side.LEFT,
        );
        if (editorSelectionAPI) {
          const tr = editorSelectionAPI.setSelectionRelativeToNode({
            selectionRelativeToNode: undefined,
            selection: selectionBeforeTable,
          })(state);

          if (dispatch) {
            dispatch(tr);
            return true;
          }
        }
      }
    }
    return false;
  };

const setGapCursorAfterTable =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null) =>
  (): Command =>
  (state, dispatch) => {
    const table = findTable(state.selection);
    if (table) {
      const $afterTablePos = state.doc.resolve(table.pos + table.node.nodeSize);
      if (GapCursorSelection.valid($afterTablePos)) {
        const selectionAfterTable = new GapCursorSelection(
          $afterTablePos,
          Side.RIGHT,
        );

        if (editorSelectionAPI) {
          const tr = editorSelectionAPI.setSelectionRelativeToNode({
            selectionRelativeToNode: undefined,
            selection: selectionAfterTable,
          })(state);

          if (dispatch) {
            dispatch(tr);
            return true;
          }
        }
        return false;
      }
    }
    return false;
  };

const isSelectionAtStartOfTable = ($pos: ResolvedPos, selection: Selection) =>
  isSelectionAtStartOfNode($pos, findTable(selection));

const isSelectionAtEndOfTable = ($pos: ResolvedPos, selection: Selection) =>
  isSelectionAtEndOfNode($pos, findTable(selection));
