import { type JiraSearchMethod } from '../common/types';

import { DatasourceSearchMethod } from './types';
import { mapSearchMethod } from './utils';

describe('mapSearchMethod', () => {
	it.each([
		{
			inputSearchMethod: 'basic' as JiraSearchMethod,
			outputSearchMethod: DatasourceSearchMethod.DATASOURCE_BASIC_FILTER,
		},
		{
			inputSearchMethod: 'jql' as JiraSearchMethod,
			outputSearchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
		},
		{
			inputSearchMethod: null,
			outputSearchMethod: null,
		},
	])(
		'should return expected value for the following parameters: %p',
		({ inputSearchMethod, outputSearchMethod }) => {
			expect(mapSearchMethod(inputSearchMethod)).toEqual(outputSearchMethod);
		},
	);
});
