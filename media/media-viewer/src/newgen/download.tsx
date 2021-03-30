import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import {
  FileState,
  Identifier,
  isErrorFileState,
  isExternalImageIdentifier,
  MediaClient,
} from '@atlaskit/media-client';
import { MediaButton, messages } from '@atlaskit/media-ui';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common';
import { createDownloadButtonClickedEvent } from './analytics/events/ui/downloadButtonClicked';
import { createFailedPreviewDownloadButtonClickedEvent } from './analytics/events/ui/failedPreviewDownloadButtonClicked';
import { DownloadButtonWrapper } from './styled';
import { MediaViewerError } from './errors';

const downloadIcon = <DownloadIcon label="Download" />;

type DownloadButtonProps = React.ComponentProps<typeof MediaButton> & {
  analyticspayload: Record<string, any>;
};
function noop() {}

export function DownloadButton({
  analyticspayload,
  onClick: providedOnClick = noop,
  ...rest
}: DownloadButtonProps) {
  const onClick = useCallback(
    (
      event: React.MouseEvent<HTMLElement>,
      analyticsEvent: UIAnalyticsEvent,
    ) => {
      const clone = analyticsEvent.clone();
      if (clone) {
        clone.update(analyticspayload);
        clone.fire(ANALYTICS_MEDIA_CHANNEL);
      }
      providedOnClick(event, analyticsEvent);
    },
    [analyticspayload, providedOnClick],
  );

  return <MediaButton {...rest} onClick={onClick} />;
}

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
  fileState: FileState;
  mediaClient: MediaClient;
  error: MediaViewerError;
  collectionName?: string;
};

export const ErrorViewDownloadButton = (
  props: ErrorViewDownloadButtonProps,
) => {
  const { fileState, error } = props;
  const downloadEvent = createFailedPreviewDownloadButtonClickedEvent(
    fileState,
    error,
  );
  return (
    <DownloadButtonWrapper>
      <DownloadButton
        testId="media-viewer-download-button"
        analyticspayload={downloadEvent}
        appearance="primary"
        onClick={createItemDownloader(
          props.fileState,
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
  const downloadEvent = createDownloadButtonClickedEvent(state);

  // TODO [MS-1731]: make it work for external files as well
  if (isExternalImageIdentifier(identifier)) {
    return null;
  }

  return (
    <DownloadButton
      testId="media-viewer-download-button"
      analyticspayload={downloadEvent}
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
  <MediaButton isDisabled={true} iconBefore={downloadIcon} />
);
