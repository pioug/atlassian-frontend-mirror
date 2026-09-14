import { useCallback, useState } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { type IssueLikeDataTableViewProps } from '../../../../issue-like-table/types';

export type ColumnWrappingProps = Required<
	Pick<IssueLikeDataTableViewProps, 'wrappedColumnKeys' | 'onWrappedColumnChange'>
> &
	Pick<IssueLikeDataTableViewProps, 'onWrappedColumnsChange'>;
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

	const onWrappedColumnChangeWithLatestState = useCallback((key: string, isWrapped: boolean) => {
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

	if (fg('platform_lp_sllv_table_settings_menu')) {
		return {
			wrappedColumnKeys,
			onWrappedColumnChange: onWrappedColumnChangeWithLatestState,
			onWrappedColumnsChange,
		};
	}

	return {
		wrappedColumnKeys,
		onWrappedColumnChange,
	};
};
