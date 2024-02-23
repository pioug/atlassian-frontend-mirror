import React from 'react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

import { autoScrollForElements } from '../src/entry-point/element';
import { unsafeOverflowAutoScrollForElements } from '../src/entry-point/unsafe-overflow/element';

import { Board } from './pieces/board';
import { BoardContext, TBoardContext } from './pieces/board-context';

const context: TBoardContext = {
  autoScrollBoard: (
    args: Parameters<typeof autoScrollForElements>[0],
  ): ReturnType<typeof autoScrollForElements> => {
    return combine(
      autoScrollForElements(args),
      unsafeOverflowAutoScrollForElements({
        ...args,
        // allow auto scrolling all around the board
        getOverflow: () => ({
          fromTopEdge: {
            top: 6000,
            right: 6000,
            left: 6000,
          },
          fromRightEdge: {
            top: 6000,
            right: 6000,
            bottom: 6000,
          },
          fromBottomEdge: {
            right: 6000,
            bottom: 6000,
            left: 6000,
          },
          fromLeftEdge: {
            top: 6000,
            left: 6000,
            bottom: 6000,
          },
        }),
      }),
    );
  },
  autoScrollColumn: (
    args: Parameters<typeof autoScrollForElements>[0],
  ): ReturnType<typeof autoScrollForElements> => {
    return combine(
      autoScrollForElements(args),
      unsafeOverflowAutoScrollForElements({
        ...args,
        // allow auto scrolling above and below the column
        getOverflow: () => ({
          fromTopEdge: {
            top: 6000,
            right: 0,
            left: 0,
          },
          fromBottomEdge: {
            right: 0,
            bottom: 6000,
            left: 0,
          },
        }),
      }),
    );
  },
};

export default function UnsafeOverflow() {
  return (
    <BoardContext.Provider value={context}>
      <Board />
    </BoardContext.Provider>
  );
}
