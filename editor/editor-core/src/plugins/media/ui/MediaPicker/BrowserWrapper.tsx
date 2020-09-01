import React from 'react';
import PickerFacadeProvider from './PickerFacadeProvider';
import { Browser } from '@atlaskit/media-picker';
import { MediaPluginState } from '../../pm-plugins/types';
import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';

type Props = {
  mediaState: MediaPluginState;
  isOpen?: boolean;
  onBrowseFn: (browse: () => void) => void;
  featureFlags?: MediaFeatureFlags;
};

export const BrowserWrapper = ({
  mediaState,
  isOpen,
  onBrowseFn,
  featureFlags,
}: Props) => (
  <PickerFacadeProvider mediaState={mediaState} analyticsName="browser">
    {({ mediaClientConfig, config, pickerFacadeInstance }) => (
      <Browser
        onBrowseFn={onBrowseFn}
        isOpen={isOpen}
        config={config}
        mediaClientConfig={mediaClientConfig}
        onEnd={pickerFacadeInstance.handleReady}
        onError={pickerFacadeInstance.handleUploadError}
        onPreviewUpdate={pickerFacadeInstance.handleUploadPreviewUpdate}
        featureFlags={featureFlags}
      />
    )}
  </PickerFacadeProvider>
);
