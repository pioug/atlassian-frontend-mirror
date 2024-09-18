import React from 'react';
import { Component } from 'react';
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';
import { messages, MediaImage } from '@atlaskit/media-ui';
import { isImageRemote } from './isImageRemote';
import { CONTAINER_PADDING } from './styles';
import { token } from '@atlaskit/tokens';
import { IconButton } from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';
import { ERROR } from '../avatar-picker-dialog';
import { CONTAINER_INNER_SIZE } from '../avatar-picker-dialog/layout-const';

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
	boxShadow: `0 0 0 100px ${token('elevation.surface.overlay', 'rgba(255, 255, 255)')}`,
};

const maskStyles = xcss({
	position: 'absolute',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	top: `${CONTAINER_PADDING}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	bottom: `${CONTAINER_PADDING}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	left: `${CONTAINER_PADDING}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
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

export class ImageCropper extends Component<ImageCropperProp & WrappedComponentProps, {}> {
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
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			width: `${containerSize}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: `${containerSize}px`,
		});
		const width = imageWidth ? `${imageWidth}px` : 'auto';
		const height = imageHeight ? `${imageHeight}px` : 'auto';

		const imageContainerDynamicStyles = xcss({
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			width,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			display: width === 'auto' ? 'none' : 'block',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			top: `${top}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			left: `${left}px`,
		});

		let crossOrigin: '' | 'anonymous' | 'use-credentials' | undefined;
		try {
			crossOrigin = isImageRemote(imageSource) ? 'anonymous' : undefined;
		} catch (e) {
			return null;
		}

		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
			<Box testId="image-cropper" id="container" xcss={[containerStyles, containerDimensions]}>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage */}
				<Box id="image-container" xcss={[imageContainerStyles, imageContainerDynamicStyles]}>
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					<Box xcss={[maskStyles, circularMaskStyles]} style={maskShadow} />
				) : (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					<Box xcss={[maskStyles, rectMaskStyles]} style={maskShadow} />
				)}
				<Box id="drag-overlay" xcss={dragOverlayStyles} onMouseDown={this.onDragStarted} />
				<Box id="remove-image-container" xcss={removeImageContainerStyles}>
					<IconButton
						id="remove-image-button"
						icon={(iconProps) => (
							<CrossIcon {...iconProps} LEGACY_size="small" color="currentColor" />
						)}
						onClick={onRemoveImage}
						label={formatMessage(messages.remove_image)}
						spacing="compact"
						appearance="subtle"
					/>
				</Box>
			</Box>
		);
	}
}

export default injectIntl(ImageCropper) as React.FC<ImageCropperProp>;
