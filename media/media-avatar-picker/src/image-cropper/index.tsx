import React from 'react';
import { Component } from 'react';
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';
import { messages, MediaImage } from '@atlaskit/media-ui';
import { isImageRemote } from './isImageRemote';
import { token } from '@atlaskit/tokens';
import { IconButton } from '@atlaskit/button/new';
import { Box } from '@atlaskit/primitives/compiled';
import { cx, cssMap } from '@atlaskit/css';
import { ERROR } from '../avatar-picker-dialog';
import { CONTAINER_INNER_SIZE } from '../avatar-picker-dialog/layout-const';

const CONTAINER_PADDING = 28;

const removeImageContainerStyles = cssMap({
	root: {
		position: 'absolute',
		right: token('space.050'),
		top: token('space.050'),
	},
});

const dragOverlayStyles = cssMap({
	root: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		cursor: 'move',
	},
});

const maskPositionStyle = cssMap({
	root: {
		position: 'absolute',
	},
});

const maskStyles = {
	top: `${CONTAINER_PADDING}px`,
	bottom: `${CONTAINER_PADDING}px`,
	left: `${CONTAINER_PADDING}px`,
	right: `${CONTAINER_PADDING}px`,
	opacity: token('opacity.disabled'),
	boxShadow: `0 0 0 100px ${token('elevation.surface.overlay', 'rgba(255, 255, 255)')}`,
};

const rectMaskStyles = cssMap({
	root: {
		borderRadius: token('border.radius.100'),
	},
});

const circularMaskStyles = cssMap({
	root: {
		borderRadius: token('border.radius.circle'),
	},
});

const containerStyles = cssMap({
	root: {
		position: 'relative',
		overflow: 'hidden',
		borderRadius: token('border.radius.100'),
	},
});

const imageContainerStyles = cssMap({
	root: {
		position: 'absolute',
		userSelect: 'none',
		borderRadius: token('border.radius.100'),
	},
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
		const width = imageWidth ? `${imageWidth}px` : 'auto';

		let crossOrigin: '' | 'anonymous' | 'use-credentials' | undefined;
		try {
			crossOrigin = isImageRemote(imageSource) ? 'anonymous' : undefined;
		} catch (e) {
			return null;
		}

		return (
			<Box
				testId="image-cropper"
				id="container"
				xcss={containerStyles.root}
				style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
			>
				<Box
					id="image-container"
					xcss={imageContainerStyles.root}
					style={{
						width: imageWidth ? `${imageWidth}px` : 'auto',
						height: imageHeight ? `${imageHeight}px` : 'auto',
						display: width === 'auto' ? 'none' : 'block',
						top: `${top}px`,
						left: `${left}px`,
					}}
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					<Box xcss={cx(circularMaskStyles.root, maskPositionStyle.root)} style={maskStyles} />
				) : (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					<Box xcss={cx(rectMaskStyles.root, maskPositionStyle.root)} style={maskStyles} />
				)}
				<Box id="drag-overlay" xcss={dragOverlayStyles.root} onMouseDown={this.onDragStarted} />
				<Box id="remove-image-container" xcss={removeImageContainerStyles.root}>
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
