/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type DatasourceResponseSchemaProperty } from '@atlaskit/linking-types/datasource';

const sortColumns = (
	firstOption: DatasourceResponseSchemaProperty,
	secondOption: DatasourceResponseSchemaProperty,
): number => {
	return firstOption.title.localeCompare(secondOption.title);
};

export const getOrderedColumns = (
	columns: DatasourceResponseSchemaProperty[],
	visibleColumnKeys: string[],
): DatasourceResponseSchemaProperty[] => {
	const visibleColumns = columns
		.filter((column) => visibleColumnKeys.includes(column.key))
		.sort((a, b) => {
			const indexB = visibleColumnKeys.indexOf(b.key);
			const indexA = visibleColumnKeys.indexOf(a.key);
			return indexA - indexB;
		});

	const alphabeticallySortedInvisibleColumns = columns
		.filter((column) => !visibleColumnKeys.includes(column.key))
		.sort(sortColumns);

	return [...visibleColumns, ...alphabeticallySortedInvisibleColumns];
};
