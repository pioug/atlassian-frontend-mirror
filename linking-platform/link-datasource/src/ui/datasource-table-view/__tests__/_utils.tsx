import fetchMock from 'fetch-mock/cjs/client';

import { ORS_ACTIONS_DISCOVERY_ENDPOINT } from '@atlaskit/link-test-helpers/datasource';
import type {
	ActionsServiceDiscoveryResponse,
	DatasourceDataResponse,
} from '@atlaskit/linking-types';

const ORS_FETCH_DATASOURCE_DATA_ENDPOINT =
	/\/gateway\/api\/object\-resolver\/datasource\/[^/]+\/fetch\/data/;

export const mockFetchDatasourceDataEndpoint = (
	overrides: {
		meta: Partial<DatasourceDataResponse['meta']>;
		data: DatasourceDataResponse['data'];
	} & Omit<DatasourceDataResponse, 'meta' | 'data'>,
) => {
	fetchMock.post(
		ORS_FETCH_DATASOURCE_DATA_ENDPOINT,
		async (): Promise<DatasourceDataResponse> => ({
			meta: {
				access: 'granted',
				visibility: 'restricted',
				...overrides.meta,
			},
			data: overrides.data,
		}),
		{ overwriteRoutes: false, repeat: 1 },
	);
};

export const mockActionKey = (fieldKey: string) => `atlassian:issue:update:${fieldKey}`;

export const mockActionsDiscoveryEndpoint = (
	overrides?: Partial<ActionsServiceDiscoveryResponse>,
) => {
	fetchMock.post(
		ORS_ACTIONS_DISCOVERY_ENDPOINT,
		async (): Promise<ActionsServiceDiscoveryResponse> => ({
			actions: [],
			permissions: {
				data: [],
			},
			...overrides,
		}),
		{ overwriteRoutes: false, repeat: 1 },
	);
};
