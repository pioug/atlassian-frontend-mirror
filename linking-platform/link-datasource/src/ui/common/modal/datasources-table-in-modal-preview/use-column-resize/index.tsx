import { useCallback, useState } from 'react';

import {
	type ColumnSizesMap,
	type IssueLikeDataTableViewProps,
} from '../../../../issue-like-table/types';

export type ColumnResizeProps = Required<Pick<IssueLikeDataTableViewProps, 'onColumnResize'>> &
	Pick<IssueLikeDataTableViewProps, 'columnCustomSizes'>;

export const useColumnResize = (
	initialColumnCustomSizes: ColumnSizesMap | undefined,
): ColumnResizeProps => {
	const [columnCustomSizes, setColumnCustomSizes] = useState<ColumnSizesMap | undefined>(
		initialColumnCustomSizes,
	);

	const onColumnResize = useCallback(
		(key: string, width: number) => {
			setColumnCustomSizes({ ...columnCustomSizes, [key]: width });
		},
		[columnCustomSizes],
	);

	return {
		columnCustomSizes,
		onColumnResize,
	};
};
