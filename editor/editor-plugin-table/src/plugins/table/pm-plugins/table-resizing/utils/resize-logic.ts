import { ColumnState, getFreeSpace } from './column-state';
import { bulkColumnsResize, getTotalWidth } from './resize-state';
import { ResizeState } from './types';

export const growColumn = (
  state: ResizeState,
  colIndex: number,
  amount: number,
  selectedColumns?: number[],
): ResizeState => {
  // can't grow the last column
  if (!state.cols[colIndex + 1]) {
    return state;
  }
  const res = moveSpaceFrom(state, colIndex + 1, colIndex, amount);
  const remaining = amount - res.amount;
  let newState = res.state;

  if (remaining > 0) {
    newState = stackSpace(newState, colIndex, remaining).state;
  }
  if (selectedColumns) {
    return bulkColumnsResize(newState, selectedColumns, colIndex);
  }

  return newState;
};

export const shrinkColumn = (
  state: ResizeState,
  colIndex: number,
  amount: number,
  selectedColumns?: number[],
): ResizeState => {
  // try to shrink dragging column by giving from the column to the right first
  const res = moveSpaceFrom(state, colIndex, colIndex + 1, -amount);
  let newState = res.state;

  const isOverflownTable = getTotalWidth(newState) > newState.maxSize;
  const isLastColumn = !newState.cols[colIndex + 1];
  // stop resizing the last column once table is not overflown
  if (isLastColumn && !isOverflownTable) {
    return newState;
  }

  const remaining = amount + res.amount;
  if (remaining < 0) {
    newState = stackSpace(newState, colIndex + 1, remaining).state;
  }
  if (selectedColumns) {
    return bulkColumnsResize(newState, selectedColumns, colIndex);
  }

  return newState;
};

export function reduceSpace(
  state: ResizeState,
  amount: number,
  ignoreCols: number[] = [],
): ResizeState {
  let remaining = amount;

  // keep trying to resolve resize request until we run out of free space,
  // or nothing to resize
  while (remaining > 0) {
    // filter candidates only with free space
    const candidates = state.cols.filter((column) => {
      return getFreeSpace(column) && ignoreCols.indexOf(column.index) === -1;
    });
    if (candidates.length === 0) {
      break;
    }
    const requestedResize = Math.floor(remaining / candidates.length);
    if (requestedResize === 0) {
      break;
    }

    candidates.forEach((candidate) => {
      let newWidth = candidate.width - requestedResize;
      if (newWidth < candidate.minWidth) {
        // If the new requested width is less than our min
        // Calc what width we didn't use, we'll try extract that
        // from other cols.
        const remainder = candidate.minWidth - newWidth;
        newWidth = candidate.minWidth;
        remaining = remaining - requestedResize + remainder;
      } else {
        remaining -= requestedResize;
      }

      state = {
        ...state,
        cols: [
          ...state.cols.slice(0, candidate.index),
          { ...candidate, width: newWidth },
          ...state.cols.slice(candidate.index + 1),
        ],
      };
    });
  }

  return state;
}

enum ColType {
  SOURCE = 'src',
  DEST = 'dest',
}

// TODO: should handle when destIdx:
// - is beyond the range, and then not give it back
function moveSpaceFrom(
  state: ResizeState,
  srcIdx: number,
  destIdx: number,
  amount: number,
  useFreeSpace: boolean = true,
): { state: ResizeState; amount: number } {
  const srcCol = state.cols[srcIdx];
  const destCol = state.cols[destIdx];

  if (useFreeSpace) {
    const freeSpace = getFreeSpace(srcCol);
    // if taking more than source column's free space, only take that much
    if (amountFor(ColType.DEST)(amount) > freeSpace) {
      amount = amount > 0 ? freeSpace : -freeSpace;
    }
  }

  // if the source column shrinks past its min size, don't give the space away
  if (
    amountFor(ColType.SOURCE)(amount) < 0 &&
    widthFor(ColType.SOURCE)(amount, srcCol, destCol) < srcCol.minWidth
  ) {
    amount = srcCol.width - srcCol.minWidth;
  }

  const newDest = destCol
    ? { ...destCol, width: widthFor(ColType.DEST)(amount, srcCol, destCol) }
    : undefined;
  if (!newDest && amountFor(ColType.SOURCE)(amount) < 0) {
    // non-zero-sum game, ensure that we're not removing more than the total table width either
    const totalWidth = getTotalWidth(state);
    if (
      totalWidth -
        srcCol.width +
        widthFor(ColType.SOURCE)(amount, srcCol, destCol) <
      state.maxSize
    ) {
      // would shrink table below max width, stop it
      amount = state.maxSize - (totalWidth - srcCol.width) - srcCol.width - 1;
    }
  }

  const newSrc = {
    ...srcCol,
    width: widthFor(ColType.SOURCE)(amount, srcCol, destCol),
  };

  const newCols = state.cols
    .map((existingCol, idx) =>
      idx === srcIdx ? newSrc : idx === destIdx ? newDest : existingCol,
    )
    .filter(Boolean) as ColumnState[];

  return { state: { ...state, cols: newCols }, amount };
}

function stackSpace(
  state: ResizeState,
  destIdx: number,
  amount: number,
): { state: ResizeState; remaining: number } {
  let candidates = getCandidates(state, destIdx, amount);

  while (candidates.length && amount) {
    // search for most (or least) free space in candidates
    let candidateIdx = findNextFreeColumn(candidates, amount);
    if (candidateIdx === -1) {
      // stack to the right -> growing the dragging column and go overflow
      if (amount > 0) {
        return {
          state: {
            ...state,
            cols: [
              ...state.cols.slice(0, destIdx),
              {
                ...state.cols[destIdx],
                width: state.cols[destIdx].width + amount,
              },
              ...state.cols.slice(destIdx + 1),
            ],
          },
          remaining: amount,
        };
      }

      // stacking to the left, if no free space remains
      break;
    }

    const column = candidates.find((col) => col.index === candidateIdx);
    if (!column || getFreeSpace(column) <= 0) {
      // no more columns with free space remain
      break;
    }

    const res = moveSpaceFrom(state, column.index, destIdx, amount);
    state = res.state;
    amount -= res.amount;

    candidates = candidates.filter((col) => col.index !== candidateIdx);
  }

  return {
    state,
    remaining: amount,
  };
}

function findNextFreeColumn(columns: ColumnState[], amount: number): number {
  if (columns.length === 0) {
    return -1;
  }
  const direction = amount < 0 ? 'left' : 'right';
  if (direction === 'left') {
    columns = columns.slice().reverse();
  }

  let freeIndex = -1;
  columns.forEach((column) => {
    if (getFreeSpace(column) && freeIndex === -1) {
      freeIndex = column.index;
    }
  });

  if (freeIndex === -1) {
    return -1;
  }

  return freeIndex;
}

function amountFor(colType: ColType): (amount: number) => number {
  return (amount) =>
    colType === ColType.SOURCE
      ? amount > 0
        ? -amount
        : amount
      : amount < 0
      ? -amount
      : amount;
}

function widthFor(
  colType: ColType,
): (amount: number, srcCol: ColumnState, destCol: ColumnState) => number {
  return (amount, srcCol, destCol) =>
    (colType === ColType.SOURCE ? srcCol : destCol).width +
    amountFor(colType)(amount);
}

function getCandidates(
  state: ResizeState,
  destIdx: number,
  amount: number,
): ColumnState[] {
  const candidates = state.cols;

  // only consider rows after the selected column in the direction of resize
  return amount < 0
    ? candidates.slice(0, destIdx)
    : candidates.slice(destIdx + 1);
}
