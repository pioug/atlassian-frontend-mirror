/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useEffect, useRef } from 'react';

import { type ImageResizeMode } from '@atlaskit/media-client';
import {
  withAnalyticsEvents,
  type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { type FileDetails } from '@atlaskit/media-client';
import { createAndFireMediaCardEvent } from '../../../utils/analytics';
import { ImageRenderer } from '../../ui/imageRenderer/imageRenderer';
import type { CardPreview, CardStatus } from '../../../types';
import { useBreakpoint } from '../../useBreakpoint';
import { CardViewWrapper, type SharedCardViewProps } from './cardViewWrapper';
import { ProgressBar } from '../../ui/progressBar/progressBar';
import { Blanket } from '../../ui/blanket/blanket';

export type ImageCardViewProps = SharedCardViewProps &
  WithAnalyticsEventsProps & {
    status: CardStatus;
    cardPreview: CardPreview;
    // Alternate text for an media card.
    readonly alt?: string;
    // Resize the media to 'crop' | 'fit' | 'full-fit' | 'stretchy-fit'.
    readonly resizeMode?: ImageResizeMode;
    readonly onDisplayImage?: () => void;
    readonly nativeLazyLoad?: boolean;
    readonly forceSyncDisplay?: boolean;
    readonly onImageLoad?: (cardPreview: CardPreview) => void;
    readonly onImageError?: (cardPreview: CardPreview) => void;
    metadata?: FileDetails;
    readonly innerRef?: (instance: HTMLDivElement | null) => void;
    readonly progress?: number;
  };

const ImageCardViewBase = (props: ImageCardViewProps) => {
  const {
    status,
    dimensions,
    metadata,
    disableOverlay,
    innerRef,
    progress,
    cardPreview,
    alt,
    resizeMode,
    onDisplayImage,
    nativeLazyLoad,
    forceSyncDisplay,
    onImageLoad,
    onImageError,
  } = props;
  const divRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint(dimensions?.width, divRef);

  useEffect(() => {
    innerRef && !!divRef.current && innerRef(divRef.current);
  }, [innerRef]);

  const { name, mediaType = 'unknown' } = metadata || {};
  const hasTitleBox = !disableOverlay && !!name;
  const isUploading = status === 'uploading';

  return (
    <CardViewWrapper
      {...props}
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
      <ImageRenderer
        cardPreview={cardPreview}
        mediaType={mediaType}
        alt={alt}
        resizeMode={resizeMode}
        onDisplayImage={onDisplayImage}
        onImageLoad={() => onImageLoad?.(cardPreview)}
        onImageError={() => onImageError?.(cardPreview)}
        nativeLazyLoad={nativeLazyLoad}
        forceSyncDisplay={forceSyncDisplay}
      />
    </CardViewWrapper>
  );
};

// TODO: check if analytics is correct

export const ImageCardView = withAnalyticsEvents({
  onClick: createAndFireMediaCardEvent({
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'mediaCard',
    attributes: {},
  }),
})(ImageCardViewBase);
