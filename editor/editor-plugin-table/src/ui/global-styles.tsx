/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { Global, jsx } from '@emotion/react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { PluginInjectionAPI } from '../types';

import { tableStyles } from './common-styles';

export const GlobalStylesWrapper = ({
	featureFlags,
	isDragAndDropEnabledOption,
	api,
}: {
	featureFlags: FeatureFlags | undefined;
	isDragAndDropEnabledOption?: boolean;
	api?: PluginInjectionAPI;
}) => {
	// mode
	const { editorViewModeState } = useSharedPluginState(api, ['editorViewMode'], {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', true),
	});
	const modeSelector = useSharedPluginStateSelector(api, 'editorViewMode.mode', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const mode = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? modeSelector
		: editorViewModeState?.mode;

	const isLivePageViewMode = mode === 'view';
	return (
		<Global
			styles={tableStyles({
				featureFlags,
				isDragAndDropEnabled: isDragAndDropEnabledOption && !isLivePageViewMode,
			})}
		/>
	);
};
