/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { Global, jsx } from '@emotion/react';

import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';

import type { PluginInjectionAPI } from '../types';

import { tableStyles } from './common-styles';

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: PluginInjectionAPI | undefined) => {
		const mode = useSharedPluginStateSelector(api, 'editorViewMode.mode');
		return {
			mode,
		};
	},
	(api: PluginInjectionAPI | undefined) => {
		const { editorViewModeState } = useSharedPluginState(api, ['editorViewMode']);
		return {
			mode: editorViewModeState?.mode,
		};
	},
);

export const GlobalStylesWrapper = ({
	featureFlags,
	isDragAndDropEnabledOption,
	api,
}: {
	featureFlags: FeatureFlags | undefined;
	isDragAndDropEnabledOption?: boolean;
	api?: PluginInjectionAPI;
}) => {
	const { mode } = useSharedState(api);
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
