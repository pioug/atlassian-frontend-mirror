import { Rectangle, type Camera } from '@atlaskit/media-ui';
import { ZoomLevel } from '../../domain/zoomLevel';

export const clientRectangle = (el: HTMLElement): Rectangle => {
  const { clientWidth, clientHeight } = el;
  return new Rectangle(clientWidth, clientHeight);
};

export const naturalSizeRectangle = (el: HTMLImageElement): Rectangle => {
  const { naturalWidth, naturalHeight } = el;
  return new Rectangle(naturalWidth, naturalHeight);
};

export function zoomLevelAfterResize(
  newCamera: Camera,
  oldCamera: Camera,
  oldZoomLevel: ZoomLevel,
) {
  const isImgScaledToFit = oldZoomLevel.value === oldCamera.scaleDownToFit;
  const zoomLevelToRefit = new ZoomLevel(newCamera.scaleDownToFit);
  return isImgScaledToFit ? zoomLevelToRefit : oldZoomLevel;
}
