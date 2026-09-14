import type { DatasourceDataResponseItem, Link } from '@atlaskit/linking-types/datasource';

/**
 * Extracts the issue link (URL + text) from a row's `key` column data, if present.
 * Returns `undefined` when the row has no `key` data or the data has no URL,
 * so callers can treat the result as a simple "is this row linkable?" check.
 */
export const getIssueLinkData = (rowData: DatasourceDataResponseItem): Link | undefined => {
	const keyData = rowData.key?.data as Link | undefined;
	return keyData?.url ? keyData : undefined;
};
