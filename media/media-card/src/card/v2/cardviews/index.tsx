/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { type MouseEvent, useEffect, useState, useRef } from 'react';
import { type MessageDescriptor } from 'react-intl-next';

import { type MediaItemType, type FileDetails } from '@atlaskit/media-client';
import {
  withAnalyticsEvents,
  type WithAnalyticsEventsProps,
  type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import {
  type SharedCardProps,
  type CardStatus,
  type MediaCardCursor,
  type CardPreview,
} from '../../../types';
import { createAndFireMediaCardEvent } from '../../../utils/analytics';
import { type MediaCardError } from '../../../errors';
import { useBreakpoint } from '../../useBreakpoint';
import { ProcessingCardView } from './processingCardView';
import { ErrorCardView } from './errorCardView';
import { VideoCardView } from './videoCardView';
import { ImageCardView } from './imageCardView';
import { IconCardView } from './iconCardView';
import { LoadingCardView } from './loadingCardView';
import { type MediaFilePreview } from '@atlaskit/media-file-preview';

export interface CardViewsOwnProps extends SharedCardProps {
  readonly status: CardStatus;
  readonly mediaItemType: MediaItemType;
  readonly mediaCardCursor?: MediaCardCursor;
  readonly metadata?: FileDetails;
  readonly error?: MediaCardError;
  readonly onClick?: (
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  readonly onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
  readonly onDisplayImage?: () => void;
  // FileCardProps
  readonly cardPreview?: MediaFilePreview;
  readonly progress?: number;
  // CardView can't implement forwardRef as it needs to pass and at the same time
  // handle the HTML element internally. There is no standard way to do this.
  // Therefore, we restrict the use of refs to callbacks only, not RefObjects.
  readonly innerRef?: (instance: HTMLDivElement | null) => void;
  readonly onImageLoad?: (cardPreview: MediaFilePreview) => void;
  readonly onImageError?: (cardPreview: MediaFilePreview) => void;
  readonly nativeLazyLoad?: boolean;
  readonly forceSyncDisplay?: boolean;
  // Used to disable animation for testing purposes
  disableAnimation?: boolean;
  shouldHideTooltip?: boolean;
  readonly openMediaViewerButtonRef?: React.Ref<HTMLButtonElement>;
  readonly shouldOpenMediaViewer?: boolean;
}

export type CardViewV2Props = CardViewsOwnProps & WithAnalyticsEventsProps;

export interface RenderConfigByStatusV2 {
  renderTypeIcon?: boolean;
  iconMessage?: JSX.Element;
  renderImageRenderer?: boolean;
  renderPlayButton?: boolean;
  renderTitleBox?: boolean;
  renderBlanket?: boolean;
  isFixedBlanket?: boolean;
  renderProgressBar?: boolean;
  renderSpinner?: boolean;
  renderFailedTitleBox?: boolean;
  renderTickBox?: boolean;
  customTitleMessage?: MessageDescriptor;
}

export const CardViewsBase = ({
  innerRef,
  onImageLoad,
  onImageError,
  dimensions,
  appearance = 'auto',
  onClick,
  onMouseEnter,
  testId,
  metadata,
  status,
  selected,
  selectable,
  cardPreview,
  mediaCardCursor,
  shouldHideTooltip,
  progress,
  alt,
  resizeMode,
  onDisplayImage,
  nativeLazyLoad,
  forceSyncDisplay,
  actions,
  disableOverlay,
  titleBoxBgColor,
  titleBoxIcon,
  error,
  disableAnimation,
  shouldOpenMediaViewer,
  openMediaViewerButtonRef,
}: CardViewV2Props) => {
  const [didImageRender, setDidImageRender] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);
  const prevCardPreviewRef = useRef<MediaFilePreview | undefined>();
  const breakpoint = useBreakpoint(dimensions?.width, divRef);

  useEffect(() => {
    innerRef && !!divRef.current && innerRef(divRef.current);
  }, [innerRef]);

  /* didImageRender movements */

  useEffect(() => {
    // We should only switch didImageRender to false when cardPreview goes undefined, not when it is changed. as this method could be triggered after onImageLoad callback, falling on a race condition
    if (prevCardPreviewRef.current && !cardPreview) {
      setDidImageRender(false);
    }
    prevCardPreviewRef.current = cardPreview;
  }, [cardPreview]);

  const handleOnImageLoad = (prevCardPreview: CardPreview) => {
    if (prevCardPreview.dataURI !== cardPreview?.dataURI) {
      return;
    }
    setDidImageRender(true);
    onImageLoad?.(cardPreview);
  };

  const handleOnImageError = (prevCardPreview: CardPreview) => {
    if (prevCardPreview.dataURI !== cardPreview?.dataURI) {
      return;
    }
    setDidImageRender(false);
    onImageError?.(cardPreview);
  };

  const getRenderConfigByStatus = () => {
    const { mediaType } = metadata || {};

    // TODO: figure out if data-test-progress for all the card views

    const baseProps = {
      testId,
      dimensions,
      appearance,
      metadata,
      selected,
      selectable,
      actions,
      breakpoint,
      disableOverlay,
      titleBoxBgColor,
      titleBoxIcon,
      shouldHideTooltip,
      onClick,
      onMouseEnter,
      mediaCardCursor,
      innerRef,
      shouldOpenMediaViewer,
      openMediaViewerButtonRef,
    };

    switch (status) {
      case 'uploading':
        if (cardPreview) {
          return (
            <React.Fragment>
              <div style={{ display: !didImageRender ? 'none' : 'inline' }}>
                {mediaType === 'video' ? (
                  <VideoCardView
                    {...baseProps}
                    status={status}
                    cardPreview={cardPreview}
                    alt={alt}
                    resizeMode={resizeMode}
                    onDisplayImage={onDisplayImage}
                    onImageLoad={handleOnImageLoad}
                    onImageError={handleOnImageError}
                    nativeLazyLoad={nativeLazyLoad}
                    forceSyncDisplay={forceSyncDisplay}
                    progress={progress}
                  />
                ) : (
                  <ImageCardView
                    {...baseProps}
                    status={status}
                    cardPreview={cardPreview}
                    alt={alt}
                    resizeMode={resizeMode}
                    onDisplayImage={onDisplayImage}
                    onImageLoad={handleOnImageLoad}
                    onImageError={handleOnImageError}
                    nativeLazyLoad={nativeLazyLoad}
                    forceSyncDisplay={forceSyncDisplay}
                    progress={progress}
                  />
                )}
              </div>
              <div style={{ display: didImageRender ? 'none' : 'inline' }}>
                <IconCardView
                  status={status}
                  progress={progress}
                  {...baseProps}
                />
              </div>
            </React.Fragment>
          );
        } else {
          return (
            <IconCardView status={status} progress={progress} {...baseProps} />
          );
        }
      case 'processing':
        if (cardPreview) {
          return (
            <React.Fragment>
              <div style={{ display: !didImageRender ? 'none' : 'inline' }}>
                {mediaType === 'video' ? (
                  <VideoCardView
                    {...baseProps}
                    status={status}
                    cardPreview={cardPreview}
                    alt={alt}
                    resizeMode={resizeMode}
                    onDisplayImage={onDisplayImage}
                    onImageLoad={handleOnImageLoad}
                    onImageError={handleOnImageError}
                    nativeLazyLoad={nativeLazyLoad}
                    forceSyncDisplay={forceSyncDisplay}
                    progress={progress}
                  />
                ) : (
                  <ImageCardView
                    {...baseProps}
                    status={status}
                    cardPreview={cardPreview}
                    alt={alt}
                    resizeMode={resizeMode}
                    onDisplayImage={onDisplayImage}
                    onImageLoad={handleOnImageLoad}
                    onImageError={handleOnImageError}
                    nativeLazyLoad={nativeLazyLoad}
                    forceSyncDisplay={forceSyncDisplay}
                    progress={progress}
                  />
                )}
              </div>
              <div style={{ display: didImageRender ? 'none' : 'inline' }}>
                <ProcessingCardView
                  disableAnimation={disableAnimation}
                  {...baseProps}
                />
              </div>
            </React.Fragment>
          );
        } else {
          return (
            <ProcessingCardView
              disableAnimation={disableAnimation}
              {...baseProps}
            />
          );
        }
      case 'complete':
        if (cardPreview) {
          return (
            <React.Fragment>
              <div style={{ display: !didImageRender ? 'none' : 'inline' }}>
                {mediaType === 'video' ? (
                  <VideoCardView
                    {...baseProps}
                    status={status}
                    cardPreview={cardPreview}
                    alt={alt}
                    resizeMode={resizeMode}
                    onDisplayImage={onDisplayImage}
                    onImageLoad={handleOnImageLoad}
                    onImageError={handleOnImageError}
                    nativeLazyLoad={nativeLazyLoad}
                    forceSyncDisplay={forceSyncDisplay}
                  />
                ) : (
                  <ImageCardView
                    {...baseProps}
                    status={status}
                    cardPreview={cardPreview}
                    alt={alt}
                    resizeMode={resizeMode}
                    onDisplayImage={onDisplayImage}
                    onImageLoad={handleOnImageLoad}
                    onImageError={handleOnImageError}
                    nativeLazyLoad={nativeLazyLoad}
                    forceSyncDisplay={forceSyncDisplay}
                  />
                )}
              </div>
              <div style={{ display: didImageRender ? 'none' : 'inline' }}>
                <IconCardView status={status} {...baseProps} />
              </div>
            </React.Fragment>
          );
        } else {
          return <IconCardView status={status} {...baseProps} />;
        }
      case 'error':
      case 'failed-processing':
        return (
          <ErrorCardView
            disableAnimation={disableAnimation}
            error={error}
            {...baseProps}
          />
        );
      case 'loading-preview':
      case 'loading':
      default:
        if (cardPreview) {
          return (
            <React.Fragment>
              <div style={{ display: !didImageRender ? 'none' : 'inline' }}>
                <ImageCardView
                  {...baseProps}
                  status={status}
                  cardPreview={cardPreview}
                  alt={alt}
                  resizeMode={resizeMode}
                  onDisplayImage={onDisplayImage}
                  onImageLoad={handleOnImageLoad}
                  onImageError={handleOnImageError}
                  nativeLazyLoad={nativeLazyLoad}
                  forceSyncDisplay={forceSyncDisplay}
                  progress={progress}
                />
              </div>
              <div style={{ display: didImageRender ? 'none' : 'inline' }}>
                <LoadingCardView
                  {...baseProps}
                  disableAnimation={disableAnimation}
                />
              </div>
            </React.Fragment>
          );
        } else {
          return (
            <LoadingCardView
              {...baseProps}
              disableAnimation={disableAnimation}
            />
          );
        }
    }
  };

  return getRenderConfigByStatus();
};

export const CardViews = withAnalyticsEvents({
  onClick: createAndFireMediaCardEvent({
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'mediaCard',
    attributes: {},
  }),
})(CardViewsBase);
