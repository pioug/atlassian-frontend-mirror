import React from 'react';
import { Dropzone } from '@atlaskit/media-picker';
import PickerFacadeProvider from './PickerFacadeProvider';
import { MediaPluginState } from '../../pm-plugins/types';
import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';

type Props = {
  mediaState: MediaPluginState;
  isActive: boolean;
  featureFlags?: MediaFeatureFlags;
};

export const DropzoneWrapper = ({
  mediaState,
  isActive,
  featureFlags,
}: Props) => (
  <PickerFacadeProvider mediaState={mediaState} analyticsName="dropzone">
    {({ mediaClientConfig, config, pickerFacadeInstance }) => {
      const {
        options: { customDropzoneContainer },
        handleDrag,
      } = mediaState;

      const dropzoneConfig = {
        ...config,
        container: customDropzoneContainer,
      };

      return isActive ? (
        <Dropzone
          mediaClientConfig={mediaClientConfig}
          config={dropzoneConfig}
          onError={pickerFacadeInstance.handleUploadError}
          onPreviewUpdate={pickerFacadeInstance.handleUploadPreviewUpdate}
          onEnd={pickerFacadeInstance.handleReady}
          onDragEnter={() => handleDrag('enter')}
          onDragLeave={() => handleDrag('leave')}
          featureFlags={featureFlags}
        />
      ) : null;
    }}
  </PickerFacadeProvider>
);
