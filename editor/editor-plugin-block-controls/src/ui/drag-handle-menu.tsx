import React from 'react';

import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

const useDragHandleMenuPluginState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<BlockControlsPlugin> | undefined) => {
		const isMenuOpen = useSharedPluginStateSelector(api, 'blockControls.isMenuOpen');
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
