import fetchMock from 'fetch-mock/cjs/client';

import {
	assetsDefaultDetails,
	assetsDefaultInitialVisibleColumnKeys,
	generateDataResponse,
	objectSchemaListResponse,
} from './data';

fetchMock.config.fallbackToNetwork = true;

interface FetchMockRequestDetails {
	body: string;
	credentials: string;
	headers: object;
	method: string;
}
const ASSETS_LIST_OF_LINKS_DATASOURCE_ID = '361d618a-3c04-40ad-9b27-3c8ea6927020';

type AqlValidateRequest = {
	qlQuery: string;
	context: string;
};

const delay = 150;

interface MockOptions {
	delayedResponse?: boolean;
}

export const mockAssetsClientFetchRequests = ({ delayedResponse = true }: MockOptions = {}) => {
	// Playwright VR tests do not like setTimeout
	const setTimeoutConfigured = delayedResponse ? setTimeout : (cb: Function, _: number) => cb();

	const workspaceId = '123';
	fetchMock.get('/rest/servicedesk/cmdb/latest/workspace', async () => {
		return new Promise((resolve) => {
			setTimeoutConfigured(() => {
				resolve({
					results: [
						{
							id: workspaceId,
						},
					],
				});
			}, delay);
		});
	});

	fetchMock.get(
		`begin:/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/list`,
		async (url: string) => {
			const urlParams = new URLSearchParams(url);
			const query = urlParams.get('query');
			return new Promise((resolve) => {
				setTimeoutConfigured(() => {
					if (query) {
						const filteredValues = objectSchemaListResponse.values.filter((objectSchema) =>
							objectSchema.name.toLowerCase().includes(query.toLowerCase()),
						);
						resolve({ values: filteredValues });
					}
					resolve(objectSchemaListResponse);
				}, delay);
			});
		},
	);

	fetchMock.get(
		new RegExp(`/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/\\d+`),
		async (url: string) => {
			const id = url.split('/').pop();
			return new Promise((resolve, reject) => {
				setTimeoutConfigured(() => {
					const objectSchema = objectSchemaListResponse.values.find(
						(objectSchema) => objectSchema.id === id,
					);
					if (objectSchema) {
						resolve(objectSchema);
					} else {
						reject();
					}
				}, delay);
			});
		},
	);

	fetchMock.post(
		`/gateway/api/jsm/assets/workspace/${workspaceId}/v1/aql/validate`,
		async (_: string, request: FetchMockRequestDetails) => {
			const requestJson = JSON.parse(request.body) as AqlValidateRequest;
			return new Promise((resolve) => {
				setTimeoutConfigured(() => {
					const isValid = requestJson.qlQuery.includes('invalid') ? false : true;
					resolve({
						isValid,
					});
				}, delay);
			});
		},
	);

	fetchMock.post(
		new RegExp(`/object-resolver/datasource/${ASSETS_LIST_OF_LINKS_DATASOURCE_ID}/fetch/details`),
		async () => {
			return new Promise((resolve) => resolve(assetsDefaultDetails));
		},
	);

	fetchMock.post(
		new RegExp(
			`/gateway/api/object-resolver/datasource/${ASSETS_LIST_OF_LINKS_DATASOURCE_ID}/fetch/data`,
		),
		async (url: string) => {
			return new Promise((resolve) =>
				resolve(
					generateDataResponse({
						initialVisibleColumnKeys: assetsDefaultInitialVisibleColumnKeys,
					}),
				),
			);
		},
	);
};

export const forceCmdbBaseUrl = (baseUrl: string) => {
	fetchMock.mock(/^\//, ((url, init) => fetch(`${baseUrl}${url}`, init)) as typeof fetch);
};
