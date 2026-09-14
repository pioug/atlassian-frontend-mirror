import {
	type Action,
	type BoundActions,
	createHook,
	createStore,
	type HookFunction,
	type Store,
} from 'react-sweet-state';

import type { useDatasourceClientExtension } from '@atlaskit/link-client-extension/use-data-source-client-extension';
import type {
	ActionsDiscoveryRequest,
	AtomicActionExecuteRequest,
	AtomicActionInterface,
} from '@atlaskit/linking-types/datasource-actions';

import {
	type DatasourceOperationFailedAttributesType,
	type EventKey,
} from '../../../src/analytics/generated/analytics.types';
import type createEventPayload from '../../../src/analytics/generated/create-event-payload';
type IntegrationKey = string;

type FieldKey = string;

/**
 * Atomic actions available for an integration (by field)
 * @example
 * ```ts
 * {
 *  jira: {
 *    summary: {
 *      actionKey: 'atlassian:work-item:update:summary',
 *      type: 'string'
 *    },
 *    status: {
 *      actionKey: 'atlassian:work-item:update:status',
 *      type: 'string',
 *      fetchAction: {
 *        actionKey: 'atlassian:work-item:get:statuses',
 *        type: 'string',
 *        inputs: {
 *          issueId: {
 *            type: 'string'
 *          }
 *        }
 *      }
 *    }
 *  }
 * }
 * ```
 */
type IntegrationActions = Record<
	IntegrationKey,
	Record<
		FieldKey,
		Pick<AtomicActionInterface, 'actionKey' | 'type' | 'description'> & {
			fetchAction?: Pick<AtomicActionInterface, 'actionKey' | 'type' | 'inputs'>;
		}
	>
>;

/**
 * Permissions available for a target
 */
type TargetPermissions = Record<
	FieldKey,
	{
		isEditable: boolean;
	}
>;

/**
 * User permissions for actions on target (ARI) properties
 * @example
 * ```ts
 *	{
 *		'ari:cloud:jira:63cecfe3-16fa-4ee1-8e8d-047cc4b18980:issue/1': {
 *			summary: {
 *				isEditable: true
 *			}
 *		}
 *	}
 * ```
 */
type ARI = string;

type Permissions = Record<ARI, TargetPermissions>;

export interface ActionsStoreState {
	actionsByIntegration: IntegrationActions;
	permissions: Permissions;
}

const getInitialState: () => ActionsStoreState = () => ({
	actionsByIntegration: {},
	permissions: {},
});

interface Client {
	getDatasourceActionsAndPermissions: ReturnType<
		typeof useDatasourceClientExtension
	>['getDatasourceActionsAndPermissions'];
}

type AnalyticsCaptureError = (
	errorLocation: DatasourceOperationFailedAttributesType['errorLocation'],
	error: unknown,
) => void;
type AnalyticsFireEvent = <K extends EventKey>(
	...params: Parameters<typeof createEventPayload<K>>
) => void;

export const actions = {
	discoverActions:
		(
			captureError: AnalyticsCaptureError,
			fireEvent: AnalyticsFireEvent,
			api: Client,
			request: ActionsDiscoveryRequest,
		): Action<ActionsStoreState> =>
		async ({ setState, getState }) => {
			try {
				const response = await api.getDatasourceActionsAndPermissions(request);

				if ('permissions' in response) {
					const { actionsByIntegration: currentActions, permissions: currentPermissions } =
						getState();

					const actionsByIntegration = response.actions.reduce<IntegrationActions>(
						(acc, action) => {
							const fieldKey = action.fieldKey;
							const fetchAction = action.inputs?.[fieldKey]?.fetchAction;
							return {
								...acc,
								[action.integrationKey]: {
									...acc[action.integrationKey],
									[fieldKey]: {
										actionKey: action.actionKey,
										type: action.type,
										...(fetchAction && {
											fetchAction: {
												actionKey: fetchAction.actionKey,
												type: fetchAction.type,
												inputs: fetchAction.inputs,
											},
										}),
									},
								},
							};
						},
						currentActions,
					);

					const permissions = response.permissions.data.reduce<Permissions>(
						(acc, permission) => ({
							...acc,
							[permission.ari]: {
								...acc[permission.ari],
								[permission.fieldKey]: {
									isEditable: permission.isEditable,
								},
							},
						}),
						currentPermissions,
					);

					setState({
						actionsByIntegration,
						permissions,
					});

					fireEvent('operational.actionDiscovery.success', {
						integrationKey: 'integrationKey' in request ? request.integrationKey : null,
						datasourceId: 'datasourceId' in request ? request.datasourceId : null,
						entityType: request.entityType,
						experience: 'datasource',
					});
				}
			} catch (error) {
				/**
				 * captureError was already initialised with integrationKey or datasourceId
				 */
				captureError('actionDiscovery', error);
			}
		},
};

type Actions = typeof actions;

export const ActionsStore: Store<
	ActionsStoreState,
	{
		discoverActions: (
			captureError: AnalyticsCaptureError,
			fireEvent: AnalyticsFireEvent,
			api: Client,
			request: ActionsDiscoveryRequest,
		) => Action<ActionsStoreState>;
	}
> = createStore<ActionsStoreState, Actions>({
	name: 'actions-store',
	initialState: getInitialState(),
	actions,
});

const getFieldUpdateActionByAri = (
	state: ActionsStoreState,
	{
		ari,
		fieldKey,
		integrationKey,
	}: {
		ari: string;
		fieldKey: string;
		integrationKey: string;
	},
) => {
	const isEditable = state.permissions[ari]?.[fieldKey]?.isEditable;

	if (!isEditable) {
		return {};
	}

	return {
		schema: state.actionsByIntegration[integrationKey]?.[fieldKey],
		fetchSchema: state.actionsByIntegration[integrationKey]?.[fieldKey]?.fetchAction,
	};
};

/**
 * Retrieves the action schema for a given ARI + fieldKey + integrationKey
 */
export const useAtomicUpdateActionSchema: HookFunction<
	| {
			fetchSchema?: undefined;
			schema?: undefined;
	  }
	| {
			fetchSchema: Pick<AtomicActionInterface, 'type' | 'inputs' | 'actionKey'> | undefined;
			schema: Pick<AtomicActionInterface, 'type' | 'description' | 'actionKey'> & {
				fetchAction?: Pick<AtomicActionInterface, 'actionKey' | 'type' | 'inputs'>;
			};
	  },
	BoundActions<
		ActionsStoreState,
		{
			discoverActions: (
				captureError: AnalyticsCaptureError,
				fireEvent: AnalyticsFireEvent,
				api: Client,
				request: ActionsDiscoveryRequest,
			) => Action<ActionsStoreState>;
		}
	>,
	{
		ari: string;
		fieldKey: string;
		integrationKey: string;
	}
> = createHook(ActionsStore, {
	selector: getFieldUpdateActionByAri,
});

export type ExecuteFetch = <E>(
	inputs: AtomicActionExecuteRequest['parameters']['inputs'],
) => Promise<E>;
