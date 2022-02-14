export type NewCollabSyncUpErrorAttributes = {
  lengthOfUnconfirmedSteps?: number;
  tries: number;
  maxRetries: number;
  clientId?: string;
  version: number;
};

export type SyncUpErrorFunction = (
  attributes: NewCollabSyncUpErrorAttributes,
) => void;
