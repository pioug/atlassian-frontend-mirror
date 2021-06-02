import React from 'react';
import { Component } from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import Button from '@atlaskit/button/custom-theme-button';
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
import {
  Container,
  SliderContainer,
  FileInput,
  ImageUploader,
  DragZone,
  DragZoneImage,
  DragZoneText,
  SelectionBlocker,
  PaddedBreak,
  ImageBg,
} from './styled';
import { uploadPlaceholder, errorIcon } from './images';
import { fileSizeMb } from '../util';
import { ERROR, MAX_SIZE_MB, ACCEPT } from '../avatar-picker-dialog';
import { Viewport, renderViewport } from '../viewport';
import { Slider } from './slider';
import {
  CONTAINER_SIZE,
  CONTAINER_PADDING,
} from '../avatar-picker-dialog/layout-const';

export interface LoadParameters {
  export: () => string;
}
export type OnLoadHandler = (params: LoadParameters) => void;

export const viewport = new Viewport(
  CONTAINER_SIZE,
  CONTAINER_SIZE,
  CONTAINER_PADDING,
);

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

export class ImageNavigator extends Component<
  Props & InjectedIntlProps,
  State
> {
  state: State = defaultState;
  imageElement?: HTMLImageElement;

  UNSAFE_componentWillMount() {
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
    if (isRotated(this.state.imageOrientation)) {
      [width, height] = [height, width];
    }

    const defaultZoomedOutScale = 0;
    const { imageFile, viewport } = this.state;
    viewport
      .setItemSize(width, height)
      .setScale(defaultZoomedOutScale)
      .setItem(image);
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

  exportCroppedImage = () => {
    const { imageElement } = this;
    if (imageElement) {
      const canvas = renderViewport(this.state.viewport, imageElement);
      if (canvas) {
        return canvas.toDataURL();
      }
    }
    return '';
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
          Math.round(
            Math.min(visibleSourceRect.width, visibleSourceRect.height),
          ),
        );
    }
  }

  validateFile(imageFile: File): string | null {
    const {
      intl: { formatMessage },
    } = this.props;

    if (ACCEPT.indexOf(imageFile.type) === -1) {
      return formatMessage(ERROR.FORMAT);
    } else if (fileSizeMb(imageFile) > MAX_SIZE_MB) {
      return formatMessage(ERROR.SIZE, {
        MAX_SIZE_MB,
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
    const input = e.currentTarget.querySelector(
      '#image-input',
    ) as HTMLInputElement;

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
    let dragZoneText =
      errorMessage || formatMessage(messages.drag_and_drop_images_here);
    const dragZoneAlt = errorMessage || formatMessage(messages.upload_image);

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
          <Spinner size="medium" />
        ) : (
          <div>
            <DragZoneImage src={dropZoneImageSrc} alt={dragZoneAlt} />
            <DragZoneText isFullSize={!!errorMessage}>
              <Ellipsify text={dragZoneText} lines={3} />
            </DragZoneText>
          </div>
        )}
      </DragZone>
    );
  };

  renderImageUploader() {
    const { errorMessage, isLoading } = this.props;

    return (
      <ImageUploader>
        {this.renderDragZone()}
        {isLoading ? null : (
          <div>
            <PaddedBreak>
              <FormattedMessage
                {...(errorMessage ? messages.try_again : messages.or)}
              />
            </PaddedBreak>
            <Button onClick={this.onUploadButtonClick} isDisabled={isLoading}>
              <FormattedMessage {...messages.upload_photo} />
              <FileInput
                type="file"
                id="image-input"
                onChange={this.onFileChange}
                accept={ACCEPT.join(',')}
              />
            </Button>
          </div>
        )}
      </ImageUploader>
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
        <ImageBg />
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
        <SliderContainer>
          <Slider value={scale} onChange={this.onScaleChange} />
        </SliderContainer>
        {isDragging ? <SelectionBlocker /> : null}
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
      dataURI && !isLoading
        ? this.renderImageCropper(dataURI)
        : this.renderImageUploader();

    return <Container>{content}</Container>;
  }
}

export default injectIntl(ImageNavigator);
