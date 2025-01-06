/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N200 } from '@atlaskit/theme/colors';
import { Component } from 'react';
import { FormattedMessage, type WrappedComponentProps, injectIntl } from 'react-intl-next';
import Button from '@atlaskit/button/standard-button';
import ImageCropper from '../image-cropper';
import Spinner from '@atlaskit/spinner';
import {
	fileToDataURI,
	dataURItoFile,
	getOrientation,
	isRotated,
	Ellipsify,
	Vector2,
	messages,
} from '@atlaskit/media-ui';
import * as exenv from 'exenv';
import { uploadPlaceholder, errorIcon } from './images';
import { fileSizeMb } from '../util';
import { ERROR, MAX_SIZE_MB, ACCEPT } from '../avatar-picker-dialog';
import { Viewport } from '../viewport';
import { Slider } from './slider';
import { CONTAINER_SIZE, CONTAINER_PADDING } from '../avatar-picker-dialog/layout-const';
import { DragZone } from './dragZone';
import { exportCroppedImage } from './exportCroppedImage';

const checkeredBg =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjg8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjg8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZGM6c3ViamVjdD4KICAgICAgICAgICAgPHJkZjpTZXEvPgogICAgICAgICA8L2RjOnN1YmplY3Q+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE4OjA3OjE4IDEwOjA3OjUwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIDMuNy4zPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrsp//0AAAAKUlEQVQIHWP8//8/Aww8ffoUxmRggrPQGKRLsCCbKy0tDTeQdKNw6gAAbSMIvvnXfF4AAAAASUVORK5CYII=';
export const AVATAR_DIALOG_WIDTH = 375;

const containerStyles = css({
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'*, *::before, *::after': {
		boxSizing: 'border-box',
	},
	position: 'relative',
});

const sliderContainerStyles = css({
	alignItems: 'center',
	justifyContent: 'center',
	display: 'flex',
	flexDirection: 'row',
	marginTop: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	input: {
		boxSizing: 'content-box',
		padding: 0,
	},
	backgroundColor: token('elevation.surface.overlay', '#fff'),
});

const fileInputStyles = css({
	display: 'none',
});

const imageUploaderStyles = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	margin: `0 ${token('space.150', '10px')} ${token(
		'space.250',
		'20px',
	)} ${token('space.150', '10px')}`,
});

const dragZoneImageStyles = css({
	width: '100px',
});

const imageBgStyles = css({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '256px',
	height: '256px',
	borderRadius: token('border.radius', '3px'),
});

const dragZoneTextBaseStyles = css({
	textAlign: 'center',
	color: token('color.text.subtlest', N200),
});

const dragZoneTextStylesFullSize = css({
	width: `calc(${AVATAR_DIALOG_WIDTH} - ${token('space.100', '8px')} * 8)px`,
});

const dragZoneTextStylesNotFullSize = css({
	width: 'auto',
});

const selectionBlockerStyles = css({
	position: 'fixed',
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,
	backgroundColor: 'transparent',
	userSelect: 'none',
});

const paddedBreakStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	marginTop: `${token('space.100', '10px')} !important`,
	marginBottom: token('space.100', '10px'),
	textAlign: 'center',
});

export interface LoadParameters {
	export: (outputSize?: number) => string;
}
export type OnLoadHandler = (params: LoadParameters) => void;

export const viewport = new Viewport(CONTAINER_SIZE, CONTAINER_SIZE, CONTAINER_PADDING);

export interface CropProperties {
	x: number;
	y: number;
	size: number;
}

export interface Props {
	imageSource?: string;
	errorMessage?: string;
	onImageLoaded: (file: File) => void;
	onLoad?: OnLoadHandler;
	onCropChanged?: (x: number, y: number, size: number) => void;
	onRemoveImage: () => void;
	onImageUploaded: (file: File) => void;
	onImageError: (errorMessage: string) => void;
	isLoading?: boolean;
	maxImageSize?: number;
}

export interface State {
	imagePos: Vector2;
	dragStartPoint: Vector2;
	scale: number; // 0 - 100, which is what the underlying @atlaskit/range uses - state kept here, Slider is dumb component
	isDragging: boolean;
	fileImageSource?: string;
	imageFile?: File;
	isDroppingFile: boolean;
	imageOrientation: number;
	viewport: Viewport;
}

const defaultState = {
	imagePos: new Vector2(CONTAINER_PADDING, CONTAINER_PADDING),
	dragStartPoint: new Vector2(0, 0),
	scale: 0,
	isDragging: false,
	fileImageSource: undefined,
	isDroppingFile: false,
	imageOrientation: 1,
	viewport,
};

export class ImageNavigator extends Component<Props & WrappedComponentProps, State> {
	state: State = defaultState;
	imageElement?: HTMLImageElement;

	componentDidMount() {
		if (!exenv.canUseDOM) {
			return;
		}
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
	}

	componentWillUnmount() {
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
	}

	onDragStarted = (x: number, y: number) => {
		this.state.viewport.startDrag();
		this.setState({
			isDragging: true,
			dragStartPoint: new Vector2(x, y),
		});
	};

	onMouseMove = (e: MouseEvent) => {
		if (this.state.isDragging) {
			const { dragStartPoint, viewport } = this.state;
			const currentMousePoint = new Vector2(e.screenX, e.screenY);
			const dragDelta = currentMousePoint.sub(dragStartPoint);
			viewport.dragMove(dragDelta.x, dragDelta.y);
			this.setState({ viewport });
		}
	};

	onMouseUp = () => {
		this.setState({
			isDragging: false,
		});
		this.exportCrop();
	};

	/**
	 * When newScale change we want to zoom in/out relative to the center of the frame.
	 * @param newScale New scale in 0-100 format.
	 */
	onScaleChange = (scale: number) => {
		const { viewport } = this.state;
		viewport.setScale(scale);
		this.setState({ scale, viewport });
		this.exportCrop();
	};

	/**
	 * This gets called when the cropper loads an image
	 * at this point we will be able to get the height/width
	 * @param width the width of the image
	 * @param height the height of the image
	 */
	onImageLoaded = (image: HTMLImageElement) => {
		this.imageElement = image;
		let { naturalWidth: width, naturalHeight: height } = image;

		if (
			!CSS.supports('image-orientation', 'from-image') &&
			isRotated(this.state.imageOrientation)
		) {
			[width, height] = [height, width];
		}

		const defaultZoomedOutScale = 0;
		const { imageFile, viewport } = this.state;
		viewport.setItemSize(width, height).setScale(defaultZoomedOutScale).setItem(image);
		// imageFile will not exist if imageSource passed through props.
		// therefore we have to create a File, as one needs to be raised by dialog parent component when Save clicked.
		const file = imageFile || (this.dataURI && dataURItoFile(this.dataURI));
		if (file) {
			this.props.onImageLoaded(file);
		}
		this.setState({
			scale: defaultZoomedOutScale,
		});

		const { onLoad } = this.props;
		onLoad &&
			onLoad({
				export: this.exportCroppedImage,
			});
		this.exportCrop();
	};

	exportCroppedImage = (outputSize?: number) => {
		return exportCroppedImage(this.state.viewport, this.imageElement, outputSize);
	};

	exportCrop(): void {
		const { viewport } = this.state;
		if (!viewport.isEmpty) {
			const { onCropChanged } = this.props;
			const origin = viewport.visibleSourceBounds.origin;
			const visibleSourceRect = viewport.visibleSourceBounds.rect;
			onCropChanged &&
				onCropChanged(
					Math.round(origin.x),
					Math.round(origin.y),
					Math.round(Math.min(visibleSourceRect.width, visibleSourceRect.height)),
				);
		}
	}

	validateFile(imageFile: File): string | null {
		const {
			intl: { formatMessage },
			maxImageSize = MAX_SIZE_MB,
		} = this.props;

		if (ACCEPT.indexOf(imageFile.type) === -1) {
			return formatMessage(ERROR.FORMAT);
		} else if (fileSizeMb(imageFile) > maxImageSize) {
			return formatMessage(ERROR.SIZE, {
				MAX_SIZE_MB: maxImageSize,
			});
		}
		return null;
	}

	async readFile(imageFile: File) {
		const { onImageUploaded } = this.props;

		const [fileImageSource, imageOrientation] = await Promise.all([
			fileToDataURI(imageFile),
			getOrientation(imageFile),
		]);

		if (onImageUploaded) {
			onImageUploaded(imageFile);
		}

		this.state.viewport.orientation = imageOrientation;

		this.setState({
			fileImageSource: fileImageSource as string,
			imageFile,
			imageOrientation,
		});
	}

	// Trick to have a nice <input /> appearance
	onUploadButtonClick: React.MouseEventHandler = (e) => {
		const input = e.currentTarget.querySelector('#image-input') as HTMLInputElement;

		if (input) {
			input.click();
		}
	};

	onFileChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
		e.stopPropagation();
		if (e.currentTarget.files && e.currentTarget.files.length) {
			const file = e.currentTarget.files[0];
			const validationError = this.validateFile(file);

			if (validationError) {
				this.props.onImageError(validationError);
			} else {
				this.readFile(file);
			}
		}
	};

	updateDroppingState(e: React.DragEvent<{}>, state: boolean) {
		e.stopPropagation();
		e.preventDefault();
		this.setState({ isDroppingFile: state });
	}

	onDragEnter = (e: React.DragEvent<{}>) => {
		this.updateDroppingState(e, true);
	};

	onDragOver = (e: React.DragEvent<{}>) => {
		this.updateDroppingState(e, true);
	};

	onDragLeave = (e: React.DragEvent<{}>) => {
		this.updateDroppingState(e, false);
	};

	onDrop = (e: React.DragEvent<{}>) => {
		e.stopPropagation();
		e.preventDefault();
		const dt = e.dataTransfer;
		const file = dt.files[0];
		const validationError = this.validateFile(file);

		this.setState({ isDroppingFile: false });

		if (validationError) {
			this.props.onImageError(validationError);
		} else {
			this.readFile(file);
		}
	};

	renderDragZone = () => {
		const {
			intl: { formatMessage },
		} = this.props;
		const { isDroppingFile } = this.state;
		const { errorMessage, isLoading } = this.props;
		const showBorder = !isLoading && !!!errorMessage;
		const dropZoneImageSrc = errorMessage ? errorIcon : uploadPlaceholder;
		const dragZoneText = errorMessage || formatMessage(messages.drag_and_drop_images_here);

		return (
			<DragZone
				showBorder={showBorder}
				isDroppingFile={isDroppingFile}
				onDragLeave={this.onDragLeave}
				onDragEnter={this.onDragEnter}
				onDragOver={this.onDragOver}
				onDrop={this.onDrop}
			>
				{isLoading ? (
					<Spinner testId="spinner" size="medium" />
				) : (
					<React.Fragment>
						<img id="drag-zone-image" css={dragZoneImageStyles} src={dropZoneImageSrc} alt="" />
						{!!errorMessage ? (
							<div id="drag-zone-text" css={[dragZoneTextBaseStyles, dragZoneTextStylesFullSize]}>
								<Ellipsify text={dragZoneText} lines={3} />
							</div>
						) : (
							<div
								id="drag-zone-text"
								css={[dragZoneTextBaseStyles, dragZoneTextStylesNotFullSize]}
							>
								<Ellipsify text={dragZoneText} lines={3} />
							</div>
						)}
					</React.Fragment>
				)}
			</DragZone>
		);
	};

	renderImageUploader() {
		const { errorMessage, isLoading } = this.props;

		return (
			<div id="image-uploader" css={imageUploaderStyles}>
				{this.renderDragZone()}
				{isLoading ? null : (
					<div>
						{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
						<p id="padded-break" css={paddedBreakStyles}>
							<FormattedMessage {...(errorMessage ? messages.try_again : messages.or)} />
						</p>
						<Button
							onClick={this.onUploadButtonClick}
							isDisabled={isLoading}
							testId="upload-button"
						>
							<FormattedMessage {...messages.upload_photo} />
							<input
								data-testid="image-navigator-input-file"
								css={fileInputStyles}
								type="file"
								id="image-input"
								onChange={this.onFileChange}
								accept={ACCEPT.join(',')}
							/>
						</Button>
					</div>
				)}
			</div>
		);
	}

	onRemoveImage = () => {
		this.state.viewport.clear();
		this.setState(defaultState);
		this.props.onRemoveImage();
	};

	renderImageCropper(dataURI: string) {
		const { scale, isDragging, imageOrientation, viewport } = this.state;
		const { onImageError } = this.props;
		const { onDragStarted, onImageLoaded, onRemoveImage } = this;
		const { itemBounds } = viewport;

		return (
			<div>
				<div css={imageBgStyles} style={{ background: `url('${checkeredBg}')` }} />
				<ImageCropper
					imageSource={dataURI}
					imageOrientation={imageOrientation}
					containerSize={CONTAINER_SIZE}
					isCircularMask={false}
					top={itemBounds.top}
					left={itemBounds.left}
					imageWidth={itemBounds.width}
					imageHeight={itemBounds.height}
					onDragStarted={onDragStarted}
					onImageLoaded={onImageLoaded}
					onRemoveImage={onRemoveImage}
					onImageError={onImageError}
				/>
				<div css={sliderContainerStyles}>
					<Slider value={scale} onChange={this.onScaleChange} />
				</div>
				{isDragging ? <div data-testid="selection-blocker" css={selectionBlockerStyles} /> : null}
			</div>
		);
	}

	// We prioritize passed image rather than the one coming from the uploader
	private get dataURI(): string | undefined {
		const { imageSource, errorMessage } = this.props;
		const { fileImageSource } = this.state;

		return errorMessage ? undefined : imageSource || fileImageSource;
	}

	render() {
		const { isLoading } = this.props;
		const { dataURI } = this;
		const content =
			dataURI && !isLoading ? this.renderImageCropper(dataURI) : this.renderImageUploader();

		return <div css={containerStyles}>{content}</div>;
	}
}

export default injectIntl(ImageNavigator) as React.FC<Props>;
