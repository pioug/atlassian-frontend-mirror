export enum HistoryActionTypes {
  UPDATE = 'UPDATE',
}

export interface Update {
  type: HistoryActionTypes.UPDATE;
  canUndo: boolean;
  canRedo: boolean;
}

export type HistoryAction = Update;
