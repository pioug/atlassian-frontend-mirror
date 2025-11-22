import React from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

export const DragHandleMenu = ({
	api,
}: {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
}) => {
	const { isMenuOpen } = useSharedPluginStateWithSelector(api, ['blockControls'], (states) => ({
		isMenuOpen: states.blockControlsState?.isMenuOpen,
	}));
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
	return isMenuOpen ? <div>menu</div> : null;
};
