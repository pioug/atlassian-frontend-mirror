import React, { type PropsWithChildren } from 'react';

import { ExusUserSourceContext } from './UserSourceProvider';
import type { UserSourceContext } from './UserSourceProvider';

export const ExusUserSourceProvider = ({
	fetchUserSource,
	children,
}: PropsWithChildren<UserSourceContext>): React.JSX.Element => (
	<ExusUserSourceContext.Provider value={{ fetchUserSource }}>
		{children}
	</ExusUserSourceContext.Provider>
);
