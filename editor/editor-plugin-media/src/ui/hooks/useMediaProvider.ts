import { useMemo } from 'react';

import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';

const useSharedState = sharedPluginStateHookMigratorFactory(
	(pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		const mediaProvider = useSharedPluginStateSelector(pluginInjectionApi, 'media.mediaProvider');
		return {
			mediaProvider,
		};
	},
	(pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		const { mediaState } = useSharedPluginState(pluginInjectionApi, ['media']);
		return {
			mediaProvider: mediaState?.mediaProvider,
		};
	},
);

export const useMediaProvider = (
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
) => {
	const { mediaProvider } = useSharedState(pluginInjectionApi);
	const provider = useMemo(() => {
		return mediaProvider;
	}, [mediaProvider]);
	return provider;
};
