import React, { type PropsWithChildren, useMemo, useRef } from 'react';

import { type DatasourceAction } from '../../analytics/types';
import { UserInteractionsContext } from './user-interactions-context';

export const UserInteractionsProvider = ({
	children,
}: PropsWithChildren<{}>): React.JSX.Element => {
	const userInteractionActions = useRef<Set<DatasourceAction>>(new Set());

	const providerValue = useMemo(() => {
		return {
			add: (action: DatasourceAction) => {
				userInteractionActions.current.add(action);
			},
			get: () => Array.from(userInteractionActions.current),
		};
	}, []);
	return (
		<UserInteractionsContext.Provider value={providerValue}>
			{children}
		</UserInteractionsContext.Provider>
	);
};
