import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import { Browser } from '@atlaskit/media-picker';
import type { BrowserConfig } from '@atlaskit/media-picker/types';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';

import PickerFacadeProvider from './PickerFacadeProvider';

type Props = {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	featureFlags?: MediaFeatureFlags;
	isOpen?: boolean;
	onBrowseFn: (browse: () => void) => void;
};

export const BrowserWrapper = ({ api, isOpen, onBrowseFn, featureFlags }: Props) => (
	<PickerFacadeProvider api={api} analyticsName="browser">
		{({ mediaClientConfig, config, pickerFacadeInstance }) => {
			const browserConfig: BrowserConfig = {
				...config,
				multiple: true,
			};

			return (
				<Browser
					onBrowseFn={onBrowseFn}
					isOpen={isOpen}
					config={browserConfig}
					mediaClientConfig={mediaClientConfig}
					onEnd={pickerFacadeInstance.handleReady}
					onError={pickerFacadeInstance.handleUploadError}
					onPreviewUpdate={pickerFacadeInstance.handleUploadPreviewUpdate}
					featureFlags={featureFlags}
				/>
			);
		}}
	</PickerFacadeProvider>
);
