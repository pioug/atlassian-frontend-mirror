import type { DatasourceParameters } from '@atlaskit/linking-types';

import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '../jira-issues-modal';

import { getDatasourceColumnSortGetter } from './datasource-column-sort';

describe('getDatasourceColumnSortGetter', () => {
	it('returns undefined when datasource is not Jira', () => {
		expect(getDatasourceColumnSortGetter('unknown-datasource')).toBeUndefined();
	});

	it('returns undefined when jira parameters do not include a string jql', () => {
		const getter = getDatasourceColumnSortGetter(JIRA_LIST_OF_LINKS_DATASOURCE_ID);

		const result = getter?.({
			columnKey: 'created',
			parameters: { cloudId: 'cloud-id' } as DatasourceParameters,
		});

		expect(result).toBeUndefined();
	});

	it('creates a new ASC order when there is no current sort', () => {
		const getter = getDatasourceColumnSortGetter(JIRA_LIST_OF_LINKS_DATASOURCE_ID);

		const result = getter?.({
			columnKey: 'created',
			parameters: {
				jql: 'project = TEST',
			},
		});

		expect(result).toEqual({
			parameters: {
				jql: 'project = TEST ORDER BY created ASC',
			},
			sort: {
				key: 'created',
				direction: 'ASC',
			},
		});
	});

	it('toggles to DESC when sorting the same column again', () => {
		const getter = getDatasourceColumnSortGetter(JIRA_LIST_OF_LINKS_DATASOURCE_ID);

		const result = getter?.({
			columnKey: 'created',
			currentSort: { key: 'created', direction: 'ASC' },
			parameters: {
				jql: 'project = TEST ORDER BY created ASC',
			},
		});

		expect(result).toEqual({
			parameters: {
				jql: 'project = TEST ORDER BY created DESC',
			},
			sort: {
				key: 'created',
				direction: 'DESC',
			},
		});
	});

	it('clears sorting when sorting the same column after DESC', () => {
		const getter = getDatasourceColumnSortGetter(JIRA_LIST_OF_LINKS_DATASOURCE_ID);

		const result = getter?.({
			columnKey: 'created',
			currentSort: { key: 'created', direction: 'DESC' },
			parameters: {
				jql: 'project = TEST ORDER BY priority ASC',
			},
		});

		expect(result).toEqual({
			parameters: {
				jql: 'project = TEST ORDER BY priority ASC',
			},
			sort: undefined,
		});
	});

	it('resets to ASC when sorting a different column', () => {
		const getter = getDatasourceColumnSortGetter(JIRA_LIST_OF_LINKS_DATASOURCE_ID);

		const result = getter?.({
			columnKey: 'status',
			currentSort: { key: 'created', direction: 'DESC' },
			parameters: {
				jql: 'project = TEST ORDER BY created DESC',
			},
		});

		expect(result).toEqual({
			parameters: {
				jql: 'project = TEST ORDER BY status ASC',
			},
			sort: {
				key: 'status',
				direction: 'ASC',
			},
		});
	});

	it('cleans up jql that starts with ORDER BY before applying next sort', () => {
		const getter = getDatasourceColumnSortGetter(JIRA_LIST_OF_LINKS_DATASOURCE_ID);

		const result = getter?.({
			columnKey: 'created',
			parameters: {
				jql: 'ORDER BY created DESC',
			},
		});

		expect(result?.parameters.jql.trim()).toEqual('ORDER BY created ASC');
		expect(result?.sort).toEqual({
			key: 'created',
			direction: 'ASC',
		});
	});
});
