import React from 'react';

import type { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import { Browser } from '@atlaskit/media-picker';
import type { BrowserConfig } from '@atlaskit/media-picker/types';

import type { MediaPluginState } from '../../pm-plugins/types';

import PickerFacadeProvider from './PickerFacadeProvider';

type Props = {
	mediaState: MediaPluginState;
	isOpen?: boolean;
	onBrowseFn: (browse: () => void) => void;
	featureFlags?: MediaFeatureFlags;
};

export const BrowserWrapper = ({ mediaState, isOpen, onBrowseFn, featureFlags }: Props) => (
	<PickerFacadeProvider mediaState={mediaState} analyticsName="browser">
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
