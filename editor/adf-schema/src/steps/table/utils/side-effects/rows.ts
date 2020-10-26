import { Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import { Mappable, StepMap, Transform } from 'prosemirror-transform';
import { TableRect } from '@atlaskit/editor-tables/table-map';
import { hasMergedColumns } from '../table-map';
import { RowSideEffect, RowSideEffectJSON } from './types';
import { Cell } from '../cells-at-column';

function mergedRanges(first: number[], second: number[]) {
  const newRanges: number[] = [];
  const firstLength = first.length;
  const secondLength = second.length;

  let i = 0;
  let j = 0;
  while (i < firstLength && j < secondLength) {
    if (first[i] < second[j]) {
      newRanges.push(first[i], first[i + 1], first[i + 2]);
      i += 3;
    } else {
      newRanges.push(second[j], second[j + 1], second[j + 2]);
      j += 3;
    }
  }

  if (i < firstLength) {
    newRanges.push(...first.slice(i));
  }
  if (j < secondLength) {
    newRanges.push(...second.slice(i));
  }
  return newRanges;
}

function increaseRowSpan(tr: Transform, rect: TableRect, row: number): void {
  const { map, tableStart } = rect;
  for (let col = 0; col < map.width; col++) {
    let index = row * map.width + col;
    let pos = map.map[index];
    const mappedPos = tr.mapping.map(pos + tableStart);
    let attrs = tr.doc.nodeAt(mappedPos)!.attrs;
    tr.setNodeMarkup(mappedPos, undefined, {
      ...attrs,
      rowspan: attrs.rowspan + 1,
    });
    col += attrs.colspan - 1;
  }
}

function decreaseRowspan(
  tr: Transform,
  rect: TableRect,
  row: number,
  colToRemove: number,
): number {
  let skipRows = 0;
  const { map, table, tableStart } = rect;
  for (let col = 0; col < map.width; col++) {
    let index = row * map.width + col;
    let pos = map.map[index];
    if (row > 0 && pos === map.map[index - map.width]) {
      // If this cell starts in the row above, simply reduce its rowspan
      const mappedPos = tr.mapping.map(pos + tableStart);
      let attrs = tr.doc.nodeAt(mappedPos)!.attrs;
      tr.setNodeMarkup(mappedPos, undefined, {
        ...attrs,
        rowspan: attrs.rowspan - 1,
      });
      col += attrs.colspan - 1;
    } else if (col === colToRemove) {
      skipRows = table.nodeAt(pos)!.attrs.rowspan - 1;
    }
  }
  return skipRows;
}

function isLastCellInRow(rect: TableRect, row: number, col: number): boolean {
  const rowNode = rect.table.child(row);
  if (!rowNode) {
    return false;
  }
  return rowNode.childCount === 1 && !hasMergedColumns(rect.map, row, col);
}

interface RowsHandler {
  handle: (
    tr: Transform,
    rect: TableRect,
    row: number,
    col: number,
    cell: Cell,
  ) => {
    handled: boolean;
    skipRows?: number;
  };

  end: (tr: Transform, rect: TableRect, col: number) => void;
}

function removeRowWithLastCell(
  tr: Transform,
  rect: TableRect,
  row: number,
  _col: number,
): {
  skipRows: number;
  row: RowSideEffect;
} {
  // Get row pos
  let from = rect.tableStart;
  for (let i = 0; i < row; i++) {
    from += rect.table.child(i).nodeSize;
  }
  const rowNode = rect.table.child(row);
  let to = from + rowNode.nodeSize;

  // Create sideEffect and delete the row
  // We store original row position before modifications
  tr.delete(tr.mapping.map(from), tr.mapping.map(to));

  // Change rowspan of all cells except current col and get the rows to skip
  const skipRows = decreaseRowspan(tr, rect, row, _col);

  return {
    skipRows,
    row: {
      from,
      to,
      rowNode: rowNode.copy(rowNode.content),
    },
  };
}

function addRow(
  tr: Transform,
  rect: TableRect,
  prevRow: number,
  rowSideEffect: RowSideEffect,
): number {
  const cellNode = rowSideEffect.rowNode.child(0);

  tr.insert(tr.mapping.map(rowSideEffect.from), rowSideEffect.rowNode);

  increaseRowSpan(tr, rect, prevRow);
  return cellNode.attrs.rowspan - 1;
}

export class RowsSideEffectHandler {
  public rows?: RowSideEffect[];

  constructor(rowsSideEffect?: RowSideEffect[]) {
    this.rows = rowsSideEffect;
  }

  private deleteHandler = (): RowsHandler => {
    const newRows: RowSideEffect[] = [];
    return {
      handle: (tr, rect, row, col, cell) => {
        if (!isLastCellInRow(rect, row, col)) {
          return {
            handled: false,
          };
        }

        const { row: rowSideEffect, skipRows } = removeRowWithLastCell(
          tr,
          rect,
          row,
          col,
        );
        newRows.push(rowSideEffect);

        return { handled: true, skipRows: skipRows };
      },
      end: () => {
        if (newRows.length > 0) {
          this.rows = newRows;
        } else {
          this.rows = undefined;
        }
      },
    };
  };

  private addHandler = (): RowsHandler => {
    let lastCellFrom = 0;
    let i = 0;

    return {
      handle: (tr, rect, row, col, cell) => {
        // // If not sideEffects stored return;
        if (!this.rows || i >= this.rows.length) {
          return { handled: false };
        }

        // Next row to add;
        let skipRows: undefined | number;
        let nextRow: RowSideEffect;
        while (
          (nextRow = this.rows[i]) &&
          nextRow.from > lastCellFrom &&
          nextRow.from < cell.from
        ) {
          // I am in between of the previous and next row in the table;
          skipRows = addRow(tr, rect, row - 1, nextRow);
          i++;
        }
        lastCellFrom = cell.from;
        if (!skipRows || skipRows === 0) {
          return { handled: false };
        }

        return {
          handled: true,
          skipRows: skipRows - 1,
        };
      },
      end: (tr, rect, col: number) => {
        if (!this.rows || i >= this.rows.length) {
          return;
        }

        // Add rows at the end of the table
        let nextRow: RowSideEffect;
        while ((nextRow = this.rows[i])) {
          addRow(tr, rect, rect.map.height - 1, nextRow);
          i++;
        }
      },
    };
  };

  start(isDelete: boolean): RowsHandler {
    if (isDelete) {
      return this.deleteHandler();
    }

    return this.addHandler();
  }

  addRowRanges(ranges: number[], isDelete: boolean): number[] {
    if (!this.rows) {
      return ranges;
    }

    const rowRanges: number[] = [];
    for (const row of this.rows) {
      const { from, to } = row;
      if (isDelete) {
        rowRanges.push(from, to - from, 0);
      } else {
        rowRanges.push(from, 0, to - from);
      }
    }

    // Merged ranges
    return mergedRanges(ranges, rowRanges);
  }

  map(mapping: Mappable): RowSideEffect[] {
    return [];
  }

  invert(
    originalDoc: ProseMirrorNode,
    isDelete: boolean,
    map: StepMap,
  ): RowSideEffect[] | undefined {
    if (!this.rows) {
      return;
    }
    const invertedRows: RowSideEffect[] = [];

    for (const row of this.rows) {
      if (isDelete) {
        // Moving from delete to add keep the inverted rows + offset
        let offset = map.map(row.from) - row.from;
        invertedRows.push({
          ...row,
          from: row.from + offset,
          to: row.from + offset,
        });
      } else {
        // Moving from add to delete keep
        // TODO: I think we need to add the respective cell into the cellSteps...... not sure....
      }
    }
    return invertedRows;
  }

  toJSON(): RowSideEffectJSON[] | undefined {
    if (!this.rows) {
      return;
    }
    const rowsInJson: RowSideEffectJSON[] = [];

    for (const row of this.rows) {
      rowsInJson.push({
        from: row.from,
        to: row.to,
        rowNode: row.rowNode.toJSON(),
      });
    }

    return rowsInJson;
  }

  static fromJSON(schema: Schema, json: RowSideEffectJSON[]): RowSideEffect[] {
    const rowSideEffects: RowSideEffect[] = [];

    for (const row of json) {
      rowSideEffects.push({
        from: row.from,
        to: row.to,
        rowNode: schema.nodeFromJSON(row.rowNode),
      });
    }

    return rowSideEffects;
  }
}
