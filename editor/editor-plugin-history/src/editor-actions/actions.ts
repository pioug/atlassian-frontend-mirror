export enum HistoryActionTypes {
	UPDATE = 'UPDATE',
}

export interface HistoryAction {
	canRedo: boolean;
	canUndo: boolean;
	type: HistoryActionTypes.UPDATE;
}
