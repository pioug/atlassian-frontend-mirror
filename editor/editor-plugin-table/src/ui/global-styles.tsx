/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable @typescript-eslint/consistent-type-imports, @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic */
import { jsx, Global } from '@emotion/react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

import type { PluginInjectionAPI } from '../types';
import { tableStyles } from './common-styles';

export const GlobalStylesWrapper = ({
	featureFlags,
	api,
}: {
	api?: PluginInjectionAPI;
	featureFlags: FeatureFlags | undefined;
}): jsx.JSX.Element => {
	const { mode } = useSharedPluginStateWithSelector(api, ['editorViewMode'], (states) => ({
		mode: states.editorViewModeState?.mode,
	}));
	const isLivePageViewMode = mode === 'view';
	return (
		<Global
			styles={tableStyles({
				featureFlags,
				isDragAndDropEnabled: !isLivePageViewMode,
			})}
		/>
	);
};
