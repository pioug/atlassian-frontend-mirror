import fetchMock from 'fetch-mock/cjs/client';

import { fg } from '@atlaskit/platform-feature-flags';

import {
	mockActionsDiscovery,
	mockActionsExecution,
	ORS_ACTIONS_DISCOVERY_ENDPOINT,
} from './actions';
import { mockAssetsClientFetchRequests } from './assets';
import { assetsDefaultInitialVisibleColumnKeys } from './assets/data';
import { successfulRecommendationAPIResponse } from './basic-filters/mocks';
import { defaultInitialVisibleColumnKeys as defaultInitialVisibleConfluenceColumnKeys } from './confluence/data';
import * as confluenceMocks from './confluence/mocks';
import {
	defaultInitialVisibleColumnKeys as defaultInitialVisibleJiraColumnKeys,
	mockAutoCompleteData,
	mockJiraData,
	mockProductsData,
	mockSite,
	mockSiteData,
	mockSuggestionData,
} from './jira/data';
import * as jiraMocks from './jira/mocks';

export { defaultInitialVisibleConfluenceColumnKeys };

export {
	defaultInitialVisibleJiraColumnKeys,
	assetsDefaultInitialVisibleColumnKeys,
	mockAutoCompleteData,
	mockJiraData,
	mockSiteData,
	mockProductsData,
	mockSite,
	mockSuggestionData,
	mockAssetsClientFetchRequests,
};

export { mockBasicFilterAGGFetchRequests } from './basic-filters/index';

export {
	fieldValuesEmptyResponse,
	fieldValuesEmptyResponseMapped,
	fieldValuesResponseForAssignees,
	fieldValuesResponseForAssigneesMapped,
	fieldValuesResponseForProjects,
	fieldValuesResponseForProjectsMapped,
	fieldValuesResponseForStatuses,
	fieldValuesResponseForStatusesMapped,
	fieldValuesResponseForTypes,
	fieldValuesResponseForTypesMapped,
	hydrateJqlEmptyResponse,
	hydrateJqlEmptyResponseMapped,
	hydrateJqlStandardResponse,
	hydrateJqlStandardResponseMapped,
	fieldValuesResponseForProjectsMoreData,
	fieldValuesResponseForStatusesSearched,
	fieldValuesResponseForTypesWithRelativeUrls,
	fieldValuesResponseForTypesWithRelativeUrlsMapped,
	successfulUserQueryResponse,
	failedUserQueryResponse,
	successfulRecommendationAPIResponse,
	failedRecommendationAPIResponse,
	transformedRecommendationMockFilterOptions,
	successfuluserHydrationResponse,
	hydrateJqlStandardResponseForVRTesting,
} from './basic-filters/mocks';

fetchMock.config.fallbackToNetwork = true;

export type Site = {
	cloudId: string;
	displayName: string;
	url: string;
};

export type Product = {
	productDisplayName: string;
	productId: string;
	workspaces: Workspace[];
};

export type Workspace = {
	cloudId: string;
	cloudUrl: string;
	workspaceDisplayName: string;
};

export interface FetchMockRequestDetails {
	body: string;
	credentials: string;
	headers: object;
	method: string;
}

interface ResolveBatchRequest extends Array<{
	resourceUrl: string;
}> {}

let numberOfLoads = 0;

type MockOptions = {
	accessibleProductsOverride?: Product[];
	availableSitesOverride?: Site[];
	datasourceId?: string;
	delayedResponse?: boolean; // For playwright VR tests
	initialVisibleColumnKeys?: string[];
	/**
	 * Use infinity for an infinite delay (promise never resolves or rejects)
	 * Default is 600ms
	 */
	mockExecutionDelay?: number;
	shouldMockORSBatch?: boolean;
	type?: 'jira' | 'confluence';
};

export const mockDatasourceFetchRequests = ({
	type = 'jira',
	// eslint-disable-next-line no-unused-vars
	datasourceId: string,
	shouldMockORSBatch = false,
	delayedResponse = true,
	availableSitesOverride,
	mockExecutionDelay = 600,
	accessibleProductsOverride,
	...rest
}: MockOptions = {}): void => {
	const datasourceMatcher = '[^/]+';

	// Playwright VR tests do not like setTimeout
	// eslint-disable-next-line no-unused-vars
	const setTimeoutConfigured = delayedResponse ? setTimeout : (cb: Function, _: number) => cb();

	let initialVisibleColumnKeys = (() => {
		if (rest.initialVisibleColumnKeys) {
			return rest.initialVisibleColumnKeys;
		}
		if (type === 'jira') {
			// Return just jiraMocks.defaultInitialVisibleColumnKeys when cleaning up jpd_confluence_date_fields_improvements
			return fg('jpd_confluence_date_fields_improvements')
				? [...jiraMocks.defaultInitialVisibleColumnKeys, 'daterange']
				: jiraMocks.defaultInitialVisibleColumnKeys;
		}
		if (type === 'confluence') {
			return confluenceMocks.defaultInitialVisibleColumnKeys;
		}
		return [];
	})();

	fetchMock.post(
		new RegExp(`object-resolver/datasource/${datasourceMatcher}/fetch/details`),
		async () => {
			return new Promise((resolve, reject) => {
				if (type === 'jira') {
					const response = jiraMocks.generateDetailsResponse(initialVisibleColumnKeys);
					return resolve(response);
				}
				if (type === 'confluence') {
					const response = confluenceMocks.generateDetailsResponse(initialVisibleColumnKeys);
					return resolve(response);
				}
				return reject(new Error(`Unhandled type ${type} when mocking fetc/details`));
			});
		},
	);

	// Mock this for the editor's testing examples.
	if (shouldMockORSBatch) {
		fetchMock.post(
			new RegExp(`object-resolver/resolve/batch`),
			async (url: string, request: FetchMockRequestDetails) => {
				function getMock(resourceUrl: string) {
					if (type === 'jira') {
						return jiraMocks.generateResolveResponse(resourceUrl);
					}
					if (type === 'confluence') {
						return confluenceMocks.generateResolveResponse(resourceUrl);
					}
				}

				const requestJson = JSON.parse(request.body) as ResolveBatchRequest;
				if (requestJson.length === 1) {
					const resourceUrl = requestJson[0].resourceUrl;
					const mock = getMock(resourceUrl);
					if (mock) {
						return Promise.resolve([mock]);
					}
				}

				return fetchMock.realFetch(url, {
					method: 'POST',
					headers: request.headers,
					body: request.body,
				});
			},
		);
	}

	fetchMock.post(
		new RegExp(`/gateway/api/object-resolver/datasource/${datasourceMatcher}/fetch/data`),
		async (url: string, details: FetchMockRequestDetails) => {
			const requestBody = JSON.parse(details.body);
			const {
				parameters: { cloudId },
				includeSchema,
			} = requestBody;
			function getMock() {
				if (type === 'jira') {
					return jiraMocks.generateDataResponse({
						cloudId,
						numberOfLoads,
						includeSchema,
						initialVisibleColumnKeys,
					});
				}
				if (type === 'confluence') {
					return confluenceMocks.generateDataResponse({
						cloudId,
						numberOfLoads,
						includeSchema,
						initialVisibleColumnKeys,
					});
				}
			}
			return new Promise((resolve, reject) => {
				const delay = numberOfLoads * 1000;

				setTimeoutConfigured(() => {
					try {
						const mockResponse = getMock();
						resolve(mockResponse);
					} catch (err) {
						reject(err);
					}
					numberOfLoads += 1;
				}, delay);
			});
		},
	);

	fetchMock.post(/api\/available-sites/, async () => {
		return new Promise((resolve) => {
			resolve({ sites: availableSitesOverride || mockSiteData });
		});
	});

	fetchMock.post(/api\/v2\/accessible-products/, async () => {
		return new Promise((resolve) => {
			resolve({ data: { products: accessibleProductsOverride || mockProductsData } });
		});
	});

	fetchMock.get(
		/\/api\/ex\/jira\/.+\/\/rest\/api\/latest\/jql\/autocompletedata\/suggestions\?.+/,
		async () => {
			return new Promise((resolve) => {
				const delay = 150;
				setTimeoutConfigured(() => {
					resolve(mockSuggestionData);
				}, delay);
			});
		},
	);

	fetchMock.post(new RegExp(`/gateway/api/v1/recommendations`), async () => {
		return Promise.resolve(successfulRecommendationAPIResponse);
	});

	fetchMock.post(/\/api\/ex\/jira\/.+\/rest\/api\/latest\/jql\/autocompletedata/, async () => {
		return new Promise((resolve) => {
			const delay = 150;
			setTimeoutConfigured(() => {
				resolve(mockAutoCompleteData);
			}, delay);
		});
	});

	mockActionsDiscovery();
	mockActionsExecution(mockExecutionDelay);
};

export const forceBaseUrl = (baseUrl: string): void => {
	fetchMock.post(/^\//, ((url, init) => fetch(`${baseUrl}${url}`, init)) as typeof fetch);
};

export { ORS_ACTIONS_DISCOVERY_ENDPOINT, mockActionsDiscovery };
