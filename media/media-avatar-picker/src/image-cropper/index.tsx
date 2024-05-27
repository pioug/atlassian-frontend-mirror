/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { Component } from 'react';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';
import { messages, MediaImage } from '@atlaskit/media-ui';
import { isImageRemote } from './isImageRemote';
import { CONTAINER_PADDING } from './styles';
import { token } from '@atlaskit/tokens';
import { N50A } from '@atlaskit/theme/colors';
import { css } from '@emotion/react';
import { Box, xcss } from '@atlaskit/primitives';
import { ERROR } from '../avatar-picker-dialog';
import { CONTAINER_INNER_SIZE } from '../avatar-picker-dialog/layout-const';

const removeImageButtonStyles = css({
  borderRadius: token('border.radius.050', '3px'),
  backgroundColor: 'transparent',
  width: '24px',
  height: '24px',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  svg: {
    position: 'absolute',
    top: token('space.050', '4px'),
    left: token('space.050', '4px'),
  },
  '&:hover': {
    backgroundColor: token('color.background.neutral.hovered', N50A),
  },
});

const removeImageContainerStyles = xcss({
  position: 'absolute',
  right: 'space.050',
  top: 'space.050',
});

const dragOverlayStyles = xcss({
  position: 'absolute',
  width: '100%',
  height: '100%',
  cursor: 'move',
});

const maskShadow = {
  boxShadow: `0 0 0 100px ${token(
    'elevation.surface.overlay',
    'rgba(255, 255, 255)',
  )}`,
};

const maskStyles = xcss({
  position: 'absolute',
  top: `${CONTAINER_PADDING}px`,
  bottom: `${CONTAINER_PADDING}px`,
  left: `${CONTAINER_PADDING}px`,
  right: `${CONTAINER_PADDING}px`,
  opacity: 'opacity.disabled',
});

const rectMaskStyles = xcss({
  borderRadius: 'border.radius.100',
});

const circularMaskStyles = xcss({
  borderRadius: 'border.radius.circle',
});

const containerStyles = xcss({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 'border.radius.100',
});

const imageContainerStyles = xcss({
  position: 'absolute',
  userSelect: 'none',
  borderRadius: 'border.radius.100',
});

export interface ImageCropperProp {
  imageSource: string;
  containerSize?: number;
  isCircularMask?: boolean;
  top: number;
  left: number;
  imageWidth?: number;
  imageHeight?: number;
  imageOrientation: number;
  onDragStarted?: (x: number, y: number) => void;
  onImageLoaded: (image: HTMLImageElement) => void;
  onRemoveImage: () => void;
  onImageError: (errorMessage: string) => void;
}

export class ImageCropper extends Component<
  ImageCropperProp & WrappedComponentProps,
  {}
> {
  static defaultProps = {
    containerSize: CONTAINER_INNER_SIZE,
    isCircleMask: false,
    onDragStarted: () => {},
    onImageSize: () => {},
  };

  componentDidMount() {
    const {
      imageSource,
      onImageError,
      intl: { formatMessage },
    } = this.props;
    try {
      isImageRemote(imageSource);
    } catch (e) {
      onImageError(formatMessage(ERROR.URL));
    }
  }

  onDragStarted = (e: React.MouseEvent<{}>) => {
    if (this.props.onDragStarted) {
      this.props.onDragStarted(e.screenX, e.screenY);
    }
  };

  onImageError = () => {
    const {
      onImageError,
      intl: { formatMessage },
    } = this.props;
    onImageError(formatMessage(ERROR.FORMAT));
  };

  render() {
    const {
      isCircularMask,
      containerSize,
      top,
      left,
      imageWidth,
      imageHeight,
      imageSource,
      onRemoveImage,
      onImageLoaded,
      intl: { formatMessage },
    } = this.props;
    const containerDimensions = xcss({
      width: `${containerSize}px`,
      height: `${containerSize}px`,
    });
    const width = imageWidth ? `${imageWidth}px` : 'auto';
    const height = imageHeight ? `${imageHeight}px` : 'auto';

    const imageContainerDynamicStyles = xcss({
      width,
      height,
      display: width === 'auto' ? 'none' : 'block',
      top: `${top}px`,
      left: `${left}px`,
    });

    let crossOrigin: '' | 'anonymous' | 'use-credentials' | undefined;
    try {
      crossOrigin = isImageRemote(imageSource) ? 'anonymous' : undefined;
    } catch (e) {
      return null;
    }

    return (
      <Box id="container" xcss={[containerStyles, containerDimensions]}>
        <Box
          id="image-container"
          xcss={[imageContainerStyles, imageContainerDynamicStyles]}
        >
          <MediaImage
            crossOrigin={crossOrigin}
            dataURI={imageSource}
            crop={false}
            stretch={true}
            previewOrientation="from-image"
            onImageLoad={onImageLoaded}
            onImageError={this.onImageError}
          />
        </Box>
        {isCircularMask ? (
          <Box xcss={[maskStyles, circularMaskStyles]} style={maskShadow} />
        ) : (
          <Box xcss={[maskStyles, rectMaskStyles]} style={maskShadow} />
        )}
        <Box
          id="drag-overlay"
          xcss={dragOverlayStyles}
          onMouseDown={this.onDragStarted}
        />
        <Box id="remove-image-container" xcss={removeImageContainerStyles}>
          <button
            id="remove-image-button"
            css={removeImageButtonStyles}
            onClick={onRemoveImage}
          >
            <CrossIcon
              size="small"
              label={formatMessage(messages.remove_image)}
            />
          </button>
        </Box>
      </Box>
    );
  }
}

export default injectIntl(ImageCropper) as React.FC<ImageCropperProp>;
