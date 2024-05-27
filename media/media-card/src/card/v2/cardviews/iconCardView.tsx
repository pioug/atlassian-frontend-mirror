/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useEffect, useRef } from 'react';

import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import {
  withAnalyticsEvents,
  type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { type FileDetails } from '@atlaskit/media-client';
import { createAndFireMediaCardEvent } from '../../../utils/analytics';
import { IconWrapper } from '../../ui/iconWrapper/iconWrapper';
import { useBreakpoint } from '../../useBreakpoint';
import { CardViewWrapper, type SharedCardViewProps } from './cardViewWrapper';
import type { CardStatus } from '../../../types';
import { ProgressBar } from '../../ui/progressBar/progressBar';
import { Blanket } from '../../ui/blanket/blanket';

export type IconCardViewProps = SharedCardViewProps &
  WithAnalyticsEventsProps & {
    status: CardStatus;
    metadata?: FileDetails;
    readonly progress?: number;
    readonly innerRef?: (instance: HTMLDivElement | null) => void;
  };

// NOTE: should we call this Icon or UploadingCardView since we now have ProgressBar?

const IconCardViewBase = (props: IconCardViewProps) => {
  const { dimensions, metadata, disableOverlay, innerRef, progress, status } =
    props;
  const divRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint(dimensions?.width, divRef);

  useEffect(() => {
    innerRef && !!divRef.current && innerRef(divRef.current);
  }, [innerRef]);

  const { name, mediaType, mimeType } = metadata || {};
  const hasTitleBox = !disableOverlay && !!name;
  const isUploading = status === 'uploading';

  return (
    <CardViewWrapper
      {...props}
      metadata={metadata}
      breakpoint={breakpoint}
      data-test-status={status}
      data-test-progress={progress}
      ref={divRef}
      customBlanket={() => <Blanket isFixed={isUploading} />}
      progressBar={
        isUploading
          ? () => (
              <ProgressBar
                progress={progress}
                breakpoint={breakpoint}
                positionBottom={!hasTitleBox}
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
      </IconWrapper>
    </CardViewWrapper>
  );
};

// TODO: check if analytics is correct

export const IconCardView = withAnalyticsEvents({
  onClick: createAndFireMediaCardEvent({
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'mediaCard',
    attributes: {},
  }),
})(IconCardViewBase);
