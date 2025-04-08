import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { Box, xcss } from '@atlaskit/primitives';

import { BlockControlsPlugin } from '../blockControlsPluginType';

interface VisibilityContainerProps {
	api?: ExtractInjectionAPI<BlockControlsPlugin>;
	children: React.ReactNode;
}

const baseStyles = xcss({
	transition: 'opacity 0.1s ease-in-out, visibility 0.1s ease-in-out',
});

const visibleStyles = xcss({
	opacity: 1,
	visibility: 'visible',
});

const hiddenStyles = xcss({
	opacity: 0,
	// CONFIRM this change doesnt cause this issue to regress https://product-fabric.atlassian.net/browse/ED-24136
	visibility: 'hidden',
});

export const VisibilityContainer = ({ api, children }: VisibilityContainerProps) => {
	const isOpen = useSharedPluginStateSelector(api, 'typeAhead.isOpen');

	return <Box xcss={[baseStyles, isOpen ? hiddenStyles : visibleStyles]}>{children}</Box>;
};
