import { type DatasourceDataResponse } from '@atlaskit/linking-types';

import { mockDatasourceDataResponse } from './mockDatasourceDataResponse';
import { mockDatasourceDetailsResponse } from './mockDatasourceDetailsResponse';

export const mockDatasourceDataResponseWithSchema: DatasourceDataResponse = {
	...mockDatasourceDataResponse,
	data: {
		...mockDatasourceDataResponse.data,
		schema: {
			properties: mockDatasourceDetailsResponse.data.schema.properties,
		},
	},
};
