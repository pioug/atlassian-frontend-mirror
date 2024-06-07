import type { JiraSearchMethod } from '../common/types';

import { DatasourceSearchMethod } from './types';

export const mapSearchMethod = (searchMethod: JiraSearchMethod | null) => {
	switch (searchMethod) {
		case 'basic':
			return DatasourceSearchMethod.DATASOURCE_BASIC_FILTER;
		case 'jql':
			return DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY;
		default:
			return null;
	}
};
