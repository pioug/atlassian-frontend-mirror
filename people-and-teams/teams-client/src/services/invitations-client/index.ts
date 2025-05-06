import { type ClientConfig } from '../base-client';
import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';
import { logException } from '../sentry/main';

import {
	type AccessRequestBulk,
	type AccessRequestBulkSimplified,
	type AccessResourcesResponse,
	type Capability,
	type Product,
	type RecommendationsResponse,
	type Resource,
} from './types';
import { removeDuplicateRecommendations } from './utils';

const PRODUCT_RECCOMENDATIONS = '/v1/product-recommendations';
const PRODUCT_JOIN_OR_REQUEST_BULK = '/v1/access-requests/bulk/request';
const ALL_SUPPORTED_PRODUCTS: Product[] = [
	'confluence',
	'jira',
	'jira-core',
	'jira-servicedesk',
	'jira-software',
	'jira-incident-manager',
	'jira-product-discovery',
	'opsgenie',
	'statuspage',
	'avocado',
	'townsquare',
	'compass',
	'avp',
	'beacon',
	'mercury',
];
export class InvitationsClient extends RestClient {
	constructor(serviceUrl: string, config: ClientConfig) {
		super({ serviceUrl, config });
	}

	private async getProductRecommendationsInner(
		supportedProducts: Product[] = ALL_SUPPORTED_PRODUCTS,
		capabilities?: Capability[],
	): Promise<RecommendationsResponse> {
		try {
			const orgId = this.getOrgId();
			const queryProducts =
				supportedProducts && supportedProducts.length > 0
					? supportedProducts
					: ALL_SUPPORTED_PRODUCTS;

			const productQueryParams = queryProducts.map((product) => `product=${product}`).join('&');

			const capabilityQueryParams =
				capabilities && capabilities.length > 0
					? '&' + capabilities.map((capability) => `capability=${capability}`).join('&')
					: '';

			const url = `${PRODUCT_RECCOMENDATIONS}?orgId=${orgId}&${productQueryParams}${capabilityQueryParams}`;
			return await this.getResource<RecommendationsResponse>(url);
		} catch (error) {
			this.logException(error, 'An error occurred while getting product recommendations.');
			throw error;
		}
	}

	async getProductRecommendations(
		supportedProducts: Product[] = ALL_SUPPORTED_PRODUCTS,
		capabilities?: Capability[],
	): Promise<RecommendationsResponse> {
		// This endpoint may return duplicate resource ARIs with a different mode.
		const result = await this.getProductRecommendationsInner(supportedProducts, capabilities);

		try {
			const deduplicatedResult = removeDuplicateRecommendations(result);
			return deduplicatedResult;
		} catch (error) {
			this.logException(error, 'An error occurred while deduplicating product recommendations.');
			throw error;
		}
	}

	async joinOrRequestDefaultAccessToProductsBulk(
		simplifiedRequest: AccessRequestBulkSimplified,
	): Promise<AccessResourcesResponse> {
		if (simplifiedRequest.productAris.length === 0) {
			return Promise.resolve([]);
		}

		try {
			const resources: Resource[] = simplifiedRequest.productAris.map((ari) => ({
				ari,
				role: 'product/member',
			}));
			const request: AccessRequestBulk = {
				resources,
				note: simplifiedRequest.note,
				accessMode: simplifiedRequest.accessMode,
				source: simplifiedRequest.source,
			};
			return await this.postResource<AccessResourcesResponse>(
				PRODUCT_JOIN_OR_REQUEST_BULK,
				request,
			);
		} catch (error) {
			this.logException(error, 'An error occurred while joining or requesting access to products.');
			throw error;
		}
	}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new InvitationsClient(DEFAULT_CONFIG.invitationsServiceUrl, {
	logException,
});
