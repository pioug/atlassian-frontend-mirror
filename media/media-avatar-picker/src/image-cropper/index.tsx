import React from 'react';
import { Component } from 'react';
import CrossIcon from '@atlaskit/icon/core/migration/cross';
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
		'&:focus-visible': {
			outlineOffset: token('space.025'),
			outlineWidth: token('border.width.outline'),
			outlineColor: token('color.border.focused'),
			outlineStyle: 'solid',
		},
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

const offscreenStyles = {
	clip: 'rect(1px, 1px, 1px, 1px)',
	clipPath: 'inset(50%)',
	height: '1px',
	width: '1px',
	margin: '-1px',
	overflow: 'hidden',
	padding: 0,
};

const rectMaskStyles = cssMap({
	root: {
		borderRadius: token('radius.small'),
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
		borderRadius: token('radius.small'),
	},
});

const imageContainerStyles = cssMap({
	root: {
		position: 'absolute',
		userSelect: 'none',
		borderRadius: token('radius.small'),
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
	moveImage?: (key: string) => void;
}

export class ImageCropper extends Component<ImageCropperProp & WrappedComponentProps, {}> {
	static defaultProps = {
		containerSize: CONTAINER_INNER_SIZE,
		isCircleMask: false,
		onDragStarted: () => {},
		onImageSize: () => {},
	};
	state: { liveMsg: string } = { liveMsg: '' };

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

	onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const {
			intl: { formatMessage },
		} = this.props;
		let msg = '';
		switch (e.key) {
			case 'ArrowLeft':
				msg = formatMessage(messages.image_cropper_image_moved, { key: 'left' });
				break;
			case 'ArrowRight':
				msg = formatMessage(messages.image_cropper_image_moved, { key: 'right' });
				break;
			case 'ArrowUp':
				msg = formatMessage(messages.image_cropper_image_moved, { key: 'top' });
				break;
			case 'ArrowDown':
				msg = formatMessage(messages.image_cropper_image_moved, { key: 'bottom' });
				break;
			default:
				return;
		}
		this.props.moveImage && this.props.moveImage(e.key);
		this.setState({
			liveMsg: msg,
		});
	};

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
					<Box
						testId="image-cropper-mask"
						xcss={cx(circularMaskStyles.root, maskPositionStyle.root)}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={maskStyles}
						tabIndex={0}
						onKeyDown={this.onKeyDown}
						role="button"
						aria-label={formatMessage(messages.image_cropper_arrow_keys_label)}
					/>
				) : (
					<Box
						testId="image-cropper-mask"
						xcss={cx(rectMaskStyles.root, maskPositionStyle.root)}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={maskStyles}
						tabIndex={0}
						onKeyDown={this.onKeyDown}
						role="button"
						aria-label={formatMessage(messages.image_cropper_arrow_keys_label)}
					/>
				)}
				<Box id="drag-overlay" xcss={dragOverlayStyles.root} onMouseDown={this.onDragStarted} />

				<div
					id="image-cropper-image-movements-log"
					aria-live="assertive"
					role="log"
					aria-atomic="true"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ ...offscreenStyles, position: 'absolute' }}
				>
					{this.state.liveMsg}
				</div>

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
