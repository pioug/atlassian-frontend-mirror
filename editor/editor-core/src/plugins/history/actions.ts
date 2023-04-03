export enum HistoryActionTypes {
  UPDATE = 'UPDATE',
}

export interface HistoryAction {
  type: HistoryActionTypes.UPDATE;
  canUndo: boolean;
  canRedo: boolean;
}
