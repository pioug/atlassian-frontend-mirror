import { useState } from 'react';

import { defaultInitialVisibleJiraColumnKeys } from '@atlaskit/link-test-helpers/datasource';

import type { DatasourceTableViewProps } from '../src/ui/datasource-table-view/types';
import type { ColumnSizesMap } from '../src/ui/issue-like-table/types';
import { useColumnResize } from '../src/ui/issue-like-table/use-column-resize';
import { useColumnWrapping } from '../src/ui/issue-like-table/use-column-wrapping';

export const useCommonTableProps = (
	props: { defaultColumnCustomSizes?: ColumnSizesMap } = {},
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
		defaultInitialVisibleJiraColumnKeys,
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
