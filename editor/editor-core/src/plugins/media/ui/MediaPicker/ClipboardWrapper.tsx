import React from 'react';
import PickerFacadeProvider from './PickerFacadeProvider';
import { Clipboard } from '@atlaskit/media-picker';
import { MediaPluginState } from '../../pm-plugins/types';
import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';

type Props = {
  mediaState: MediaPluginState;
  featureFlags?: MediaFeatureFlags;
};

export const ClipboardWrapper = ({ mediaState, featureFlags }: Props) => (
  <PickerFacadeProvider mediaState={mediaState} analyticsName="clipboard">
    {({ mediaClientConfig, config, pickerFacadeInstance }) => (
      <Clipboard
        mediaClientConfig={mediaClientConfig}
        config={config}
        onError={pickerFacadeInstance.handleUploadError}
        onPreviewUpdate={pickerFacadeInstance.handleUploadPreviewUpdate}
        onEnd={pickerFacadeInstance.handleReady}
        featureFlags={featureFlags}
      />
    )}
  </PickerFacadeProvider>
);
