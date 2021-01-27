import React from 'react';
import { Dropzone, DropzoneConfig } from '@atlaskit/media-picker';
import PickerFacadeProvider from './PickerFacadeProvider';
import { MediaPluginState } from '../../pm-plugins/types';
import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import { findOverflowScrollParent } from '@atlaskit/editor-common';
import { EditorAppearance } from '../../../../types/editor-appearance';

type Props = {
  mediaState: MediaPluginState;
  isActive: boolean;
  featureFlags?: MediaFeatureFlags;
  editorDomElement: Element;
  appearance: EditorAppearance;
};

export const DropzoneWrapper = ({
  mediaState,
  isActive,
  featureFlags,
  editorDomElement,
  appearance,
}: Props) => (
  <PickerFacadeProvider mediaState={mediaState} analyticsName="dropzone">
    {({ mediaClientConfig, config, pickerFacadeInstance }) => {
      const {
        options: { customDropzoneContainer },
        handleDrag,
      } = mediaState;
      const editorHtmlElement = editorDomElement as HTMLElement;
      const scrollParent =
        appearance === 'full-page' &&
        findOverflowScrollParent(editorHtmlElement);
      const container =
        customDropzoneContainer ||
        (scrollParent ? scrollParent : editorHtmlElement);
      const dropzoneConfig: DropzoneConfig = {
        ...config,
        container,
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
