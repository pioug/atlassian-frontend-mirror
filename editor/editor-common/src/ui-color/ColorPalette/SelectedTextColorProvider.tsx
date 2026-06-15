import React, { useMemo } from 'react';

import {
	SelectedTextColorContext,
	type SelectedTextColorContextValue,
} from './SelectedTextColorContext';

type SelectedTextColorProviderProps = SelectedTextColorContextValue & {
	children: React.ReactNode;
};

export const SelectedTextColorProvider = ({
	children,
	defaultColor,
	textColor,
}: SelectedTextColorProviderProps): React.JSX.Element => {
	const value = useMemo(() => ({ defaultColor, textColor }), [defaultColor, textColor]);

	return (
		<SelectedTextColorContext.Provider value={value}>
			{children}
		</SelectedTextColorContext.Provider>
	);
};
