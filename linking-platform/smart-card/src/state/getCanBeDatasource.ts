import type { JsonLdDatasourceResponse } from '@atlaskit/link-client-extension/use-data-source-client-extension/types';

import { getDatasources } from './getDatasources';

export const getCanBeDatasource = (details?: JsonLdDatasourceResponse): boolean => {
	const datasources = getDatasources(details);
	return !!datasources && datasources.length > 0;
};
