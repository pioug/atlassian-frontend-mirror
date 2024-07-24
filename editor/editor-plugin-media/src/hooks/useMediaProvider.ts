import { useMemo } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { MediaNextEditorPluginType } from '../next-plugin-type';

export const useMediaProvider = (
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
) => {
	const { mediaState } = useSharedPluginState(pluginInjectionApi, ['media']);

	const provider = useMemo(() => {
		return mediaState?.mediaProvider;
	}, [mediaState?.mediaProvider]);
	return provider;
};
