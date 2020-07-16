import React from 'react';
import { MediaType, ImageResizeMode } from '@atlaskit/media-client';
import { MediaImage } from '@atlaskit/media-ui';
import {
  createAndFireCustomMediaEvent,
  AnalyticsLoadingAction,
  getLoadingStatusAnalyticsPayload,
} from '../../../utils/analytics';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

export type ImageRendererProps = {
  readonly dataURI: string;
  readonly mediaType: MediaType;
  readonly previewOrientation?: number;
  readonly alt?: string;
  readonly resizeMode?: ImageResizeMode;
  readonly onDisplayImage?: () => void;
  readonly onImageError?: () => void;
};

export const resizeModeToMediaImageProps = (resizeMode?: ImageResizeMode) => ({
  crop: resizeMode === 'crop',
  stretch: resizeMode === 'stretchy-fit',
});

export class ImageRendererBase extends React.Component<
  ImageRendererProps & WithAnalyticsEventsProps
> {
  private lastAnalyticsAction?: AnalyticsLoadingAction;

  componentDidMount() {
    // TODO: trigger accordingly with the succeeded event. This could be a breaking change
    const { onDisplayImage, mediaType } = this.props;
    if (mediaType === 'image' && onDisplayImage) {
      onDisplayImage();
    }
  }

  onImageLoad = () => {
    this.fireLoadingStatusAnalyticsEvent('succeeded');
  };

  onImageError = () => {
    this.fireLoadingStatusAnalyticsEvent('failed');
    const { onImageError } = this.props;
    onImageError && onImageError();
  };

  shouldFireLoadingStatusAnalyticsEvent = (action: AnalyticsLoadingAction) =>
    !this.lastAnalyticsAction || this.lastAnalyticsAction !== action;

  fireLoadingStatusAnalyticsEvent = (action: AnalyticsLoadingAction) => {
    const { createAnalyticsEvent } = this.props;

    if (this.shouldFireLoadingStatusAnalyticsEvent(action)) {
      this.lastAnalyticsAction = action;

      if (action === 'failed') {
        createAndFireCustomMediaEvent(
          getLoadingStatusAnalyticsPayload({
            action,
            error: 'unknown error',
            failReason: 'file-uri-error',
          }),
          createAnalyticsEvent,
        );
      } else {
        createAndFireCustomMediaEvent(
          getLoadingStatusAnalyticsPayload({ action }),
          createAnalyticsEvent,
        );
      }
    }
  };

  render() {
    const { dataURI, previewOrientation, alt, resizeMode } = this.props;

    return (
      <MediaImage
        dataURI={dataURI}
        alt={alt}
        previewOrientation={previewOrientation}
        onImageLoad={this.onImageLoad}
        onImageError={this.onImageError}
        {...resizeModeToMediaImageProps(resizeMode)}
      />
    );
  }
}

export const ImageRenderer = withAnalyticsEvents()(ImageRendererBase);
