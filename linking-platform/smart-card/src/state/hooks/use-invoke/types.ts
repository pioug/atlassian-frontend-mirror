export enum InvokeActionName {
  UpdateAction = 'UpdateAction',
}

export enum InvokeActionError {
  NoData = 'NoData',
  Unknown = 'Unknown',
}

export type InvokeAction = {
  name: InvokeActionName;
};
