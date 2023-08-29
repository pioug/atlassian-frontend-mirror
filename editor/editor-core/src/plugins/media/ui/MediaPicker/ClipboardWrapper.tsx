import React from 'react';
import PickerFacadeProvider from './PickerFacadeProvider';
import { Clipboard } from '@atlaskit/media-picker';
import type { ClipboardConfig } from '@atlaskit/media-picker/types';
import type { MediaPluginState } from '../../pm-plugins/types';
import type { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';

type Props = {
  mediaState: MediaPluginState;
  featureFlags?: MediaFeatureFlags;
  container?: HTMLElement;
};

export const ClipboardWrapper = ({
  mediaState,
  featureFlags,
  container,
}: Props) => (
  <PickerFacadeProvider mediaState={mediaState} analyticsName="clipboard">
    {({ mediaClientConfig, config, pickerFacadeInstance }) => {
      const clipboardConfig = Object.assign({}, config) as ClipboardConfig;
      if (featureFlags?.securedClipboard === true) {
        clipboardConfig.container = container;
        clipboardConfig.onPaste = (event) => {
          event.stopPropagation();
          return false;
        };
      }
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
