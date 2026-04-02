import React, { type ReactPortal, useEffect, useMemo } from 'react';

import { createPortal } from 'react-dom';

import { ThemeProvider, useColorMode } from '@atlaskit/app-provider';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	appendPortalContainerIfNotAppended,
	createContainer,
	removePortalContainer,
} from '../utils/portal-dom-utils';

interface InternalPortalProps {
	children: React.ReactNode;
	zIndex: number | string;
	isClosed?: boolean;
}

export default function InternalPortal(props: InternalPortalProps): ReactPortal {
	const { zIndex, children, isClosed = false } = props;
	const container = useMemo(() => createContainer(zIndex), [zIndex]);

	const colorMode = useColorMode();

	// This is in the render method instead of useEffect so that
	// the portal will be added to the DOM before the children render.
	// For any further changes, ensure that the container does not have a
	// parent besides the portal parent.
	appendPortalContainerIfNotAppended(container);

	useEffect(() => {
		if (fg('import_into_jsm_in_template_gallery_killswitch')) {
			if (isClosed) {
				removePortalContainer(container);
			}
		}
	}, [isClosed, container]);

	useEffect(() => {
		return () => {
			removePortalContainer(container);
		};
	}, [container]);

	return createPortal(
		colorMode ? <ThemeProvider defaultColorMode={colorMode}>{children}</ThemeProvider> : children,
		container,
	);
}
