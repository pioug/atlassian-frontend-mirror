import { AppVendorRequestError } from './AppVendorRequestError';
import type { AppVendorLookup } from './getAppVendorLookup';

const AGG_PATH = '/gateway/api/graphql';
const OPERATION_NAME = 'QuickInsertAppVendorsQuery';

type MarketplaceApp = {
	partner?: { name?: string | null } | null;
} | null;

type AppVendorsResponse = {
	data?: Record<string, MarketplaceApp | undefined> | null;
	errors?: { path?: (string | number)[] }[];
};

const getField = ({ kind }: AppVendorLookup, variable: string): string =>
	kind === 'forge'
		? `marketplaceAppByCloudAppId(cloudAppId: $${variable})`
		: `marketplaceAppByKey(appKey: $${variable})`;

const getVariableType = ({ kind }: AppVendorLookup): string =>
	kind === 'forge' ? 'ID!' : 'String!';

const buildQuery = (lookups: AppVendorLookup[]): string => {
	const variables = lookups.map((lookup, index) => `$a${index}: ${getVariableType(lookup)}`);
	const fields = lookups.map(
		(lookup, index) => `a${index}: ${getField(lookup, `a${index}`)} { partner { name } }`,
	);
	return `query ${OPERATION_NAME}(${variables.join(', ')}) { ${fields.join(' ')} }`;
};

/** A request that never settles would otherwise leave its lookups pending for the page load. */
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Fetches Marketplace partner names for at most one batch of lookups.
 * Resolves `null` for apps without a listed partner and omits lookups whose field errored, so they
 * can be retried; rejects with `AppVendorRequestError` when the request itself fails, or with an
 * `AbortError` when it takes longer than `REQUEST_TIMEOUT_MS`.
 */
export const fetchAppVendors = async (
	lookups: AppVendorLookup[],
): Promise<Map<string, string | null>> => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	try {
		const response = await fetch(AGG_PATH, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				operationName: OPERATION_NAME,
				query: buildQuery(lookups),
				variables: Object.fromEntries(lookups.map(({ value }, index) => [`a${index}`, value])),
			}),
			// Also aborts reading the body, so a slow response cannot hang either.
			signal: controller.signal,
		});

		if (!response.ok) {
			throw new AppVendorRequestError(
				`App vendor request failed: ${response.status}`,
				response.status,
			);
		}

		const { data, errors }: AppVendorsResponse = await response.json();
		if (!data) {
			throw new AppVendorRequestError('App vendor request returned no data');
		}

		// A field that errored or timed out also returns null, which must not be cached as unlisted.
		const erroredAliases = new Set(errors?.map(({ path }) => path?.[0]));
		return new Map(
			lookups.flatMap(({ id }, index) => {
				const alias = `a${index}`;
				return erroredAliases.has(alias) ? [] : [[id, data[alias]?.partner?.name || null]];
			}),
		);
	} finally {
		clearTimeout(timeout);
	}
};
