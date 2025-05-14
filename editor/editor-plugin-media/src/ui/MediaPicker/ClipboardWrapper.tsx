import React from 'react';

import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import { Clipboard } from '@atlaskit/media-picker';
import type { ClipboardConfig } from '@atlaskit/media-picker/types';

import { MediaNextEditorPluginType } from '../../mediaPluginType';

import PickerFacadeProvider from './PickerFacadeProvider';

type Props = {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	featureFlags?: MediaFeatureFlags;
	container?: HTMLElement;
};

export const ClipboardWrapper = ({ api, container, featureFlags }: Props) => (
	<PickerFacadeProvider api={api} analyticsName="clipboard">
		{({ mediaClientConfig, config, pickerFacadeInstance }) => {
			const clipboardConfig = Object.assign({}, config) as ClipboardConfig;
			clipboardConfig.container = container;
			clipboardConfig.onPaste = (event) => {
				event.stopPropagation();
				return false;
			};
			return (
				<Clipboard
					mediaClientConfig={mediaClientConfig}
					config={clipboardConfig}
					onError={pickerFacadeInstance.handleUploadError}
					onPreviewUpdate={pickerFacadeInstance.handleUploadPreviewUpdate}
					onEnd={pickerFacadeInstance.handleReady}
					featureFlags={featureFlags}
				/>
			);
		}}
	</PickerFacadeProvider>
);
