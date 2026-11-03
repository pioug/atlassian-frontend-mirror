import type { ProductType } from '@atlaskit/linking-common/types';

import { ATTRIBUTION_SERVICE } from './constants';

/**
 * Smart Links product → GTM product name, from the AGG Metrics Attribution list.
 * Products without a clear match are left out, so `product` is omitted from the header.
 */
const GTM_PRODUCT: Partial<Record<ProductType, string>> = {
	ATLAS: 'Atlas',
	BITBUCKET: 'Bitbucket Cloud',
	CONFLUENCE: 'Confluence Cloud',
	CSM: 'Customer Service Management',
	JPD: 'Jira Product Discovery',
	JSM: 'Jira Service Management',
	JSW: 'Jira',
	JWM: 'Jira',
	TRELLO: 'Trello',
};

type BuildRequestHeadersOptions = {
	/** Cloud ID of the current site. Sent as `tenantId`, or `null` when unknown. */
	cloudId?: string;
	/** Product hosting the Smart Link, mapped to a GTM product name. */
	product?: ProductType;
};

/**
 * The `atl-attribution` header AGG asks frontend clients to send for metrics attribution:
 * JSON with `tenantId`, `product` (when known) and `service`.
 *
 * See https://hello.atlassian.net/wiki/spaces/aggp/pages/5954141702
 */
export const buildRequestHeaders = ({
	cloudId,
	product,
}: BuildRequestHeadersOptions): Record<string, string> => {
	const attribution = {
		tenantId: cloudId || null,
		product: product ? GTM_PRODUCT[product] : undefined,
		service: ATTRIBUTION_SERVICE,
	};

	return { 'atl-attribution': JSON.stringify(attribution) };
};
