import React from 'react';

import { useSmartCardContext } from '@atlaskit/link-provider';

export const WithCardContext = ({
	children,
}: {
	children: (cardContext: ReturnType<typeof useSmartCardContext>) => React.ReactNode;
}): React.JSX.Element => {
	const cardContext = useSmartCardContext();
	return <>{children(cardContext)}</>;
};
