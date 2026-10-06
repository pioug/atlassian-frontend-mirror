import React, { type ReactNode } from 'react';

import { InsetViewerContext } from './insetViewerContext';

export const InsetViewerProvider = ({
	isInsetViewer = false,
	children,
}: {
	isInsetViewer?: boolean;
	children: ReactNode;
}): React.JSX.Element => (
	<InsetViewerContext.Provider value={isInsetViewer}>{children}</InsetViewerContext.Provider>
);
