import React, { useState } from 'react';

import ReactDOM from 'react-dom';
import type { IntlShape } from 'react-intl-next';

import type { MediaBaseAttributes } from '@atlaskit/adf-schema';
import { FloatingToolbarButton as ToolbarButton } from '@atlaskit/editor-common/ui';
import FilePreviewIcon from '@atlaskit/icon/glyph/editor/file-preview';
import type { FileIdentifier, MediaClientConfig } from '@atlaskit/media-client';
import { messages } from '@atlaskit/media-ui';
import { MediaViewer } from '@atlaskit/media-viewer';

import type { MediaPluginState } from '../pm-plugins/types';

import { getSelectedNearestMediaContainerNodeAttrs } from './utils';

interface FilePreviewProps {
  mediaPluginState: MediaPluginState;
  intl: IntlShape;
}

interface RenderMediaViewerProps {
  mediaClientConfig: MediaClientConfig;
  onClose: () => void;
  selectedNodeAttrs: MediaBaseAttributes;
}

const RenderMediaViewer = ({
  mediaClientConfig,
  onClose,
  selectedNodeAttrs,
}: RenderMediaViewerProps) => {
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
      mediaClientConfig={mediaClientConfig!}
      selectedItem={identifier}
      onClose={onClose}
    />,
    document.body,
  );
};

export const FilePreviewItem = ({
  mediaPluginState,
  intl,
}: FilePreviewProps) => {
  const [isMediaViewerVisible, setMediaViewerVisible] = useState(false);
  const openMediaViewer = () => {
    setMediaViewerVisible(true);
  };
  const onMediaViewerClose = () => {
    setMediaViewerVisible(false);
  };
  const selectedNodeAttrs =
    getSelectedNearestMediaContainerNodeAttrs(mediaPluginState);
  const shouldRenderMediaViewer =
    selectedNodeAttrs &&
    mediaPluginState.mediaClientConfig &&
    isMediaViewerVisible;
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
      {shouldRenderMediaViewer && (
        <RenderMediaViewer
          mediaClientConfig={mediaPluginState.mediaClientConfig!}
          onClose={onMediaViewerClose}
          selectedNodeAttrs={selectedNodeAttrs}
        />
      )}
    </>
  );
};
