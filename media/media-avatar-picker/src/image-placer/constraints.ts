import { Rectangle, Bounds, Vector2 } from '@atlaskit/media-ui';

export function zoomToFit(
  imageWidth: number,
  imageHeight: number,
  visibleBounds: Bounds,
): Rectangle {
  const itemRect = new Rectangle(imageWidth, imageHeight);
  const scaleFactor = itemRect.scaleToFitSmallestSide(visibleBounds);
  return itemRect.scaled(scaleFactor);
}

export function applyConstraints(
  useConstraints: boolean,
  imageBounds: Bounds,
  visibleBounds: Bounds,
) {
  if (useConstraints) {
    /* stop imageBounds edges from going inside visibleBounds - this is when useConstraints is true */
    return applyFullConstraints(imageBounds, visibleBounds);
  } else {
    /* stop imageBounds edges from going outside visibleBounds - this is when useConstraints is false */
    return applyPartialConstraints(imageBounds, visibleBounds);
  }
}

export function applyFullConstraints(
  imageBounds: Bounds,
  visibleBounds: Bounds,
): Vector2 {
  const deltaLeft = visibleBounds.left - imageBounds.left;
  const deltaTop = visibleBounds.top - imageBounds.top;
  const deltaBottom = visibleBounds.bottom - imageBounds.bottom;
  const deltaRight = visibleBounds.right - imageBounds.right;

  let deltaX = 0;
  let deltaY = 0;

  if (
    imageBounds.right > visibleBounds.right &&
    imageBounds.left > visibleBounds.left
  ) {
    deltaX += deltaLeft;
  }
  if (
    imageBounds.bottom > visibleBounds.bottom &&
    imageBounds.top > visibleBounds.top
  ) {
    deltaY += deltaTop;
  }
  if (
    imageBounds.top < visibleBounds.top &&
    imageBounds.bottom < visibleBounds.bottom
  ) {
    deltaY += deltaBottom;
  }
  if (
    imageBounds.left < visibleBounds.left &&
    imageBounds.right < visibleBounds.right
  ) {
    deltaX += deltaRight;
  }

  return new Vector2(deltaX, deltaY);
}

export function applyPartialConstraints(
  imageBounds: Bounds,
  visibleBounds: Bounds,
): Vector2 {
  const deltaTop = visibleBounds.top - imageBounds.bottom;
  const deltaBottom = visibleBounds.bottom - imageBounds.top;
  const deltaLeft = visibleBounds.left - imageBounds.right;
  const deltaRight = visibleBounds.right - imageBounds.left;

  let deltaX = 0;
  let deltaY = 0;

  if (imageBounds.right < visibleBounds.left) {
    deltaX += deltaLeft;
  }
  if (imageBounds.bottom < visibleBounds.top) {
    deltaY += deltaTop;
  }
  if (imageBounds.top > visibleBounds.bottom) {
    deltaY += deltaBottom;
  }
  if (imageBounds.left > visibleBounds.right) {
    deltaX += deltaRight;
  }

  return new Vector2(deltaX, deltaY);
}

export function transformVisibleBoundsToImageCoords(
  visibleBoundsX: number,
  visibleBoundsY: number,
  imageSourceRect: Rectangle,
  imageBounds: Bounds,
  visibleBounds: Bounds,
): Vector2 {
  const offset = visibleBounds.origin.sub(imageBounds.origin);
  const rect = imageBounds.rect;
  const x = (offset.x + visibleBoundsX) / rect.width;
  const y = (offset.y + visibleBoundsY) / rect.height;
  return new Vector2(
    imageSourceRect.width * x,
    imageSourceRect.height * y,
  ).rounded();
}
