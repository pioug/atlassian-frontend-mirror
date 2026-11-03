import { getBaseUrl } from '@atlaskit/linking-common/get-base-url';
import type { EnvironmentsKeys } from '@atlaskit/linking-common/types';

import { EXECUTE_INTEGRATION_ACTION_OPERATION_NAME } from './constants';

const EDGE_PROXY_AGG_PATH = '/gateway/api/graphql';

/**
 * AGG endpoint for the CardClient's environment.
 * - No envKey (running inside a product): same-origin `/gateway/api/graphql`. On the server there
 *   is no `window`, so this is relative and requests fail with an `http` error instead of crashing.
 * - `custom`: `baseUrlOverride` is a full object resolver URL (e.g. a direct service URL for SSR),
 *   so we can't build an AGG URL from it. Use the relative edge proxy path instead, the same
 *   fallback `getResolverUrl` uses.
 * - Other envKeys (e.g. `stg` in examples): the Stargate base URL for that environment + `/graphql`,
 *   e.g. `https://pug.jira-dev.com/gateway/api/graphql`.
 * The operation name is added as a query param so requests are easy to identify.
 */
export const getAggUrl = (envKey?: EnvironmentsKeys): string => {
	let graphqlUrl: string;
	if (envKey === 'custom') {
		graphqlUrl = EDGE_PROXY_AGG_PATH;
	} else if (envKey) {
		const stargateBaseUrl: string = getBaseUrl(envKey);
		graphqlUrl = `${stargateBaseUrl.replace(/\/$/, '')}/graphql`;
	} else {
		const origin: string = getBaseUrl();
		graphqlUrl = `${origin}${EDGE_PROXY_AGG_PATH}`;
	}

	return `${graphqlUrl}?operationName=${EXECUTE_INTEGRATION_ACTION_OPERATION_NAME}`;
};
