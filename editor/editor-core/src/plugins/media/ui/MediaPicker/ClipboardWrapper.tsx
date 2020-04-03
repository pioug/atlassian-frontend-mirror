import React from 'react';
import PickerFacadeProvider from './PickerFacadeProvider';
import { Clipboard } from '@atlaskit/media-picker';
import { MediaPluginState } from '../../pm-plugins/types';

type Props = {
  mediaState: MediaPluginState;
};

export const ClipboardWrapper = ({ mediaState }: Props) => (
  <PickerFacadeProvider mediaState={mediaState} analyticsName="clipboard">
    {({ mediaClientConfig, config, pickerFacadeInstance }) => (
      <Clipboard
        mediaClientConfig={mediaClientConfig}
        config={config}
        onError={pickerFacadeInstance.handleUploadError}
        onPreviewUpdate={pickerFacadeInstance.handleUploadPreviewUpdate}
        onEnd={pickerFacadeInstance.handleReady}
      />
    )}
  </PickerFacadeProvider>
);
