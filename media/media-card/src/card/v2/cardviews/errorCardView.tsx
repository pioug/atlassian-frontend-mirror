/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useRef } from 'react';

import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { FileDetails } from '@atlaskit/media-client';
import { createAndFireMediaCardEvent } from '../../../utils/analytics';
import { useBreakpoint } from '../../useBreakpoint';
import { CardViewWrapper, SharedCardViewProps } from './cardViewWrapper';

import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import { IconWrapper } from '../../ui/iconWrapper/iconWrapper';
import { FailedTitleBox } from '../../ui/titleBox/failedTitleBox';
import {
  PreviewUnavailable,
  FailedToUpload,
  PreviewCurrentlyUnavailable,
  FailedToLoad,
} from '../../ui/iconMessage';
import {
  isUploadError,
  isRateLimitedError,
  isPollingError,
  MediaCardError,
} from '../../../errors';
import { messages } from '@atlaskit/media-ui';

export type ErrorCardViewProps = SharedCardViewProps &
  WithAnalyticsEventsProps & {
    metadata?: FileDetails;
    disableAnimation?: boolean;
    readonly error?: MediaCardError;
  };

type ErrorMessageProps = {
  metadata?: FileDetails;
  readonly error?: MediaCardError;
};

const IconMessage = ({ error, metadata }: ErrorMessageProps) => {
  const { secondaryError } = error || {};

  if (isRateLimitedError(secondaryError) || isPollingError(secondaryError)) {
    return <PreviewCurrentlyUnavailable />;
  } else if (isUploadError(error)) {
    return <FailedToUpload />;
  } else if (!metadata) {
    return <FailedToLoad />;
  } else {
    return <PreviewUnavailable />;
  }
};

const ErrorCardViewBase = (props: ErrorCardViewProps) => {
  const { error, metadata, dimensions, disableOverlay } = props;
  const { name, mediaType, mimeType } = metadata || {};

  const divRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint(dimensions?.width, divRef);

  const customMessage = isUploadError(props.error)
    ? messages.failed_to_upload
    : undefined;

  const renderFailedTitleBox = !disableOverlay && (!name || !!customMessage);
  const renderTitleBox = !disableOverlay && !!name && !customMessage;
  const hasTitleBox = !!renderTitleBox || !!renderFailedTitleBox;

  return (
    <CardViewWrapper
      {...props}
      metadata={metadata}
      breakpoint={breakpoint}
      data-test-status="error"
      ref={divRef}
      customTitleBox={
        renderFailedTitleBox
          ? () => (
              <FailedTitleBox
                breakpoint={breakpoint}
                customMessage={customMessage}
              />
            )
          : undefined
      }
    >
      <IconWrapper breakpoint={breakpoint} hasTitleBox={hasTitleBox}>
        <MimeTypeIcon
          testId="media-card-file-type-icon"
          mediaType={mediaType}
          mimeType={mimeType}
          name={name}
        />
        {/* TODO: see if you can refactor this renderFailedTitleBox into ErrorMessage */}
        {!renderFailedTitleBox && (
          <IconMessage error={error} metadata={metadata} />
        )}
      </IconWrapper>
    </CardViewWrapper>
  );
};

// TODO: check if analytics is correct

export const ErrorCardView = withAnalyticsEvents({
  onClick: createAndFireMediaCardEvent({
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'mediaCard',
    attributes: {},
  }),
})(ErrorCardViewBase);
