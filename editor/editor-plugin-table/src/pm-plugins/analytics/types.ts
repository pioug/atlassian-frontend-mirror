export type ActionType = 'none' | 'addRowOrColumn' | 'copyOrCut' | 'pasted';

export type RowOrColumnMovedState = {
	currentActions: Array<ActionType>;
	/** used to confirm if same number of cells was copied and pasted */
	numberOfCells?: number;
	type?: 'row' | 'column';
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
