import React from 'react';

import { useSmartCardContext } from './useSmartCardContext';

export const EditorSmartCardProviderValueGuard = ({
	children,
}: React.PropsWithChildren<{}>): React.JSX.Element | null => {
	const cardContext = useSmartCardContext();

	if (!cardContext?.value) {
		return null;
	}
	return <>{children}</>;
};
