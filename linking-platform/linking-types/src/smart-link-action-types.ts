/**
 * The enum that describes Smart Link action types
 */
export enum SmartLinkActionType {
  StatusUpdateAction = 'StatusUpdateAction',
  GetStatusTransitionsAction = 'GetStatusTransitionsAction',
}

/**
 * Default type for an invoke request. Parametrized with the type of payload
 */
export type InvokeActionRequest = {
  /**
   * Url of the actual link resource on which we are trying to perform an action
   */
  resourceUrl: string;

  /**
   * Action type that a user is trying to perform
   * @see SmartLinkActionType
   */
  actionType: SmartLinkActionType;

  /**
   * An identifier of the provider which will be executing the action.
   * Example: 'jira-object-provider'
   */
  extensionKeyProvider?: string;
};

export type GetStatusTransitionsRequest = InvokeActionRequest;

/**
 * A payload type required for a Status Update Action
 */
export type StatusUpdateActionRequest = InvokeActionRequest & {
  payload: {
    /**
     * The id of a status to which a user is trying to update the status field
     */
    newStatusId: string;
  };
};

/**
 * Default type for an Action Response
 */
export type InvokeActionResponse = {};

/**
 * Type that signifies an error response from the product
 */
export type InvokeActionErrorResponse = InvokeActionResponse & {
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
export type GetStatusTransitionsActionResponse = InvokeActionResponse & {
  transitions: {
    id: string;
    name: string;
    appearance?: string;
  }[];
};

/**
 * Interface that represents an Action that can be executed in a provider
 */
export interface Action<
  Request extends InvokeActionRequest = InvokeActionRequest,
  Response extends InvokeActionResponse = InvokeActionResponse,
> {
  /**
   * A method that executes the action and returns the resulting payload
   * @param actionPayload is the data necessary to execute the action
   */
  executeAction: (actionPayload: Request) => Response | void;
}
