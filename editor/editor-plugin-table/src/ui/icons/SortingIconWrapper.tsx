import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { SortingIcon } from '@atlaskit/editor-common/table';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { TablePlugin } from '../../tablePluginType';

type SortingIconProps = React.ComponentProps<typeof SortingIcon>;
type SortingIconWrapperProps = SortingIconProps & {
	api: ExtractInjectionAPI<TablePlugin>;
};

export const SortingIconWrapper = (props: SortingIconWrapperProps) => {
	const { editorViewModeState } = useSharedPluginState(props.api, ['editorViewMode'], {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', true),
	});

	// mode
	const modeSelector = useSharedPluginStateSelector(props.api, 'editorViewMode.mode', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const mode = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? modeSelector
		: editorViewModeState?.mode;

	if (mode === 'edit') {
		return null;
	}
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <SortingIcon {...props} />;
};
