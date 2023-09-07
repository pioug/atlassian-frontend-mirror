import { createContext, useContext } from 'react';

import invariant from 'tiny-invariant';

import type { ColumnType } from '../data/people';

export type BoardContextProps = {
  getColumns: () => ColumnType[];

  reorderColumn: (args: { startIndex: number; finishIndex: number }) => void;

  reorderCard: (args: {
    columnId: string;
    startIndex: number;
    finishIndex: number;
  }) => void;

  moveCard: (args: {
    startColumnId: string;
    finishColumnId: string;
    itemIndexInStartColumn: number;
    itemIndexInFinishColumn?: number;
  }) => void;

  registerCard: (args: {
    cardId: string;
    actionMenuTrigger: HTMLElement;
  }) => void;

  instanceId: symbol;
};

export const BoardContext = createContext<BoardContextProps | null>(null);

export function useBoardContext(): BoardContextProps {
  const value = useContext(BoardContext);
  invariant(value, 'cannot find BoardContext provider');
  return value;
}
