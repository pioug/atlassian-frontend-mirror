import type { FC } from 'react';
import React, { useState } from 'react';

import ReactDOM from 'react-dom';
import type { IntlShape } from 'react-intl-next';

import { FloatingToolbarButton as ToolbarButton } from '@atlaskit/editor-common/ui';
import FilePreviewIcon from '@atlaskit/icon/glyph/editor/file-preview';
import type { FileIdentifier } from '@atlaskit/media-client';
import { messages } from '@atlaskit/media-ui';
import { MediaViewer } from '@atlaskit/media-viewer';

import type { MediaPluginState } from '../pm-plugins/types';

import { getSelectedNearestMediaContainerNodeAttrs } from './utils';

interface FilePreviewProps {
  mediaPluginState: MediaPluginState;
  intl: IntlShape;
}

export const FilePreviewItem: FC<FilePreviewProps> = ({
  mediaPluginState,
  intl,
}) => {
  const [isMediaViewerVisible, setMediaViewerVisible] = useState(false);
  const openMediaViewer = () => {
    setMediaViewerVisible(true);
  };
  const onMediaViewerClose = () => {
    setMediaViewerVisible(false);
  };

  const renderMediaViewer = () => {
    if (isMediaViewerVisible) {
      const selectedNodeAttrs =
        getSelectedNearestMediaContainerNodeAttrs(mediaPluginState);
      if (selectedNodeAttrs && mediaPluginState.mediaClientConfig) {
        const { id, collection = '' } = selectedNodeAttrs;
        const identifier: FileIdentifier = {
          id,
          mediaItemType: 'file',
          collectionName: collection,
        };
        return ReactDOM.createPortal(
          <MediaViewer
            collectionName={collection}
            items={[]}
            mediaClientConfig={mediaPluginState.mediaClientConfig}
            selectedItem={identifier}
            onClose={onMediaViewerClose}
          />,
          document.body,
        );
      }
    }
    return null;
  };
  const mediaViewer = renderMediaViewer();
  const tooltipContent = intl.formatMessage(messages.preview);
  return (
    <>
      <ToolbarButton
        testId="file-preview-toolbar-button"
        key="editor.media.card.preview"
        onClick={openMediaViewer}
        icon={<FilePreviewIcon label="file preview" />}
        tooltipContent={tooltipContent}
      />
      {mediaViewer}
    </>
  );
};
