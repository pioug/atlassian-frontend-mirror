import type { DatasourceType } from '@atlaskit/linking-types/datasource';

import { type TableViewPropsRenderType } from '../types';

export interface TableCellContentProps {
	columnKey: string;
	columnTitle: string;
	columnType: DatasourceType['type'];
	id: string;
	/** Used to retrieve cell content from the store */
	renderItem: TableViewPropsRenderType;
	wrappedColumnKeys: string[] | undefined;
}
