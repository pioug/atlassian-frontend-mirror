import React from 'react';
import { FormattedMessage } from 'react-intl';
import { messages } from '@atlaskit/media-ui';
import {
  MediaClient,
  FileState,
  isErrorFileState,
  Identifier,
  isExternalImageIdentifier,
} from '@atlaskit/media-client';
import { DownloadButtonWrapper } from './styled';
import { MediaButton } from '@atlaskit/media-ui';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  downloadButtonEvent,
  downloadErrorButtonEvent,
} from './analytics/download';
import { channel } from './analytics';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { MediaViewerError } from './error';

const downloadIcon = <DownloadIcon label="Download" />;

// TODO: MS-1556
export const DownloadButton: any = withAnalyticsEvents({
  onClick: (createEvent: CreateUIAnalyticsEvent, props: any) => {
    const ev = createEvent(props.analyticspayload);
    ev.fire(channel);
  },
})(MediaButton);

export const createItemDownloader = (
  file: FileState,
  mediaClient: MediaClient,
  collectionName?: string,
) => () => {
  const id = file.id;
  const name = !isErrorFileState(file) ? file.name : undefined;
  return mediaClient.file.downloadBinary(id, name, collectionName);
};

export type ErrorViewDownloadButtonProps = {
  state: FileState;
  mediaClient: MediaClient;
  err: MediaViewerError;
  collectionName?: string;
};

export const ErrorViewDownloadButton = (
  props: ErrorViewDownloadButtonProps,
) => {
  const downloadEvent = downloadErrorButtonEvent(props.state, props.err);
  return (
    <DownloadButtonWrapper>
      <DownloadButton
        testId="media-viewer-download-button"
        analyticspayload={downloadEvent}
        appearance="primary"
        onClick={createItemDownloader(
          props.state,
          props.mediaClient,
          props.collectionName,
        )}
      >
        <FormattedMessage {...messages.download} />
      </DownloadButton>
    </DownloadButtonWrapper>
  );
};

export type ToolbarDownloadButtonProps = {
  state: FileState;
  identifier: Identifier;
  mediaClient: MediaClient;
};

export const ToolbarDownloadButton = (props: ToolbarDownloadButtonProps) => {
  const { state, mediaClient, identifier } = props;
  const downloadEvent = downloadButtonEvent(state);

  // TODO [MS-1731]: make it work for external files as well
  if (isExternalImageIdentifier(identifier)) {
    return null;
  }

  return (
    <DownloadButton
      testId="media-viewer-download-button"
      analyticspayload={downloadEvent}
      appearance={'toolbar' as any}
      onClick={createItemDownloader(
        state,
        mediaClient,
        identifier.collectionName,
      )}
      iconBefore={downloadIcon}
    />
  );
};

export const DisabledToolbarDownloadButton = (
  <MediaButton
    appearance={'toolbar' as any}
    isDisabled={true}
    iconBefore={downloadIcon}
  />
);
