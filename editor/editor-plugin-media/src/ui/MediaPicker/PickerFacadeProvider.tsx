import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { flushSync } from 'react-dom';

import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { ErrorReporter } from '@atlaskit/editor-common/utils';
import type { MediaClientConfig } from '@atlaskit/media-core';
import type { BrowserConfig, ClipboardConfig, DropzoneConfig } from '@atlaskit/media-picker/types';

import PickerFacade from '../../pm-plugins/picker-facade';
import type { MediaPluginState } from '../../pm-plugins/types';
import type { CustomMediaPicker } from '../../types';

interface ChildrenProps {
	config: ClipboardConfig | BrowserConfig | DropzoneConfig;
	mediaClientConfig: MediaClientConfig;
	pickerFacadeInstance: PickerFacade;
}

export type Props = {
	mediaState: MediaPluginState;
	analyticsName: string;
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

export default function PickerFacadeProvider({ mediaState, analyticsName, children }: Props) {
	const [state, setState] = useState<State>({
		pickerFacadeInstance: undefined,
		config: undefined,
		mediaClientConfig: undefined,
	});

	const mediaProvider = useMemo(() => mediaState?.mediaProvider, [mediaState?.mediaProvider]);

	const handleMediaProvider = useCallback(
		async (_name: string, provider: Promise<MediaProvider> | undefined) => {
			const mediaProvider = await provider;
			if (!mediaProvider || !mediaProvider.uploadParams) {
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
				errorReporter: mediaState.options.errorReporter || new ErrorReporter(),
				featureFlags: mediaState.mediaOptions && mediaState.mediaOptions.featureFlags,
			};

			const pickerFacadeInstance = await new PickerFacade(
				'customMediaPicker',
				pickerFacadeConfig,
				dummyMediaPickerObject,
				analyticsName,
			).init();
			pickerFacadeInstance.onNewMedia(mediaState.insertFile);
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
		[
			analyticsName,
			mediaState.insertFile,
			mediaState.mediaOptions,
			mediaState.options.errorReporter,
		],
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
