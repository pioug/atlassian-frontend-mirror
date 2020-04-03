import {
  Rectangle,
  Bounds,
  loadImage,
  getOrientation,
  FileInfo,
} from '@atlaskit/media-ui';
import { getCanvas } from '../util';

export function radians(deg: number) {
  return deg * (Math.PI / 180);
}

export interface ViewInfo {
  containerRect: Rectangle;
  imageBounds: Bounds;
  sourceBounds: Bounds;
  visibleBounds: Bounds;
}

export function applyOrientation(
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  orientation: number,
  sourceWidth: number,
  sourceHeight: number,
  destWidth: number,
  destHeight: number,
): string {
  const { canvas, context } = getCanvas(canvasWidth, canvasHeight);

  if (context) {
    switch (orientation) {
      case 2:
        context.translate(destWidth, 0);
        context.scale(-1, 1);
        break;
      case 3:
        context.translate(destWidth, destHeight);
        context.scale(-1, -1);
        break;
      case 4:
        context.translate(0, destHeight);
        context.scale(1, -1);
        break;
      case 5:
        context.translate(destHeight, 0);
        context.rotate(radians(90));
        context.translate(0, destHeight);
        context.scale(1, -1);
        break;
      case 6:
        context.translate(destHeight, 0);
        context.rotate(radians(90));
        break;
      case 7:
        context.translate(destHeight, 0);
        context.rotate(radians(90));
        context.translate(destWidth, 0);
        context.scale(-1, 1);
        break;
      case 8:
        context.translate(destHeight, 0);
        context.rotate(radians(90));
        context.translate(destWidth, destHeight);
        context.scale(-1, -1);
        break;
    }

    context.drawImage(
      img,
      0,
      0,
      sourceWidth,
      sourceHeight,
      0,
      0,
      destWidth,
      destHeight,
    );
  }

  return canvas.toDataURL();
}

export interface PreviewInfo {
  fileInfo: FileInfo;
  width: number;
  height: number;
}

/* pre-process the incoming image for optimisations
     - resample image to min size required to fit zoomed view
     - apply exif orientation (rotate image if needed) so that coords don't need transforming when zooming, panning, or getting image
     - return size info about image (in case of rotation)
 */
export async function initialiseImagePreview(
  fileInfo: FileInfo,
  containerRect: Rectangle,
  maxZoom: number,
): Promise<PreviewInfo | null> {
  let orientation: number = 1;
  let img: HTMLImageElement;

  try {
    const result = await Promise.all([
      getOrientation(fileInfo.file),
      loadImage(fileInfo.src),
    ]);
    orientation = result[0];
    img = result[1];
  } catch (e) {
    return null;
  }

  if (img) {
    const { naturalWidth, naturalHeight } = img;
    const srcRect = new Rectangle(naturalWidth, naturalHeight);
    const maxRect = new Rectangle(
      containerRect.width * maxZoom,
      containerRect.height * maxZoom,
    );
    const scaleFactor = srcRect.scaleToFitLargestSide(maxRect);
    const scaledRect = scaleFactor < 1 ? srcRect.scaled(scaleFactor) : srcRect;
    const { width: imageWidth, height: imageHeight } = scaledRect;

    let canvasRect = scaledRect.clone();

    if (orientation >= 5) {
      /* any of the Exif orientation values >= 5 require flipping the rect.
        any of the lower values are just mirrored/rotated within the same rect */
      canvasRect = canvasRect.flipped();
    }

    const { width: canvasWidth, height: canvasHeight } = canvasRect;

    fileInfo.src = applyOrientation(
      img,
      canvasWidth,
      canvasHeight,
      orientation,
      naturalWidth,
      naturalHeight,
      imageWidth,
      imageHeight,
    );

    return { fileInfo, width: canvasWidth, height: canvasHeight };
  }

  return null;
}

export function renderImageAtCurrentView(
  imageElement: HTMLImageElement | undefined,
  viewInfo: ViewInfo,
  useConstraints: boolean,
  useCircularClipWithActions: boolean,
  backgroundColor: string,
): HTMLCanvasElement {
  const { containerRect, imageBounds, sourceBounds, visibleBounds } = viewInfo;
  const { width: containerWidth, height: containerHeight } = containerRect;
  const { canvas, context } = getCanvas(containerWidth, containerHeight);

  if (context) {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, containerWidth, containerHeight);

    if (imageElement) {
      if (useCircularClipWithActions) {
        const cx = containerWidth * 0.5;
        const cy = containerHeight * 0.5;
        const rx = cx;
        const ry = cy;

        context.save();
        context.beginPath();
        context.translate(cx - rx, cy - ry);
        context.scale(rx, ry);
        context.arc(1, 1, 1, 0, 2 * Math.PI, false);
        context.restore();
        context.fill();
        context.clip();
      }

      if (useConstraints) {
        /* draw sourceRect mapped to container size */
        context.drawImage(
          imageElement,
          sourceBounds.left,
          sourceBounds.top,
          sourceBounds.width,
          sourceBounds.height,
          0,
          0,
          containerWidth,
          containerHeight,
        );
      } else {
        /* draw imageBounds as is inside container size */
        const { naturalWidth, naturalHeight } = imageElement;
        const { left, top, width, height } = imageBounds.relativeTo(
          visibleBounds,
        );

        context.drawImage(
          imageElement,
          0,
          0,
          naturalWidth,
          naturalHeight,
          left,
          top,
          width,
          height,
        );
      }
    }
  }

  return canvas;
}
