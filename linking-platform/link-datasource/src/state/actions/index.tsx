import { useCallback, useMemo } from 'react';

import { type Action, createActionsHook, createHook, createStore } from 'react-sweet-state';

import { useDatasourceClientExtension } from '@atlaskit/link-client-extension';
import type {
	ActionsDiscoveryRequest,
	AtomicActionExecuteRequest,
	AtomicActionExecuteResponse,
	AtomicActionInterface,
} from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	type DatasourceOperationFailedAttributesType,
	type EventKey,
} from '../../../src/analytics/generated/analytics.types';
import type createEventPayload from '../../../src/analytics/generated/create-event-payload';
import { useDatasourceAnalyticsEvents } from '../../analytics';
import useErrorLogger from '../../hooks/useErrorLogger';

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

interface UseDiscoverActionsProps {
	captureError: AnalyticsCaptureError;
	fireEvent: AnalyticsFireEvent;
}

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
										...(fetchAction &&
											fg('enable_datasource_supporting_actions') && {
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

export const ActionsStore = createStore<ActionsStoreState, Actions>({
	name: 'actions-store',
	initialState: getInitialState(),
	actions,
});

const useActionStoreActions = createActionsHook(ActionsStore);

export const useDiscoverActions = ({ captureError, fireEvent }: UseDiscoverActionsProps) => {
	const { getDatasourceActionsAndPermissions } = useDatasourceClientExtension();
	const { discoverActions } = useActionStoreActions();

	return {
		discoverActions: useMemo(
			() =>
				discoverActions.bind(null, captureError, fireEvent, { getDatasourceActionsAndPermissions }),
			[captureError, discoverActions, fireEvent, getDatasourceActionsAndPermissions],
		),
	};
};

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
export const useAtomicUpdateActionSchema = createHook(ActionsStore, {
	selector: getFieldUpdateActionByAri,
});

export type ExecuteFetch = <E>(
	inputs: AtomicActionExecuteRequest['parameters']['inputs'],
) => Promise<E>;
/**
 * Given an ARI + fieldKey + integrationKey
 * Returns an executable action that updates a field on the entity if the user has permissions to do so
 *
 * @example
 * ```tsx
 * const { execute } = useExecuteAtomicAction({ ari, fieldKey: 'summary', integrationKey: 'jira' });
 *
 * return <button onClick={() => execute('New summary')}>Update summary</button>;
 * ```
 */
export const useExecuteAtomicAction = ({
	ari,
	fieldKey,
	integrationKey,
}: {
	ari: string;
	fieldKey: string;
	integrationKey: string;
}): {
	execute?: (value: string | number) => Promise<AtomicActionExecuteResponse<unknown>>;
	executeFetch?: ExecuteFetch;
} => {
	const [{ schema, fetchSchema }] = useAtomicUpdateActionSchema({ ari, fieldKey, integrationKey });

	const { executeAtomicAction: executeAction, invalidateDatasourceDataCacheByAri } =
		useDatasourceClientExtension();

	const { fireEvent } = useDatasourceAnalyticsEvents();
	const { captureError } = useErrorLogger({ integrationKey });

	const execute = useCallback(
		(value: string | number) => {
			if (!schema) {
				throw new Error('No action schema found.');
			}

			return executeAction({
				integrationKey,
				actionKey: schema.actionKey,
				parameters: { inputs: { [fieldKey]: value }, target: { ari } },
			})
				.then((resp) => {
					// Force data to refresh after update
					invalidateDatasourceDataCacheByAri(ari);

					fireEvent('operational.actionExecution.success', {
						integrationKey: integrationKey,
						experience: 'datasource',
					});
					return resp;
				})
				.catch((error) => {
					captureError('actionExecution', error);
					// Rethrow up to component for flags and other handling
					throw error;
				});
		},
		[
			schema,
			executeAction,
			integrationKey,
			fieldKey,
			ari,
			invalidateDatasourceDataCacheByAri,
			fireEvent,
			captureError,
		],
	);

	const executeFetch = useCallback(
		<E,>(inputs: AtomicActionExecuteRequest['parameters']['inputs']) => {
			if (!fetchSchema) {
				throw new Error('No supporting action schema found.');
			}

			// A generic type can allow us here to define the inputs and outputs
			return executeAction({
				integrationKey,
				actionKey: fetchSchema.actionKey,
				parameters: { inputs, target: { ari } },
			})
				.then((resp) => {
					fireEvent('operational.fetchActionExecution.success', {
						integrationKey: integrationKey,
						experience: 'datasource',
					});

					return resp as E;
				})
				.catch((error) => {
					captureError('fetchActionExecution', error);
					// Rethrow up to component for flags and other handling
					throw error;
				});
		},
		[fetchSchema, executeAction, integrationKey, ari, fireEvent, captureError],
	);

	return {
		...(schema && { execute }),
		...(fetchSchema && { executeFetch }),
	};
};
