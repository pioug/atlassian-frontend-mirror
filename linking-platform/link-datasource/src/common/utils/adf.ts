import { type Datasource, type DatasourceAdf } from '@atlaskit/linking-common/types';

export const buildDatasourceAdf = <P extends Record<string, unknown>>(
	datasource: Datasource<P>,
	url?: string,
): DatasourceAdf<P> => {
	return {
		type: 'blockCard',
		attrs: {
			url,
			datasource,
		},
	};
};
