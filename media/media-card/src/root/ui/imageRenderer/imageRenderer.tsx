import React from 'react';
import {
  MediaType,
  ImageResizeMode,
  MediaItemType,
} from '@atlaskit/media-client';
import { MediaImage } from '@atlaskit/media-ui';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  fireMediaCardEvent,
  RenderEventAction,
  getRenderSucceededEventPayload,
  getRenderFailedFileUriPayload,
  getRenderFailedExternalUriPayload,
} from '../../../utils/analytics';
import {
  withFileAttributes,
  WithFileAttributesProps,
} from '../../../utils/fileAttributesContext';

export type ImageRendererProps = {
  readonly dataURI: string;
  readonly mediaType: MediaType;
  readonly mediaItemType: MediaItemType;
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
  ImageRendererProps & WithAnalyticsEventsProps & WithFileAttributesProps
> {
  private lastAnalyticsAction?: RenderEventAction;

  componentDidMount() {
    // TODO: trigger accordingly with the succeeded event. This could be a breaking change
    const { onDisplayImage, mediaType } = this.props;
    if (mediaType === 'image' && onDisplayImage) {
      onDisplayImage();
    }
  }

  onImageLoad = () => {
    const { createAnalyticsEvent, fileAttributes } = this.props;
    if (fileAttributes && this.shouldFireEvent(RenderEventAction.SUCCEEDED)) {
      fireMediaCardEvent(
        getRenderSucceededEventPayload(fileAttributes),
        createAnalyticsEvent,
      );
    }
  };

  onImageError = () => {
    const { onImageError, fileAttributes } = this.props;
    onImageError && onImageError();

    if (fileAttributes && this.shouldFireEvent(RenderEventAction.FAILED)) {
      const { createAnalyticsEvent, mediaItemType } = this.props;
      if (mediaItemType === 'file') {
        fireMediaCardEvent(
          getRenderFailedFileUriPayload(fileAttributes),
          createAnalyticsEvent,
        );
      } else if (mediaItemType === 'external-image') {
        fireMediaCardEvent(
          getRenderFailedExternalUriPayload(fileAttributes),
          createAnalyticsEvent,
        );
      }
    }
  };

  // TODO: this check should be based on Component props, not in event actions
  shouldFireEvent = (action: RenderEventAction) =>
    !this.lastAnalyticsAction || this.lastAnalyticsAction !== action;

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

export const ImageRenderer = withAnalyticsEvents()(
  withFileAttributes(ImageRendererBase),
);
