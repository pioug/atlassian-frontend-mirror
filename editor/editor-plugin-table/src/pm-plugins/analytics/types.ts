export type ActionType = 'none' | 'addRowOrColumn' | 'copyOrCut' | 'pasted';

export type RowOrColumnMovedState = {
  type?: 'row' | 'column';
  /** used to confirm if same number of cells was copied and pasted */
  numberOfCells?: number;
  currentActions: Array<ActionType>;
};

export type AnalyticPluginState = {
  rowOrColumnMoved: RowOrColumnMovedState;
};

export const defaultState = {
  rowOrColumnMoved: {
    type: undefined,
    numberOfCells: undefined,
    currentActions: [],
  },
} as AnalyticPluginState;
