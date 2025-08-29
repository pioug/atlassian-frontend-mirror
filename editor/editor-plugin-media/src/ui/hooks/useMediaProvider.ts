import { useMemo } from 'react';

import {
	type NamedPluginStatesFromInjectionAPI,
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

export const useMediaProvider = (
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
) => {
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
