import { type Ref } from 'react';

import type {
	DatasourceDataResponseItem,
	DatasourceResponseSchemaProperty,
	DatasourceTableStatusType,
	DatasourceType,
} from '@atlaskit/linking-types';

import type { NextPageType } from '../../hooks/useDatasourceTableState';

export type DatasourceTypeWithOnlyValues = {
	[K in DatasourceType['type']]: {
		type: K;
		values: Extract<DatasourceType, { type: K }>['value'][];
	};
}[DatasourceType['type']];

export type TableViewPropsRenderType = (item: DatasourceTypeWithOnlyValues) => React.ReactNode;

export interface ColumnSizesMap {
	[key: string]: number;
}

export interface IssueLikeDataTableViewProps {
	testId?: string;
	/**
	 * Datasource extension key. Optional as value may not have been returned yet
	 */
	extensionKey?: string | null;
	/**
	 * All available columns/properties.
	 * Consumer should not reorder these columns to align with `visibleColumnKeys`.
	 * UI will display them according to `visibleColumnKeys`
	 */
	columns: DatasourceResponseSchemaProperty[];
	/**
	 * List of properties/column keys that are visible/selected
	 */
	visibleColumnKeys: string[];
	hasNextPage: boolean;
	status: DatasourceTableStatusType;
	items: DatasourceDataResponseItem[];
	itemIds: string[];
	onNextPage: NextPageType;
	onLoadDatasourceDetails: () => Promise<void>;
	/**
	 * A function to define new or override existing render components.
	 * eg:
	 * const renderItem: TableViewPropsRenderType = item => {
	 *  if (item.type === 'icon') {
	 *    return (
	 *       <IconRenderType label={item.label} source={item.source} />
	 *    );
	 *  }
	 *  return fallbackRenderType(item);
	 * };
	 */
	renderItem?: TableViewPropsRenderType;
	/**
	 * Callback to be invoked whenever a user changes the visible columns in a datasource table
	 * either by selecting/unselecting or reordering (drag and drop)
	 *
	 * @param visibleColumnKeys the array of keys for all of the selected columns
	 */
	onVisibleColumnKeysChange?: (visibleColumnKeys: string[]) => void;

	/**
	 * If this number is set it will restrict (max-height) maximum size of the component AND make main container a scrollable container.
	 * It this number is undefined it will not restrict height and not make container scrollable.
	 */
	scrollableContainerHeight?: number;

	/**
	 * Map of column key to custom column width
	 */
	columnCustomSizes?: ColumnSizesMap;
	onColumnResize?: (key: string, width: number) => void;

	/**
	 * List of column keys that needs to be shown without truncation (content will wrap to a new line)
	 */
	wrappedColumnKeys?: string[];

	/**
	 * Callback to be invoked whenever user changes wrap attribute of the column.
	 *
	 * @param key Column key
	 * @param shouldWrap  Whenever column should wrap
	 */
	onWrappedColumnChange?: (key: string, shouldWrap: boolean) => void;
}

export interface HeaderRowCellType {
	key: string;
	width?: number;
	shouldTruncate?: boolean;
	content?: React.ReactNode | string;
}

export interface RowType {
	cells: Array<RowCellType>;
	key?: string;
	ref?: Ref<HTMLTableRowElement>;
}

export interface RowCellType {
	key: string;
	type?: DatasourceType['type'];
	width?: number;
	shouldTruncate?: boolean;
	content?: React.ReactNode | string;
}
