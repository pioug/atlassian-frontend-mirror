import { request } from '@atlaskit/linking-common';

const AGG_URL = '/gateway/api/graphql';

const TENANT_CONTEXT_OPERATION_NAME = 'link_datasource_tenantContext';
const UNITS_ROLLOUT_SETTINGS_OPERATION_NAME = 'link_datasource_unitSettings';

/**
 * `Query.admin_unitSettings` is keyed by org id, which the browser does not know, so the org id
 * is resolved from the host the product is currently served from.
 */
export const tenantContextQuery: string = `
	query ${TENANT_CONTEXT_OPERATION_NAME}($hostNames: [String!]) {
		tenantContexts(hostNames: $hostNames) {
			orgId
		}
	}
`;

/**
 * `admin_unitSettings` exposes both flags of the rollout and is callable with the session of the
 * end user, so no opt-in directive or admin OAuth scope is needed from the browser.
 */
export const unitsRolloutSettingsQuery: string = `
	query ${UNITS_ROLLOUT_SETTINGS_OPERATION_NAME}($orgId: ID!) {
		admin_unitSettings(orgId: $orgId) {
			boundaryEnforced
			endUsersLaunched
		}
	}
`;

export interface UnitsRolloutSettings {
	boundaryEnforced: boolean;
	endUsersLaunched: boolean;
}

interface GraphQLResponse<TData> {
	data?: TData | null;
	errors?: ({ message?: string } | null)[] | null;
}

interface TenantContextData {
	tenantContexts?: ({ orgId?: string | null } | null)[] | null;
}

interface UnitsRolloutSettingsData {
	admin_unitSettings?: {
		boundaryEnforced?: boolean | null;
		endUsersLaunched?: boolean | null;
	} | null;
}

/**
 * When the rollout settings cannot be resolved we keep the pre-isolation behaviour, which is
 * what every org gets today while the unit settings are unset. The settings are only
 * written when an org is activated - they are not backfilled - so `null` is expected for orgs
 * that have not been activated yet and must be read as `false`.
 */
const DEFAULT_SETTINGS: UnitsRolloutSettings = {
	boundaryEnforced: false,
	endUsersLaunched: false,
};

/**
 * Holds the in-flight/resolved request so that the settings are only fetched once per page load.
 */
export const cache: { promise?: Promise<UnitsRolloutSettings> } = {};

/**
 * AGG answers with a 200 and an `errors` array for query level failures, so those have to be
 * turned into a rejection explicitly rather than being read as an empty response.
 */
const requestGraphQL = async <TData>(
	operationName: string,
	query: string,
	variables: Record<string, unknown>,
): Promise<TData | undefined> => {
	const response = await request<GraphQLResponse<TData>>('post', AGG_URL, {
		operationName,
		query,
		variables,
	});

	if (response?.errors?.length) {
		const messages = response.errors
			.map((error) => error?.message)
			.filter(Boolean)
			.join(', ');

		throw new Error(`${operationName} failed: ${messages || 'unknown error'}`);
	}

	return response?.data ?? undefined;
};

const fetchOrgId = async (): Promise<string | undefined> => {
	const hostName = typeof window !== 'undefined' ? window.location?.hostname : undefined;

	if (!hostName) {
		return undefined;
	}

	const data = await requestGraphQL<TenantContextData>(
		TENANT_CONTEXT_OPERATION_NAME,
		tenantContextQuery,
		{ hostNames: [hostName] },
	);

	for (const tenantContext of data?.tenantContexts ?? []) {
		if (tenantContext?.orgId) {
			return tenantContext.orgId;
		}
	}

	return undefined;
};

const fetchUnitsRolloutSettings = async (): Promise<UnitsRolloutSettings> => {
	const orgId = await fetchOrgId();

	if (!orgId) {
		return DEFAULT_SETTINGS;
	}

	const data = await requestGraphQL<UnitsRolloutSettingsData>(
		UNITS_ROLLOUT_SETTINGS_OPERATION_NAME,
		unitsRolloutSettingsQuery,
		{ orgId },
	);

	const settings = data?.admin_unitSettings;

	return {
		boundaryEnforced: settings?.boundaryEnforced ?? false,
		endUsersLaunched: settings?.endUsersLaunched ?? false,
	};
};

/**
 * Reads the org's units rollout settings (`boundaryEnforced` and `endUsersLaunched`) from the
 * TCS key exposed by AGG's `Query.admin_unitSettings`.
 *
 * The result is cached for the lifetime of the page because the settings only change when an
 * admin activates or launches units, which requires a reload to be picked up anyway. A failed
 * request is not cached so that a later call can retry.
 */
export const getUnitsRolloutSettings = (): Promise<UnitsRolloutSettings> => {
	if (!cache.promise) {
		cache.promise = fetchUnitsRolloutSettings().catch(() => {
			cache.promise = undefined;
			return DEFAULT_SETTINGS;
		});
	}

	return cache.promise;
};
