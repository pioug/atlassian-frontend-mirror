import { useCallback, useMemo } from 'react';

import type CardClient from '@atlaskit/link-provider/client';
import { request } from '@atlaskit/linking-common/api';
import type { EnvironmentsKeys, ProductType } from '@atlaskit/linking-common/types';

import { buildRequestHeaders } from './build-request-headers';
import {
	EXECUTE_INTEGRATION_ACTION_MUTATION,
	EXECUTE_INTEGRATION_ACTION_OPERATION_NAME,
} from './constants';
import { getAggUrl } from './get-agg-url';
import { IntegrationActionError } from './integration-action-error';
import { parseExecuteIntegrationActionResponse } from './parse-execute-integration-action-response';
import type {
	ExecuteIntegrationActionGraphQLResponse,
	ExecuteIntegrationActionRequest,
	ExecuteIntegrationActionResponse,
} from './types';

type ResponseLike = {
	json: () => Promise<unknown>;
	status?: number;
};

// Check the shape rather than `instanceof Response`; `instanceof` checks on errors have caused HOTs before.
const isResponseLike = (value: unknown): value is ResponseLike =>
	typeof value === 'object' &&
	value !== null &&
	typeof (value as { json?: unknown }).json === 'function';

const readErrorBody = async (
	response: ResponseLike,
): Promise<ExecuteIntegrationActionGraphQLResponse | undefined> => {
	try {
		return (await response.json()) as ExecuteIntegrationActionGraphQLResponse;
	} catch {
		return undefined;
	}
};

const toHttpError = (error: unknown, statusCode?: number): IntegrationActionError =>
	new IntegrationActionError(
		'http',
		error instanceof Error && error.message
			? error.message
			: `Request failed${statusCode ? ` with status ${statusCode}` : ''}`,
		{ statusCode, originalError: error },
	);

type UseIntegrationActionsClientOptions = {
	/** Product hosting the Smart Link. Sent to AGG in the `atl-attribution` header. */
	product?: ProductType;
};

/**
 * useIntegrationActionsClient
 *
 * Runs Integrations Service (IS) actions on 3P resources (e.g. listing or adding Google Docs
 * comments) through the AGG `actions { execute }` mutation. Uses a plain fetch rather than Relay,
 * so it works in any host that provides a CardClient.
 *
 * `executeAction` resolves with the action's `outputs`. It throws an `IntegrationActionError` when:
 * - the user needs to connect their 3P account (`kind: 'consent-required'`, with `authUrl`)
 * - IS reports the action failed (`kind: 'operation'`)
 * - AGG returns GraphQL errors (`kind: 'graphql'`)
 * - the request fails (`kind: 'http'`)
 *
 * Each request sends the AGG metrics attribution header (`atl-attribution`), using
 * `actionInput.cloudId` as the tenant.
 *
 * Call `executeAction` from effects or event handlers, not during render (it doesn't run in SSR).
 *
 * @param cardClient used to pick the AGG endpoint for the environment
 * @param options.product product hosting the Smart Link, for metrics attribution
 */
export const useIntegrationActionsClient = (
	cardClient: CardClient,
	{ product }: UseIntegrationActionsClientOptions = {},
): {
	executeAction: <TOutputs = unknown>(
		data: ExecuteIntegrationActionRequest,
	) => Promise<ExecuteIntegrationActionResponse<TOutputs>>;
} => {
	const aggUrl = useMemo(
		() => getAggUrl(cardClient?.envKey as EnvironmentsKeys),
		[cardClient?.envKey],
	);

	const executeAction = useCallback(
		async <TOutputs = unknown>({
			actionTypeKey,
			filter,
			actionInput,
			workspace,
		}: ExecuteIntegrationActionRequest): Promise<ExecuteIntegrationActionResponse<TOutputs>> => {
			let body: ExecuteIntegrationActionGraphQLResponse | undefined;
			try {
				body = await request<ExecuteIntegrationActionGraphQLResponse>(
					'post',
					aggUrl,
					{
						operationName: EXECUTE_INTEGRATION_ACTION_OPERATION_NAME,
						query: EXECUTE_INTEGRATION_ACTION_MUTATION,
						variables: { actionTypeKey, filter, actionInput, workspace },
					},
					buildRequestHeaders({ cloudId: actionInput?.cloudId, product }),
					[200],
				);
			} catch (error: unknown) {
				// `request` throws the Response for non-2xx statuses. AGG may still include GraphQL errors.
				if (isResponseLike(error)) {
					const errorBody = await readErrorBody(error);
					if (errorBody?.errors?.length || errorBody?.data?.actions?.execute) {
						return parseExecuteIntegrationActionResponse<TOutputs>(errorBody, error.status);
					}
					throw toHttpError(undefined, error.status);
				}
				throw toHttpError(error);
			}

			return parseExecuteIntegrationActionResponse<TOutputs>(body, 200);
		},
		[aggUrl, product],
	);

	return useMemo(() => ({ executeAction }), [executeAction]);
};
