import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

export const DragHandleMenu = ({
	api,
}: {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
}) => {
	const { blockControlsState } = useSharedPluginState(api, ['blockControls'], {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', true),
	});
	const isMenuOpenSelector = useSharedPluginStateSelector(api, 'blockControls.isMenuOpen', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isMenuOpen = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? isMenuOpenSelector
		: blockControlsState?.isMenuOpen;

	return isMenuOpen ? <div>menu</div> : null;
};
