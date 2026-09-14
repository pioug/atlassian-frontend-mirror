import React from 'react';

import { useSmartCardContext } from './useSmartCardContext';

export const EditorSmartCardProvider = ({
	children,
}: React.PropsWithChildren<{}>): React.JSX.Element => {
	const cardContext = useSmartCardContext();
	const Provider = cardContext.Provider;

	return <Provider value={cardContext.value}>{children}</Provider>;
};
