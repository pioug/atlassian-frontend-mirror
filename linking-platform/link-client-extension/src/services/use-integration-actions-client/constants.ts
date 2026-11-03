export const EXECUTE_INTEGRATION_ACTION_OPERATION_NAME =
	'LinkClientExtension_ExecuteIntegrationAction';

export const EXECUTE_INTEGRATION_ACTION_MUTATION: string = `mutation ${EXECUTE_INTEGRATION_ACTION_OPERATION_NAME}(
	$actionTypeKey: String
	$filter: ActionsExecuteActionFilter!
	$actionInput: ActionsExecuteActionInput!
	$workspace: String
) {
	actions {
		execute(
			actionTypeKey: $actionTypeKey
			filter: $filter
			actionInput: $actionInput
			workspace: $workspace
		) {
			status
			outputs
		}
	}
}`;

export const USER_CONSENT_REQUIRED = 'USER_CONSENT_REQUIRED';

/** `service` value for the AGG `atl-attribution` header. */
export const ATTRIBUTION_SERVICE = 'link-client-extension';

/** Fallback message when IS reports an error without one. */
export const GENERIC_OPERATION_ERROR_MESSAGE = 'Action failed';

/** Fallback message when AGG returns a GraphQL error without one. */
export const GENERIC_GRAPHQL_ERROR_MESSAGE = 'GraphQL error';
