// Was copied from https://github.com/ProseMirror/prosemirror-tables/blob/master/src/cellselection.js

// This file defines a ProseMirror selection subclass that models
// table cell selections. The table plugin needs to be active to wire
// in the user interaction part of table selections (so that you
// actually get such selections when you select across cells).

import {
  Fragment,
  Node as PMNode,
  ResolvedPos,
  Slice,
} from 'prosemirror-model';
import { Selection, TextSelection, Transaction } from 'prosemirror-state';
import { Mapping } from 'prosemirror-transform';

import { CellBookmark } from './cell-bookmark';
import { TableMap } from './table-map';
import { SerializedCellSelection } from './types';
import { pointsAtCell } from './utils/cells';
import { removeColSpan } from './utils/colspan';
import { getCellSelectionRanges } from './utils/get-cell-selection-ranges';
import { inSameTable } from './utils/tables';

// ::- A [`Selection`](http://prosemirror.net/docs/ref/#state.Selection)
// subclass that represents a cell selection spanning part of a table.
// With the plugin enabled, these will be created when the user
// selects across cells, and will be drawn by giving selected cells a
// `selectedCell` CSS class.
export class CellSelection extends Selection {
  // :: (ResolvedPos, ?ResolvedPos)
  // A table selection is identified by its anchor and head cells. The
  // positions given to this constructor should point _before_ two
  // cells in the same table. They may be the same, to select a single
  // cell.
  public readonly $anchorCell: ResolvedPos;
  public readonly $headCell: ResolvedPos;
  public readonly visible: boolean;

  constructor($anchorCell: ResolvedPos, $headCell: ResolvedPos = $anchorCell) {
    const ranges = getCellSelectionRanges($anchorCell, $headCell);
    super(ranges[0].$from, ranges[0].$to, ranges);
    // :: ResolvedPos
    // A resolved position pointing _in front of_ the anchor cell (the one
    // that doesn't move when extending the selection).
    this.$anchorCell = $anchorCell;
    // :: ResolvedPos
    // A resolved position pointing in front of the head cell (the one
    // moves when extending the selection).
    this.$headCell = $headCell;

    this.visible = false;
  }

  public map(doc: PMNode, mapping: Mapping): Selection {
    const $anchorCell = doc.resolve(mapping.map(this.$anchorCell.pos));
    const $headCell = doc.resolve(mapping.map(this.$headCell.pos));
    if (
      pointsAtCell($anchorCell) &&
      pointsAtCell($headCell) &&
      inSameTable($anchorCell, $headCell)
    ) {
      const tableChanged = this.$anchorCell.node(-1) !== $anchorCell.node(-1);
      if (tableChanged && this.isRowSelection()) {
        return CellSelection.rowSelection($anchorCell, $headCell);
      }
      if (tableChanged && this.isColSelection()) {
        return CellSelection.colSelection($anchorCell, $headCell);
      }
      return new CellSelection($anchorCell, $headCell);
    }
    return TextSelection.between($anchorCell, $headCell);
  }

  // :: () → Slice
  // Returns a rectangular slice of table rows containing the selected
  // cells.
  public content(): Slice {
    const table = this.$anchorCell.node(-1);
    const map = TableMap.get(table);
    const start = this.$anchorCell.start(-1);
    const rect = map.rectBetween(
      this.$anchorCell.pos - start,
      this.$headCell.pos - start,
    );
    const seen: { [pos: number]: boolean } = {};
    const rows = [];
    for (let row = rect.top; row < rect.bottom; row++) {
      const rowContent: PMNode[] = [];
      for (
        let index = row * map.width + rect.left, col = rect.left;
        col < rect.right;
        col++, index++
      ) {
        const pos = map.map[index];
        if (!seen[pos]) {
          seen[pos] = true;
          const cellRect = map.findCell(pos);
          let cell = table.nodeAt(pos) as PMNode | null | undefined;
          if (cell === null || cell === undefined) {
            throw new Error(`No cell at position ${pos}`);
          }
          const extraLeft = rect.left - cellRect.left;
          const extraRight = cellRect.right - rect.right;
          if (extraLeft > 0 || extraRight > 0) {
            let { attrs } = cell;
            if (!attrs) {
              throw new Error(`No cell at position ${pos}`);
            }
            if (extraLeft > 0) {
              attrs = removeColSpan(attrs, 0, extraLeft);
            }
            if (extraRight > 0) {
              attrs = removeColSpan(
                attrs,
                attrs.colspan! - extraRight,
                extraRight,
              );
            }
            if (cellRect.left < rect.left) {
              cell = cell.type.createAndFill(attrs);
            } else {
              cell = cell.type.create(attrs, cell.content);
            }
          }
          if (cell === null || cell === undefined) {
            throw new Error(`No cell at position after create/createAndFill`);
          }
          if (cellRect.top < rect.top || cellRect.bottom > rect.bottom) {
            const attrs = {
              ...cell.attrs,
              rowspan:
                Math.min(cellRect.bottom, rect.bottom) -
                Math.max(cellRect.top, rect.top),
            };
            if (cellRect.top < rect.top) {
              cell = cell.type.createAndFill(attrs);
            } else {
              cell = cell.type.create(attrs, cell.content);
            }
          }
          if (cell === null || cell === undefined) {
            throw new Error(`No cell at position before rowContent.push`);
          }
          rowContent.push(cell);
        }
      }
      rows.push(table.child(row).copy(Fragment.from(rowContent)));
    }

    const fragment =
      this.isColSelection() && this.isRowSelection() ? table : rows;
    return new Slice(Fragment.from(fragment), 1, 1);
  }

  public replace(tr: Transaction, content = Slice.empty): void {
    const mapFrom = tr.steps.length;
    const { ranges } = this;
    for (let i = 0; i < ranges.length; i++) {
      const { $from, $to } = ranges[i];
      const mapping = tr.mapping.slice(mapFrom);
      tr.replace(
        mapping.map($from.pos),
        mapping.map($to.pos),
        i ? Slice.empty : content,
      );
    }
    const sel = Selection.findFrom(
      tr.doc.resolve(tr.mapping.slice(mapFrom).map(this.to)),
      -1,
    );
    if (sel) {
      tr.setSelection(sel);
    }
  }

  public replaceWith(tr: Transaction, node: PMNode): void {
    this.replace(tr, new Slice(Fragment.from(node), 0, 0));
  }

  public forEachCell(f: (node: PMNode, pos: number) => void): void {
    const table = this.$anchorCell.node(-1);
    const map = TableMap.get(table);
    const start = this.$anchorCell.start(-1);
    const cells = map.cellsInRect(
      map.rectBetween(this.$anchorCell.pos - start, this.$headCell.pos - start),
    );
    for (let i = 0; i < cells.length; i++) {
      const cell = table.nodeAt(cells[i]);
      if (cell === null || cell === undefined) {
        throw new Error(`undefined cell at pos ${cells[i]}`);
      }
      f(cell, start + cells[i]);
    }
  }

  // :: () → bool
  // True if this selection goes all the way from the top to the
  // bottom of the table.
  public isColSelection(): boolean {
    if (!this.$anchorCell || !this.$headCell) {
      throw new Error('invalid $anchorCell or $headCell');
    }

    const anchorTop = this.$anchorCell.index(-1);
    const headTop = this.$headCell.index(-1);
    if (Math.min(anchorTop, headTop) > 0) {
      return false;
    }
    const anchorBot = anchorTop + this.$anchorCell.nodeAfter!.attrs.rowspan;
    const headBot = headTop + this.$headCell.nodeAfter!.attrs.rowspan;
    return Math.max(anchorBot, headBot) === this.$headCell.node(-1).childCount;
  }

  // :: (ResolvedPos, ?ResolvedPos) → CellSelection
  // Returns the smallest column selection that covers the given anchor
  // and head cell.
  public static colSelection(
    $anchorCell: ResolvedPos,
    $headCell: ResolvedPos = $anchorCell,
  ): CellSelection {
    let $calculatedAnchorCell = $anchorCell;
    let $calculatedHeadCell = $headCell;

    const map = TableMap.get($calculatedAnchorCell.node(-1));
    const start = $calculatedAnchorCell.start(-1);
    const anchorRect = map.findCell($calculatedAnchorCell.pos - start);
    const headRect = map.findCell($calculatedHeadCell.pos - start);
    const doc = $calculatedAnchorCell.node(0);
    if (anchorRect.top <= headRect.top) {
      if (anchorRect.top > 0) {
        $calculatedAnchorCell = doc.resolve(start + map.map[anchorRect.left]);
      }
      if (headRect.bottom < map.height) {
        $calculatedHeadCell = doc.resolve(
          start + map.map[map.width * (map.height - 1) + headRect.right - 1],
        );
      }
    } else {
      if (headRect.top > 0) {
        $calculatedHeadCell = doc.resolve(start + map.map[headRect.left]);
      }
      if (anchorRect.bottom < map.height) {
        $calculatedAnchorCell = doc.resolve(
          start + map.map[map.width * (map.height - 1) + anchorRect.right - 1],
        );
      }
    }
    return new CellSelection($calculatedAnchorCell, $calculatedHeadCell);
  }

  // :: () → bool
  // True if this selection goes all the way from the left to the
  // right of the table.
  public isRowSelection(): boolean {
    if (!this.$anchorCell || !this.$headCell) {
      return false;
    }

    const map = TableMap.get(this.$anchorCell.node(-1));
    const start = this.$anchorCell.start(-1);
    const anchorLeft = map.colCount(this.$anchorCell.pos - start);
    const headLeft = map.colCount(this.$headCell.pos - start);
    if (Math.min(anchorLeft, headLeft) > 0) {
      return false;
    }
    const anchorRight = anchorLeft + this.$anchorCell.nodeAfter!.attrs.colspan;
    const headRight = headLeft + this.$headCell.nodeAfter!.attrs.colspan;
    return Math.max(anchorRight, headRight) === map.width;
  }

  public eq(other: CellSelection): boolean {
    return (
      other instanceof CellSelection &&
      other.$anchorCell.pos === this.$anchorCell.pos &&
      other.$headCell.pos === this.$headCell.pos
    );
  }

  // :: (ResolvedPos, ?ResolvedPos) → CellSelection
  // Returns the smallest row selection that covers the given anchor
  // and head cell.
  public static rowSelection(
    $anchorCell: ResolvedPos,
    $headCell: ResolvedPos = $anchorCell,
  ): CellSelection {
    let $calculatedAnchorCell = $anchorCell;
    let $calculatedHeadCell = $headCell;
    const map = TableMap.get($calculatedAnchorCell.node(-1));
    const start = $calculatedAnchorCell.start(-1);
    const anchorRect = map.findCell($calculatedAnchorCell.pos - start);
    const headRect = map.findCell($calculatedHeadCell.pos - start);
    const doc = $calculatedAnchorCell.node(0);
    if (anchorRect.left <= headRect.left) {
      if (anchorRect.left > 0) {
        $calculatedAnchorCell = doc.resolve(
          start + map.map[anchorRect.top * map.width],
        );
      }
      if (headRect.right < map.width) {
        $calculatedHeadCell = doc.resolve(
          start + map.map[map.width * (headRect.top + 1) - 1],
        );
      }
    } else {
      if (headRect.left > 0) {
        $calculatedHeadCell = doc.resolve(
          start + map.map[headRect.top * map.width],
        );
      }
      if (anchorRect.right < map.width) {
        $calculatedAnchorCell = doc.resolve(
          start + map.map[map.width * (anchorRect.top + 1) - 1],
        );
      }
    }
    return new CellSelection($calculatedAnchorCell, $calculatedHeadCell);
  }

  public toJSON(): SerializedCellSelection {
    return {
      type: 'cell',
      anchor: this.$anchorCell.pos,
      head: this.$headCell.pos,
    };
  }

  public static fromJSON(
    doc: PMNode,
    json: SerializedCellSelection,
  ): CellSelection {
    return new CellSelection(doc.resolve(json.anchor), doc.resolve(json.head));
  }

  // :: (Node, number, ?number) → CellSelection
  public static create(
    doc: PMNode,
    anchorCell: number,
    headCell: number = anchorCell,
  ): CellSelection {
    return new CellSelection(doc.resolve(anchorCell), doc.resolve(headCell));
  }

  public getBookmark(): CellBookmark {
    return new CellBookmark(this.$anchorCell.pos, this.$headCell.pos);
  }
}

Selection.jsonID('cell', CellSelection);
