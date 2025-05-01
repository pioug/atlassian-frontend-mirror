import { useMemo } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';

export const useMediaProvider = (
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
) => {
	const { mediaState } = useSharedPluginState(pluginInjectionApi, ['media'], {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', true),
	});
	const mediaProviderSelector = useSharedPluginStateSelector(
		pluginInjectionApi,
		'media.mediaProvider',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const mediaProvider = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? mediaProviderSelector
		: mediaState?.mediaProvider;

	const provider = useMemo(() => {
		return mediaProvider;
	}, [mediaProvider]);
	return provider;
};
