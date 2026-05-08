import React, { useMemo } from 'react';

import { OverflowContext } from './overflow-context';
import { type OverflowProviderProps } from './types';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const OverflowProvider = ({
	children,
	isVisible,
	openOverflowMenu,
	closeOverflowMenu,
}: OverflowProviderProps): React.JSX.Element => {
	const value = useMemo(
		() => ({ isVisible, openOverflowMenu, closeOverflowMenu }),
		[isVisible, openOverflowMenu, closeOverflowMenu],
	);

	return <OverflowContext.Provider value={value}>{children}</OverflowContext.Provider>;
};
