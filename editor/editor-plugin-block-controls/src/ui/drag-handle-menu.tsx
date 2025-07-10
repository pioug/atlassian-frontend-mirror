import React from 'react';

import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

const useDragHandleMenuPluginState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<BlockControlsPlugin> | undefined) => {
		const { isMenuOpen } = useSharedPluginStateWithSelector(api, ['blockControls'], (states) => ({
			isMenuOpen: states.blockControlsState?.isMenuOpen,
		}));
		return {
			isMenuOpen,
		};
	},
	(api: ExtractInjectionAPI<BlockControlsPlugin> | undefined) => {
		const { blockControlsState } = useSharedPluginState(api, ['blockControls']);
		return {
			isMenuOpen: blockControlsState?.isMenuOpen,
		};
	},
);

export const DragHandleMenu = ({
	api,
}: {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
}) => {
	const { isMenuOpen } = useDragHandleMenuPluginState(api);
	return isMenuOpen ? <div>menu</div> : null;
};
