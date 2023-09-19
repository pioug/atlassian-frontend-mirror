export enum ACTIONS {
  SET_CONTEXT_PROVIDER,
  FOCUS_BY_LOCALID,
}

export type TaskItemData = {
  pos: number;
  localId: string | null;
};
