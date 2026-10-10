import { useMemo } from 'react';

import type { MediaProvider } from '@atlaskit/editor-common/provider-factory/media-provider';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/useSharedPluginStateWithSelector';

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

export const useMediaProvider = (
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
): MediaProvider | undefined => {
	const { mediaProvider } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['media'],
		selector,
	);
	const provider = useMemo(() => {
		return mediaProvider;
	}, [mediaProvider]);
	return provider;
};
