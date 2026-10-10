import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { MediaFeatureFlags } from '@atlaskit/media-common/types';
import { ClipboardLoader as Clipboard } from '@atlaskit/media-picker/clipboard';
import type { ClipboardConfig } from '@atlaskit/media-picker/types';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import PickerFacadeProvider from './PickerFacadeProvider';

type Props = {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	container?: HTMLElement;
	featureFlags?: MediaFeatureFlags;
};

export const ClipboardWrapper = ({ api, container, featureFlags }: Props): React.JSX.Element => (
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
