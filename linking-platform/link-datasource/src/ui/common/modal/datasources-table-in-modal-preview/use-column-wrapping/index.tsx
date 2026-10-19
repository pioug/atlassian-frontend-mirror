import { useCallback, useState } from 'react';

import { type IssueLikeDataTableViewProps } from '../../../../issue-like-table/types';

export type ColumnWrappingProps = Required<
	Pick<IssueLikeDataTableViewProps, 'wrappedColumnKeys' | 'onWrappedColumnChange'>
> &
	Pick<IssueLikeDataTableViewProps, 'onWrappedColumnsChange'>;
export const useColumnWrapping = (initialWrappedColumnKeys: string[] = []): ColumnWrappingProps => {
	const [wrappedColumnKeys, setWrappedColumnKeys] = useState<string[]>(initialWrappedColumnKeys);

	const onWrappedColumnChange = useCallback((key: string, isWrapped: boolean) => {
		setWrappedColumnKeys((currentWrappedColumnKeys) => {
			const nextWrappedColumnKeys = new Set(currentWrappedColumnKeys);
			if (isWrapped) {
				nextWrappedColumnKeys.add(key);
			} else {
				nextWrappedColumnKeys.delete(key);
			}
			return Array.from(nextWrappedColumnKeys);
		});
	}, []);

	const onWrappedColumnsChange = useCallback((nextWrappedColumnKeys: string[]) => {
		setWrappedColumnKeys(nextWrappedColumnKeys);
	}, []);

	return {
		wrappedColumnKeys,
		onWrappedColumnChange,
		onWrappedColumnsChange,
	};
};
