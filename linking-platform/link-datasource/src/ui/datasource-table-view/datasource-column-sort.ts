import type { DatasourceParameters } from '@atlaskit/linking-types';

import type { DatasourceTableSortDirection, DatasourceTableSortState } from '../issue-like-table/types';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '../jira-issues-modal';

export type { DatasourceTableSortState } from '../issue-like-table/types';


const getNextSortDirection = (
	columnKey: string,
	currentSort?: DatasourceTableSortState,
): DatasourceTableSortDirection => {
	if (currentSort?.key === columnKey) {
		return currentSort.direction === 'ASC' ? 'DESC' : 'ASC';
	}

	return 'ASC';
};

export type DatasourceColumnSortGetter = ({
	parameters,
	columnKey,
	currentSort,
}: {
	columnKey: string;
	currentSort?: DatasourceTableSortState;
	parameters: DatasourceParameters;
}) => { parameters: DatasourceParameters; sort: DatasourceTableSortState } | undefined;

// Match and remove an existing trailing ORDER BY clause before appending the next sort:
// - (?:^|\\s+) allows ORDER BY at the start of the JQL or after whitespace.
// - ORDER\\s+BY matches ORDER BY with flexible spacing and is case-insensitive (/i).
// - [\\s\\S]*$ consumes everything after ORDER BY to the end of the JQL.
// Examples:
// - "project = TEST ORDER BY created DESC" -> "project = TEST"
// - "ORDER BY priority ASC" -> ""
const JIRA_ORDER_BY_PATTERN = /(?:^|\s+)ORDER\s+BY\s+[\s\S]*$/i;

const getJiraColumnSortParameters: DatasourceColumnSortGetter = ({
	parameters,
	columnKey,
	currentSort,
}) => {
	if (typeof parameters.jql !== 'string') {
		return undefined;
	}

	const direction = getNextSortDirection(columnKey, currentSort);
	const jqlWithoutOrder = parameters.jql.replace(JIRA_ORDER_BY_PATTERN, '').trim();
	const nextOrderByClause = `ORDER BY ${columnKey} ${direction}`;

	return {
		parameters: {
			...parameters,
			jql: `${jqlWithoutOrder} ${nextOrderByClause}`,
		},
		sort: {
			key: columnKey,
			direction,
		},
	};
};

export const getDatasourceColumnSortGetter = (
	datasourceId: string,
): DatasourceColumnSortGetter | undefined => {
	if (datasourceId === JIRA_LIST_OF_LINKS_DATASOURCE_ID) {
		return getJiraColumnSortParameters;
	}

	return undefined;
};
