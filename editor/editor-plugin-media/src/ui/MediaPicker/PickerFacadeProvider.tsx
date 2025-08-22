import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { flushSync } from 'react-dom';

import {
	type NamedPluginStatesFromInjectionAPI,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ErrorReporter } from '@atlaskit/editor-common/utils';
import type { MediaClientConfig } from '@atlaskit/media-core';
import type { BrowserConfig, ClipboardConfig, DropzoneConfig } from '@atlaskit/media-picker/types';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import PickerFacade from '../../pm-plugins/picker-facade';
import type { CustomMediaPicker } from '../../types';

interface ChildrenProps {
	config: ClipboardConfig | BrowserConfig | DropzoneConfig;
	mediaClientConfig: MediaClientConfig;
	pickerFacadeInstance: PickerFacade;
}

export type Props = {
	analyticsName: string;
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	children: (props: ChildrenProps) => React.ReactElement | null;
};

type State = {
	config?: ClipboardConfig | BrowserConfig | DropzoneConfig;
	mediaClientConfig?: MediaClientConfig;
	pickerFacadeInstance?: PickerFacade;
};

const dummyMediaPickerObject: CustomMediaPicker = {
	on: () => {},
	removeAllListeners: () => {},
	emit: () => {},
	destroy: () => {},
	setUploadParams: () => {},
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<MediaNextEditorPluginType>,
		'media'
	>,
) => {
	return {
		mediaProvider: states.mediaState?.mediaProvider,
		mediaOptions: states.mediaState?.mediaOptions,
		insertFile: states.mediaState?.insertFile,
		options: states.mediaState?.options,
	};
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		return useSharedPluginStateWithSelector(api, ['media'], selector);
	},
	(api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		const { mediaState } = useSharedPluginState(api, ['media']);
		const mediaProvider = useMemo(() => mediaState?.mediaProvider, [mediaState?.mediaProvider]);
		return {
			mediaProvider,
			mediaOptions: mediaState?.mediaOptions,
			insertFile: mediaState?.insertFile,
			options: mediaState?.options,
		};
	},
);

export default function PickerFacadeProvider({ api, analyticsName, children }: Props) {
	const [state, setState] = useState<State>({
		pickerFacadeInstance: undefined,
		config: undefined,
		mediaClientConfig: undefined,
	});
	const { mediaProvider, mediaOptions, insertFile, options } = useSharedState(api);

	const handleMediaProvider = useCallback(
		async (_name: string, provider: Promise<MediaProvider> | undefined) => {
			const mediaProvider = await provider;
			if (!mediaProvider || !mediaProvider.uploadParams || !insertFile) {
				return;
			}
			const resolvedMediaClientConfig =
				(await mediaProvider.uploadMediaClientConfig) ||
				(await mediaProvider.viewMediaClientConfig);
			if (!resolvedMediaClientConfig) {
				return;
			}
			const pickerFacadeConfig = {
				mediaClientConfig: resolvedMediaClientConfig,
				errorReporter: options?.errorReporter || new ErrorReporter(),
				featureFlags: mediaOptions && mediaOptions.featureFlags,
			};

			const pickerFacadeInstance = await new PickerFacade(
				'customMediaPicker',
				pickerFacadeConfig,
				dummyMediaPickerObject,
				analyticsName,
			).init();
			pickerFacadeInstance.onNewMedia(insertFile);
			pickerFacadeInstance.setUploadParams(mediaProvider.uploadParams);
			const config = {
				uploadParams: mediaProvider.uploadParams,
			};
			flushSync(() => {
				setState({
					pickerFacadeInstance,
					config,
					mediaClientConfig: resolvedMediaClientConfig,
				});
			});
		},
		[analyticsName, insertFile, mediaOptions, options?.errorReporter],
	);

	useEffect(() => {
		if (mediaProvider) {
			handleMediaProvider('mediaProvider', Promise.resolve(mediaProvider));
		}
	}, [mediaProvider, handleMediaProvider]);

	const { mediaClientConfig, config, pickerFacadeInstance } = state;

	if (!mediaClientConfig || !config || !pickerFacadeInstance) {
		return null;
	}

	return children({
		mediaClientConfig,
		config,
		pickerFacadeInstance,
	});
}
