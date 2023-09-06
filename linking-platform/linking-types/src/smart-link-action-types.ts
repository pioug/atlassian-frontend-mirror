/**
 * The enum that describes Smart Link action types
 */
export enum SmartLinkActionType {
  FollowEntityAction = 'FollowEntityAction',
  GetStatusTransitionsAction = 'GetStatusTransitionsAction',
  StatusUpdateAction = 'StatusUpdateAction',
  UnfollowEntityAction = 'UnfollowEntityAction',
}

/**
 * Default type for an invoke request. Parametrized with the type of payload
 */
export type InvokeRequest<TPayload extends object = {}> = {
  /**
   * Contains specific details of the action to be performed.
   */
  action: InvokeRequestAction<TPayload>;
  /**
   * An identifier of the provider which will be executing the action.
   * Example: 'jira-object-provider'
   */
  providerKey: string;
};

/**
 * Captures information about an action
 */
export type InvokeRequestAction<TPayload extends object = {}> = {
  /**
   * Type of action to be performed.
   */
  actionType: SmartLinkActionType;
  /**
   * object to identify the resource upon which the action will be performed.
   * This information is provided from the backend and is supplied back to the backend as is
   * FE does not need to know the strucutre of this property
   */
  resourceIdentifiers: Record<string, any>;
  /**
   * Payload needed by the action to perform this action. Needs to be constructed by the FE
   */
  payload?: TPayload;
};

/**
 * payload needed by {@link SmartLinkActionType.StatusUpdateAction} action type
 */
export type StatusUpdateActionPayload = {
  newStatusId: string;
};

/**
 * Default type for an Action Response
 */
export type InvokeResponse = {};

/**
 * Type that signifies an error response from the product
 */
export type InvokeErrorResponse = InvokeResponse & {
  /**
   * Error message returned from the product API
   */
  message?: string;

  /**
   * Error code returned from the product API
   */
  errorCode?: string;
};

/**
 * Payload from GetStatusTransitions action that contains a list of available statuses
 */
export type GetStatusTransitionsInvokeResponse = InvokeResponse & {
  transitions: {
    id: string;
    name: string;
    appearance?: string;
  }[];
};

export class InvokeError extends Error {
  errorCode: number;

  constructor(message: string, errorCode: number) {
    super(message);
    this.errorCode = errorCode;
  }
}
