import React, { type ReactPortal, useEffect, useMemo } from 'react';

import { createPortal } from 'react-dom';

import { ThemeProvider } from '@atlaskit/app-provider/theme-provider';
import { useColorMode } from '@atlaskit/app-provider/use-color-mode';
import { useIsInsideThemeProvider } from '@atlaskit/app-provider/use-is-inside-theme-provider';

import { appendPortalContainerIfNotAppended } from '../utils/append-portal-container-if-not-appended';
import { createContainer } from '../utils/create-container';
import { removePortalContainer } from '../utils/remove-portal-container';

interface InternalPortalProps {
	children: React.ReactNode;
	zIndex: number | string;
}

export default function InternalPortal(props: InternalPortalProps): ReactPortal {
	const { zIndex, children } = props;
	const container = useMemo(() => createContainer(zIndex), [zIndex]);

	const colorMode = useColorMode();
	const isInsideThemeProvider = useIsInsideThemeProvider();

	// This is in the render method instead of useEffect so that
	// the portal will be added to the DOM before the children render.
	// For any further changes, ensure that the container does not have a
	// parent besides the portal parent.
	appendPortalContainerIfNotAppended(container);

	useEffect(() => {
		return () => {
			removePortalContainer(container);
		};
	}, [container]);

	return createPortal(
		isInsideThemeProvider ? (
			<ThemeProvider defaultColorMode={colorMode}>{children}</ThemeProvider>
		) : (
			children
		),
		container,
	);
}
