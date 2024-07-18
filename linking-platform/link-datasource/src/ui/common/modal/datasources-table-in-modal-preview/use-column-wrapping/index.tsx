import { useCallback, useState } from 'react';

import { type IssueLikeDataTableViewProps } from '../../../../issue-like-table/types';

export type ColumnWrappingProps = Required<
	Pick<IssueLikeDataTableViewProps, 'wrappedColumnKeys' | 'onWrappedColumnChange'>
>;
export const useColumnWrapping = (initialWrappedColumnKeys: string[] = []): ColumnWrappingProps => {
	const [wrappedColumnKeys, setWrappedColumnKeys] = useState<string[]>(initialWrappedColumnKeys);

	const onWrappedColumnChange = useCallback(
		(key: string, isWrapped: boolean) => {
			const set = new Set(wrappedColumnKeys);
			if (isWrapped) {
				set.add(key);
			} else {
				set.delete(key);
			}
			setWrappedColumnKeys(Array.from(set));
		},
		[wrappedColumnKeys],
	);

	return {
		wrappedColumnKeys,
		onWrappedColumnChange,
	};
};
