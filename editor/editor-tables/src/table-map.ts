import { Node as PMNode } from 'prosemirror-model';

import { Axis } from './types';

// Because working with row and column-spanning cells is not quite
// trivial, this code builds up a descriptive structure for a given
// table node. The structures are cached with the (persistent) table
// nodes as key, so that they only have to be recomputed when the
// content of the table changes.
//
// This does mean that they have to store table-relative, not
// document-relative positions. So code that uses them will typically
// compute the start position of the table and offset positions passed
// to or gotten from this structure by that amount.

let readFromCache: (key: PMNode) => TableMap | undefined,
  addToCache: (key: PMNode, value: TableMap) => TableMap;
// Prefer using a weak map to cache table maps. Fall back on a
// fixed-size cache if that's not supported.
if (typeof WeakMap !== 'undefined') {
  let cache = new WeakMap<PMNode, TableMap | undefined>();
  readFromCache = (key: PMNode) => cache.get(key);
  addToCache = (key: PMNode, value: TableMap) => {
    cache.set(key, value);
    return value;
  };
} else {
  let cache = <any>[];
  let cacheSize = 10;
  let cachePos = 0;
  readFromCache = (key: PMNode) => {
    for (let i = 0; i < cache.length; i += 2) {
      if (cache[i] === key) {
        return cache[i + 1];
      }
    }
  };
  addToCache = (key: PMNode, value: TableMap) => {
    if (cachePos === cacheSize) {
      cachePos = 0;
    }
    cache[cachePos++] = key;
    return (cache[cachePos++] = value);
  };
}

export class Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  constructor(left: number, top: number, right: number, bottom: number) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  }
}

export interface TableRect extends Rect {
  map: TableMap;
  tableStart: number;
  table: PMNode;
}

export type TableContext = {
  map: TableMap;
  tableStart: number;
  table: PMNode;
};

export enum TableProblemTypes {
  COLLISION = 'collision',
  OVERLONG_ROWSPAN = 'overlong_rowspan',
  MISSING = 'missing',
  COLWIDTH_MISMATCH = 'colwidth mismatch',
}

export type TableProblemCollision = {
  type: TableProblemTypes.COLLISION;
  row: number;
  pos: number;
  n: number;
};

export type TableProblemLongRowspan = {
  type: TableProblemTypes.OVERLONG_ROWSPAN;
  pos: number;
  n: number;
};

export type TableProblemMissing = {
  type: TableProblemTypes.MISSING;
  row: number;
  n: number;
};

export type TableProblemColWidthMismatch = {
  type: TableProblemTypes;
  pos: number;
  colwidth: number;
};

export type TableProblem =
  | TableProblemCollision
  | TableProblemLongRowspan
  | TableProblemMissing
  | TableProblemColWidthMismatch;

// ::- A table map describes the structore of a given table. To avoid
// recomputing them all the time, they are cached per table node. To
// be able to do that, positions saved in the map are relative to the
// start of the table, rather than the start of the document.
export class TableMap {
  // The width of the table
  width: number;
  // The table's height
  height: number;
  map: number[];
  problems?: TableProblem[] | null;
  constructor(
    width: number,
    height: number,
    map: number[],
    problems?: TableProblem[] | null,
  ) {
    this.width = width;
    this.height = height;
    // :: [number] A width * height array with the start position of
    // the cell covering that part of the table in each slot
    this.map = map;
    // An optional array of problems (cell overlap or non-rectangular
    // shape) for the table, used by the table normalizer.
    this.problems = problems;
  }

  // :: (number) → Rect
  // Find the dimensions of the cell at the given position.
  findCell(pos: number) {
    for (let i = 0; i < this.map.length; i++) {
      let curPos = this.map[i];
      if (curPos !== pos) {
        continue;
      }
      let left = i % this.width;
      let top = (i / this.width) | 0;
      let right = left + 1;
      let bottom = top + 1;
      for (let j = 1; right < this.width && this.map[i + j] === curPos; j++) {
        right++;
      }
      for (
        let j = 1;
        bottom < this.height && this.map[i + this.width * j] === curPos;
        j++
      ) {
        bottom++;
      }
      return new Rect(left, top, right, bottom);
    }
    throw new RangeError('No cell with offset ' + pos + ' found');
  }

  // Find the left side of the cell at the given position.
  colCount(pos: number) {
    for (let i = 0; i < this.map.length; i++) {
      if (this.map[i] === pos) {
        return i % this.width;
      }
    }
    throw new RangeError('No cell with offset ' + pos + ' found');
  }

  // :: (number, string, number) → ?number
  // Find the next cell in the given direction, starting from the cell
  // at `pos`, if any.
  nextCell(pos: number, axis: Axis, dir: number) {
    let { left, right, top, bottom } = this.findCell(pos);
    if (axis === 'horiz') {
      if (dir < 0 ? left === 0 : right === this.width) {
        return null;
      }
      return this.map[top * this.width + (dir < 0 ? left - 1 : right)];
    } else {
      if (dir < 0 ? top === 0 : bottom === this.height) {
        return null;
      }
      return this.map[left + this.width * (dir < 0 ? top - 1 : bottom)];
    }
  }

  // :: (number, number) → Rect
  // Get the rectangle spanning the two given cells.
  rectBetween(a: number, b: number) {
    let {
      left: leftA,
      right: rightA,
      top: topA,
      bottom: bottomA,
    } = this.findCell(a);
    let {
      left: leftB,
      right: rightB,
      top: topB,
      bottom: bottomB,
    } = this.findCell(b);
    return new Rect(
      Math.min(leftA, leftB),
      Math.min(topA, topB),
      Math.max(rightA, rightB),
      Math.max(bottomA, bottomB),
    );
  }

  // :: (Rect) → [number]
  // Return the position of all cells that have the top left corner in
  // the given rectangle.
  cellsInRect(rect: Rect) {
    let result = [];
    let seen: { [key: number]: boolean } = {};
    for (let row = rect.top; row < rect.bottom; row++) {
      for (let col = rect.left; col < rect.right; col++) {
        let index = row * this.width + col;
        let pos = this.map[index];
        if (seen[pos]) {
          continue;
        }
        seen[pos] = true;
        if (
          (col !== rect.left || !col || this.map[index - 1] !== pos) &&
          (row !== rect.top || !row || this.map[index - this.width] !== pos)
        ) {
          result.push(pos);
        }
      }
    }
    return result;
  }

  // :: (number, number, Node) → number
  // Return the position at which the cell at the given row and column
  // starts, or would start, if a cell started there.
  positionAt(row: number, col: number, table: PMNode) {
    for (let i = 0, rowStart = 0; ; i++) {
      let rowEnd = rowStart + table.child(i).nodeSize;
      if (i === row) {
        let index = col + row * this.width;
        let rowEndIndex = (row + 1) * this.width;
        // Skip past cells from previous rows (via rowspan)
        while (index < rowEndIndex && this.map[index] < rowStart) {
          index++;
        }
        return index === rowEndIndex ? rowEnd - 1 : this.map[index];
      }
      rowStart = rowEnd;
    }
  }

  // :: (Node) → TableMap
  // Find the table map for the given table node.
  static get(table: PMNode) {
    return readFromCache(table) || addToCache(table, computeMap(table));
  }
}

// Compute a table map.
function computeMap(table: PMNode) {
  if (table.type.spec.tableRole !== 'table') {
    throw new RangeError('Not a table node: ' + table.type.name);
  }
  let width = findWidth(table);
  let height = table.childCount;
  let map = [],
    mapPos = 0,
    problems: TableProblem[] | null = null,
    colWidths = [];
  for (let i = 0, e = width * height; i < e; i++) {
    map[i] = 0;
  }

  for (let row = 0, pos = 0; row < height; row++) {
    let rowNode = table.child(row);
    pos++;
    for (let i = 0; ; i++) {
      while (mapPos < map.length && map[mapPos] !== 0) {
        mapPos++;
      }
      if (i === rowNode.childCount) {
        break;
      }
      let cellNode = rowNode.child(i),
        { colspan, rowspan, colwidth } = cellNode.attrs;
      for (let h = 0; h < rowspan; h++) {
        if (h + row >= height) {
          (problems || (problems = [])).push({
            type: TableProblemTypes.OVERLONG_ROWSPAN,
            pos,
            n: rowspan - h,
          });
          break;
        }
        let start = mapPos + h * width;
        for (let w = 0; w < colspan; w++) {
          if (map[start + w] === 0) {
            map[start + w] = pos;
          } else {
            (problems || (problems = [])).push({
              type: TableProblemTypes.COLLISION,
              row,
              pos,
              n: colspan - w,
            });
          }
          let colW = colwidth && colwidth[w];
          if (colW) {
            let widthIndex = ((start + w) % width) * 2,
              prev = colWidths[widthIndex];
            if (
              prev == null ||
              (prev !== colW && colWidths[widthIndex + 1] === 1)
            ) {
              colWidths[widthIndex] = colW;
              colWidths[widthIndex + 1] = 1;
            } else if (prev === colW) {
              colWidths[widthIndex + 1]++;
            }
          }
        }
      }
      mapPos += colspan;
      pos += cellNode.nodeSize;
    }
    let expectedPos = (row + 1) * width;
    let missing = 0;
    while (mapPos < expectedPos) {
      if (map[mapPos++] === 0) {
        missing++;
      }
    }
    if (missing) {
      (problems || (problems = [])).push({
        type: TableProblemTypes.MISSING,
        row,
        n: missing,
      });
    }
    pos++;
  }

  let tableMap = new TableMap(width, height, map, problems);
  let badWidths = false;

  // For columns that have defined widths, but whose widths disagree
  // between rows, fix up the cells whose width doesn't match the
  // computed one.
  for (let i = 0; !badWidths && i < colWidths.length; i += 2) {
    if (colWidths[i] != null && colWidths[i + 1] < height) {
      badWidths = true;
    }
  }
  if (badWidths) {
    findBadColWidths(tableMap, colWidths, table);
  }

  return tableMap;
}

function findWidth(table: PMNode) {
  let width = -1;
  let hasRowSpan = false;
  for (let row = 0; row < table.childCount; row++) {
    let rowNode = table.child(row);
    let rowWidth = 0;
    if (hasRowSpan) {
      for (let j = 0; j < row; j++) {
        let prevRow = table.child(j);
        for (let i = 0; i < prevRow.childCount; i++) {
          let cell = prevRow.child(i);
          if (j + cell.attrs.rowspan > row) {
            rowWidth += cell.attrs.colspan;
          }
        }
      }
    }
    for (let i = 0; i < rowNode.childCount; i++) {
      let cell = rowNode.child(i);
      rowWidth += cell.attrs.colspan;
      if (cell.attrs.rowspan > 1) {
        hasRowSpan = true;
      }
    }
    if (width === -1) {
      width = rowWidth;
    } else if (width !== rowWidth) {
      width = Math.max(width, rowWidth);
    }
  }
  return width;
}

function findBadColWidths(map: TableMap, colWidths: number[], table: PMNode) {
  if (!map.problems) {
    map.problems = [];
  }
  let seen: { [key: number]: boolean } = {};
  for (let i = 0; i < map.map.length; i++) {
    let pos = map.map[i];
    if (seen[pos]) {
      continue;
    }
    seen[pos] = true;
    let node = table.nodeAt(pos) as PMNode,
      updated = null;
    for (let j = 0; j < node.attrs.colspan; j++) {
      let col = (i + j) % map.width,
        colWidth = colWidths[col * 2];
      if (
        colWidth != null &&
        (!node.attrs.colwidth || node.attrs.colwidth[j] !== colWidth)
      ) {
        (updated || (updated = freshColWidth(node.attrs)))[j] = colWidth;
      }
    }
    if (updated) {
      map.problems.unshift({
        type: TableProblemTypes.COLWIDTH_MISMATCH,
        pos,
        colwidth: updated,
      });
    }
  }
}

function freshColWidth(attrs: { [key: string]: any }) {
  if (attrs.colwidth) {
    return attrs.colwidth.slice();
  }
  let result = [];
  for (let i = 0; i < attrs.colspan; i++) {
    result.push(0);
  }
  return result;
}
