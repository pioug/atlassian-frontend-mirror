import { useCallback, useMemo } from 'react';

import { type Action, createActionsHook, createHook, createStore } from 'react-sweet-state';

import { useDatasourceClientExtension } from '@atlaskit/link-client-extension';
import type { ActionsDiscoveryRequest, AtomicActionInterface } from '@atlaskit/linking-types';

type IntegrationKey = string;
type FieldKey = string;

/**
 * Atomic actions available for an integration (by field)
 * @example
 * ```ts
 *	{
 *		jira: {
 *			summary: {
 *				actionKey: 'atlassian:issue:update:summary',
 *				type: 'string',
 *				description: 'Update issue summary',
 *			}
 *		}
 *	}
 * ```
 */
type IntegrationActions = Record<
	IntegrationKey,
	Record<FieldKey, Pick<AtomicActionInterface, 'actionKey' | 'type' | 'description'>>
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

export const actions = {
	discoverActions:
		(api: Client, request: ActionsDiscoveryRequest): Action<ActionsStoreState> =>
		async ({ setState, getState }) => {
			const response = await api.getDatasourceActionsAndPermissions(request);

			if ('permissions' in response) {
				const { actionsByIntegration: currentActions, permissions: currentPermissions } =
					getState();

				const actionsByIntegration = response.actions.reduce<IntegrationActions>(
					(acc, action) => ({
						...acc,
						[action.integrationKey]: {
							...acc[action.integrationKey],
							[action.fieldKey]: {
								actionKey: action.actionKey,
								type: action.type,
							},
						},
					}),
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

export const useDiscoverActions = () => {
	const { getDatasourceActionsAndPermissions } = useDatasourceClientExtension();
	const { discoverActions } = useActionStoreActions();

	return {
		discoverActions: useMemo(
			() => discoverActions.bind(null, { getDatasourceActionsAndPermissions }),
			[discoverActions, getDatasourceActionsAndPermissions],
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

	if (isEditable === false) {
		return;
	}

	return state.actionsByIntegration[integrationKey]?.[fieldKey];
};

/**
 * Retrieves the action schema for a given ARI + fieldKey + integrationKey
 */
export const useAtomicUpdateActionSchema = createHook(ActionsStore, {
	selector: getFieldUpdateActionByAri,
});

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
}) => {
	const [schema] = useAtomicUpdateActionSchema({ ari, fieldKey, integrationKey });

	const { executeAtomicAction: executeAction } = useDatasourceClientExtension();

	const execute = useCallback(
		(value: AtomicActionInterface['type']) => {
			if (!schema) {
				throw new Error('No action schema found.');
			}

			executeAction({
				integrationKey,
				actionKey: schema.actionKey,
				parameters: { inputs: { [fieldKey]: value }, target: { ari } },
			});
		},
		[executeAction, integrationKey, schema, fieldKey, ari],
	);

	if (!schema) {
		return null;
	}

	return {
		execute,
	};
};
