import { useState } from 'react';

import { defaultInitialVisibleJiraColumnKeys } from '@atlaskit/link-test-helpers/datasource';

import { useColumnResize } from '../src/ui/common/modal/datasources-table-in-modal-preview/use-column-resize';
import { useColumnWrapping } from '../src/ui/common/modal/datasources-table-in-modal-preview/use-column-wrapping';
import type { DatasourceTableViewProps } from '../src/ui/datasource-table-view/types';
import type { ColumnSizesMap } from '../src/ui/issue-like-table/types';

export const useCommonTableProps = (
	props: { defaultColumnCustomSizes?: ColumnSizesMap; visibleColumnKeys?: string[] } = {},
): Required<
	Pick<
		DatasourceTableViewProps,
		| 'visibleColumnKeys'
		| 'onVisibleColumnKeysChange'
		| 'wrappedColumnKeys'
		| 'onWrappedColumnChange'
		| 'onColumnResize'
	>
> &
	Pick<DatasourceTableViewProps, 'columnCustomSizes'> => {
	const [visibleColumnKeys, onVisibleColumnKeysChange] = useState<string[]>(
		props.visibleColumnKeys ?? defaultInitialVisibleJiraColumnKeys,
	);

	const { columnCustomSizes, onColumnResize } = useColumnResize(props.defaultColumnCustomSizes);

	const { wrappedColumnKeys, onWrappedColumnChange } = useColumnWrapping([]);

	return {
		visibleColumnKeys,
		onVisibleColumnKeysChange,
		columnCustomSizes,
		onColumnResize,
		wrappedColumnKeys,
		onWrappedColumnChange,
	};
};
