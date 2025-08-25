import { useCallback, useEffect, useRef } from 'react';

import { useUserInteractions } from '../../../../../contexts/user-interactions';
import { type IssueLikeDataTableViewProps } from '../../../../issue-like-table/types';
import { getColumnAction } from '../../../../issue-like-table/utils';

export type ColumnVisibilityProps = Pick<
	IssueLikeDataTableViewProps,
	'onVisibleColumnKeysChange'
> & {
	visibleColumnCount: React.MutableRefObject<number>;
};

export const useColumnVisibility = ({
	visibleColumnKeys,
	setVisibleColumnKeys,
	defaultVisibleColumnKeys,
	initialVisibleColumnKeys,
}: {
	defaultVisibleColumnKeys: string[];
	initialVisibleColumnKeys: string[] | undefined;
	setVisibleColumnKeys: (keys: string[]) => void;
	visibleColumnKeys: string[] | undefined;
}): ColumnVisibilityProps => {
	const userInteractions = useUserInteractions();

	const visibleColumnCount = useRef(visibleColumnKeys?.length || 0);

	useEffect(() => {
		const newVisibleColumnKeys =
			!initialVisibleColumnKeys || (initialVisibleColumnKeys || []).length === 0
				? defaultVisibleColumnKeys
				: initialVisibleColumnKeys;

		visibleColumnCount.current = newVisibleColumnKeys.length;
		setVisibleColumnKeys(newVisibleColumnKeys);
	}, [initialVisibleColumnKeys, setVisibleColumnKeys, defaultVisibleColumnKeys]);

	const onVisibleColumnKeysChange = useCallback(
		(newVisibleColumnKeys: string[] = []) => {
			const columnAction = getColumnAction(visibleColumnKeys || [], newVisibleColumnKeys);
			userInteractions.add(columnAction);
			visibleColumnCount.current = newVisibleColumnKeys.length;

			setVisibleColumnKeys(newVisibleColumnKeys);
		},
		[visibleColumnKeys, setVisibleColumnKeys, userInteractions],
	);

	return {
		onVisibleColumnKeysChange,
		visibleColumnCount,
	};
};
