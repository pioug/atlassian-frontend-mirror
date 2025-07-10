import { useMemo } from 'react';

import {
	type NamedPluginStatesFromInjectionAPI,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<MediaNextEditorPluginType>,
		'media'
	>,
) => {
	return {
		mediaProvider: states.mediaState?.mediaProvider,
	};
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		return useSharedPluginStateWithSelector(pluginInjectionApi, ['media'], selector);
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
