import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { Box, xcss } from '@atlaskit/primitives';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

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
	visibility: 'hidden',
});

export const VisibilityContainer = ({ api, children }: VisibilityContainerProps) => {
	const isTypeAheadOpen = useSharedPluginStateSelector(api, 'typeAhead.isOpen');
	const isEditing = useSharedPluginStateSelector(api, 'blockControls.isEditing');

	const shouldHide = isTypeAheadOpen || isEditing;

	return <Box xcss={[baseStyles, shouldHide ? hiddenStyles : visibleStyles]}>{children}</Box>;
};
