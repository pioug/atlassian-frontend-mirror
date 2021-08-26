import React from 'react';
import { CSSProperties } from 'react';
import {
  Camera,
  getCssFromImageOrientation,
  hideControlsClassName,
  Rectangle,
  Vector2,
} from '@atlaskit/media-ui';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common';
import { MAX_RESOLUTION } from '@atlaskit/media-client/constants';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import HDIcon from '@atlaskit/icon/glyph/vid-hd-circle';
import Spinner from '@atlaskit/spinner';
import { B75, B200, DN400, DN60, N0 } from '@atlaskit/theme/colors';
import {
  BaselineExtend,
  HDIconGroupWrapper,
  HDIconWrapper,
  ImageWrapper,
  Img,
} from '../../styled';
import { ZoomLevel } from '../../domain/zoomLevel';
import { closeOnDirectClick } from '../../utils/closeOnDirectClick';
import { ZoomControls } from '../../zoomControls';
import { createClosedEvent } from '../../analytics/events/ui/closed';

export function zoomLevelAfterResize(
  newCamera: Camera,
  oldCamera: Camera,
  oldZoomLevel: ZoomLevel,
) {
  const isImgScaledToFit = oldZoomLevel.value === oldCamera.scaleDownToFit;
  const zoomLevelToRefit = new ZoomLevel(newCamera.scaleDownToFit);
  return isImgScaledToFit ? zoomLevelToRefit : oldZoomLevel;
}

const clientRectangle = (el: HTMLElement): Rectangle => {
  const { clientWidth, clientHeight } = el;
  return new Rectangle(clientWidth, clientHeight);
};

const naturalSizeRectangle = (el: HTMLImageElement): Rectangle => {
  const { naturalWidth, naturalHeight } = el;
  return new Rectangle(naturalWidth, naturalHeight);
};

export interface Props extends WithAnalyticsEventsProps {
  src: string;
  originalBinaryImageSrc?: string;
  orientation?: number;
  onClose?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onBlanketClicked?: () => void;
}

export type State = {
  zoomLevel: ZoomLevel;
  isHDActive: boolean;
  isHDAvailable: boolean;
  isHDActivating: boolean;
  camera?: Camera;
  isDragging: boolean;
  cursorPos: Vector2;
  hasBeenLoadedOnce: boolean;
};

const initialState: State = {
  zoomLevel: new ZoomLevel(1),
  isHDActive: false,
  isHDActivating: false,
  isHDAvailable: false,
  isDragging: false,
  cursorPos: new Vector2(0, 0),
  hasBeenLoadedOnce: false,
};

export class InteractiveImgComponent extends React.Component<Props, State> {
  state: State = initialState;
  private wrapper?: HTMLDivElement;
  private saveWrapperRef = (ref: HTMLDivElement) => (this.wrapper = ref);

  componentDidMount() {
    this.state = initialState;
    window.addEventListener('resize', this.onResize);
    document.addEventListener('mousemove', this.panImage);
    document.addEventListener('mouseup', this.stopDragging);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('mousemove', this.panImage);
    document.removeEventListener('mouseup', this.stopDragging);
  }

  onImageClicked = (e: React.MouseEvent) => {
    const { onClose, onBlanketClicked } = this.props;
    if (e.target === e.currentTarget && onBlanketClicked) {
      onBlanketClicked();
    }
    closeOnDirectClick(onClose)(e);
  };

  private renderHDIndicator() {
    const { isHDActivating, isHDAvailable, isHDActive } = this.state;
    if (!isHDAvailable) {
      return null;
    }

    const hdPrimaryColor = isHDActivating ? B75 : isHDActive ? B200 : DN400;
    const hdSecondaryColor = isHDActive && !isHDActivating ? N0 : DN60;
    const testId = isHDActivating
      ? 'hd-activating'
      : isHDActive
      ? 'hd-active'
      : 'hd-inactive';
    return (
      <HDIconGroupWrapper className={hideControlsClassName}>
        {isHDActivating ? <Spinner appearance="invert" /> : undefined}
        <HDIconWrapper>
          <HDIcon
            primaryColor={hdPrimaryColor}
            secondaryColor={hdSecondaryColor}
            label="hd"
            testId={testId}
          />
        </HDIconWrapper>
      </HDIconGroupWrapper>
    );
  }

  render() {
    const { src, originalBinaryImageSrc, orientation, onError } = this.props;
    const {
      zoomLevel,
      isHDAvailable,
      isHDActive,
      camera,
      isDragging,
    } = this.state;

    const canDrag = (camera && zoomLevel.value > camera.scaleToFit) || false;
    // We use style attr instead of SC prop for perf reasons
    // @ts-ignore
    const imgStyle: CSSProperties =
      (camera && camera.scaledImg(zoomLevel.value)) || {};
    if (orientation) {
      imgStyle.transform = getCssFromImageOrientation(orientation);
    }
    const srcToDisplay =
      isHDAvailable && isHDActive && originalBinaryImageSrc
        ? originalBinaryImageSrc
        : src;

    return (
      <ImageWrapper
        data-testid="media-viewer-image-content"
        onClick={this.onImageClicked}
        innerRef={this.saveWrapperRef}
      >
        <Img
          data-testid="media-viewer-image"
          canDrag={canDrag}
          isDragging={isDragging}
          src={srcToDisplay}
          style={imgStyle}
          onLoad={this.onImgLoad}
          onError={onError}
          onMouseDown={this.startDragging}
          shouldPixelate={zoomLevel.value > 1}
        />
        {/*
          The BaselineExtend element is required to align the Img element in the
          vertical center of the page. It ensures that the parent container is
          at least 100% of the viewport height and makes it possible to set
          vertical-align: middle on the image.
         */}
        <BaselineExtend />
        <ZoomControls zoomLevel={zoomLevel} onChange={this.onZoomChange} />
        {this.renderHDIndicator()}
      </ImageWrapper>
    );
  }

  private onImgLoad = (ev: React.SyntheticEvent<HTMLImageElement>) => {
    const { onLoad, originalBinaryImageSrc } = this.props;
    const {
      hasBeenLoadedOnce,
      zoomLevel: oldZoomLevel,
      camera: currentCamera,
    } = this.state;
    let { isHDActivating, isHDAvailable, isHDActive } = this.state;

    if (!this.wrapper) {
      return;
    }

    const viewport = clientRectangle(this.wrapper);
    const originalImgRect = naturalSizeRectangle(ev.currentTarget);
    const camera = new Camera(viewport, originalImgRect);
    let newZoomLevel: ZoomLevel;

    if (hasBeenLoadedOnce && currentCamera) {
      /* This is not first time image is loading. Likely due to new (HD) image is loaded.
       * In order to keep new image on the same perceived zoom level we need to scale.
       * It depends on ration between old and new images and current zoom level.
       * For example:
       * - old image is 2000px with zoom at 50% (0.5). New image is 4000px. 2000/4000 * 0.5 = 0.25 (25%)
       * - old image is 2000px with zoom at 200% (2). New image is 4000px. 2000/4000 * 2 = 1 (100%)
       */
      const previousImageWidth = currentCamera.originalImg.width;
      const newImageWidth = originalImgRect.width;
      newZoomLevel = new ZoomLevel(
        (previousImageWidth / newImageWidth) * oldZoomLevel.value,
      );
      isHDActivating = false;
    } else {
      newZoomLevel = new ZoomLevel(camera.scaleDownToFit);

      // If initial (non-HD) image is equal to MAX resolution -
      // this means most likely original image had higher res (because non-HD is downsized and caped off with MAX res)
      isHDAvailable =
        !!originalBinaryImageSrc &&
        (originalImgRect.width === MAX_RESOLUTION ||
          originalImgRect.height === MAX_RESOLUTION);

      // Automatically activate HD on first load if zoom level is already 100% or bigger
      isHDActive = newZoomLevel.value >= 1;

      if (onLoad) {
        // Call onLoad only once on initial image render
        onLoad();
      }
    }

    this.setState({
      camera,
      zoomLevel: newZoomLevel,
      hasBeenLoadedOnce: true,
      isHDActivating,
      isHDAvailable,
      isHDActive,
    });
  };

  private onResize = () => {
    const { camera } = this.state;

    if (!this.wrapper || !camera) {
      return;
    }
    const oldZoomLevel = this.state.zoomLevel;

    const newViewport = clientRectangle(this.wrapper);
    const newCamera = camera.resizedViewport(newViewport);
    const newZoomLevel = zoomLevelAfterResize(newCamera, camera, oldZoomLevel);

    this.setState({
      camera: newCamera,
      zoomLevel: newZoomLevel,
    });
  };

  private onZoomChange = (nextZoomLevel: ZoomLevel) => {
    const { camera } = this.state;
    const { wrapper } = this;
    if (!wrapper || !camera) {
      return;
    }

    const { scrollLeft, scrollTop } = wrapper;
    const prevOffset = new Vector2(scrollLeft, scrollTop);
    const {
      zoomLevel: prevZoomLevel,
      isHDActive: prevIsHDActive,
      isHDActivating: prevIsHDActivating,
    } = this.state;
    const isHDActive = prevIsHDActive || nextZoomLevel.value >= 1;
    const isHDActivating =
      prevIsHDActivating || (!prevIsHDActive && isHDActive);
    this.setState(
      {
        zoomLevel: nextZoomLevel,
        isHDActive,
        isHDActivating,
      },
      () => {
        const { x, y } = camera.scaledOffset(
          prevOffset,
          prevZoomLevel.value,
          nextZoomLevel.value,
        );
        wrapper.scrollLeft = x;
        wrapper.scrollTop = y;
      },
    );
  };

  private startDragging = (ev: React.MouseEvent<{}>) => {
    ev.preventDefault();
    this.setState({
      isDragging: true,
      cursorPos: new Vector2(ev.screenX, ev.screenY),
    });
  };

  private stopDragging = (ev: MouseEvent) => {
    ev.preventDefault();
    this.setState({ isDragging: false });
  };

  private panImage = (ev: MouseEvent) => {
    if (this.state.isDragging && this.wrapper) {
      const cursorPos = new Vector2(ev.screenX, ev.screenY);
      const delta = this.state.cursorPos.sub(cursorPos);
      this.setState({ cursorPos });
      this.wrapper.scrollLeft += delta.x;
      this.wrapper.scrollTop += delta.y;
    }
  };
}

export const InteractiveImg = withAnalyticsEvents({
  onBlanketClicked: (createAnalyticsEvent) => {
    const event = createAnalyticsEvent(createClosedEvent('blanket'));
    event.fire(ANALYTICS_MEDIA_CHANNEL);
  },
})(InteractiveImgComponent);
