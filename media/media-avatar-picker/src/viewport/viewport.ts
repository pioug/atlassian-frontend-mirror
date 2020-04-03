import { Rectangle, Bounds, Vector2 } from '@atlaskit/media-ui';

/**
 * maximum amount to allow scaling up from "100%"
 * - when the image is smaller than the view size, "100%" is the view size
 * - when the image is larger than the view size, "100%" is the images natural size
 */
export const MAX_SCALE = 1.5;
export const DEFAULT_WIDTH = 100;
export const DEFAULT_HEIGHT = 100;
export const DEFAULT_MARGIN = 10;
export const DEFAULT_INNER_WIDTH = DEFAULT_WIDTH - DEFAULT_MARGIN * 2;
export const DEFAULT_INNER_HEIGHT = DEFAULT_HEIGHT - DEFAULT_MARGIN * 2;

/**
 * This class abstracts viewing an item within a container.
 * This class is display agnostic, it only calculates the geometry.
 * The container can have a uniform margin which allows for transparent clipping of the view area.
 * This creates an inner bounds within the container, which is (container size - margin).
 * When given an item, the viewport will scale up the item bounds to fit the inner bounds.
 * The viewport can work with drag events, but will constrain the item bounds to never be smaller than the minimum container side length.
 * The viewport can work with zoom events, but will constrain the item bounds to never be smaller than the minimum container side length.
 * The viewport can map coordinates from the inner bounds, to the image local coordinates.
 *
 * use cases:
 *  - load image: this.setItemSize(w, h)
 *  - change scale: this.setScale(0 - 100);
 *  - pan image: this.startDrag().dragMove(deltaX, deltaY)
 *  - map view coord to image source: this.viewToLocalPoint(viewX, viewY)
 */

export class Viewport {
  private itemSourceRect: Rectangle = new Rectangle(0, 0);
  private dragStartPos: Vector2 = new Vector2(0, 0);
  itemBounds: Bounds = new Bounds(0, 0, 0, 0);
  orientation: number = 1;
  item?: any;

  constructor(
    readonly width: number = DEFAULT_WIDTH,
    readonly height: number = DEFAULT_HEIGHT,
    readonly margin: number = DEFAULT_MARGIN,
  ) {
    // it's assumed we won't have an item size yet as it is something that requires async loading.
    // when ready, call setItemSize(w, h) to "load/init" the item for the viewport
  }

  private zoomToFit() {
    this.itemBounds = this.fittedItemBounds;
    return this;
  }

  private applyConstraints() {
    const { innerBounds, itemBounds } = this;
    const deltaLeft = innerBounds.left - itemBounds.left;
    const deltaTop = innerBounds.top - itemBounds.top;
    const deltaBottom = innerBounds.bottom - itemBounds.bottom;
    const deltaRight = innerBounds.right - itemBounds.right;

    let x = itemBounds.left;
    let y = itemBounds.top;

    if (
      itemBounds.right > innerBounds.right &&
      itemBounds.left > innerBounds.left
    ) {
      x += deltaLeft;
    }
    if (
      itemBounds.bottom > innerBounds.bottom &&
      itemBounds.top > innerBounds.top
    ) {
      y += deltaTop;
    }
    if (
      itemBounds.top < innerBounds.top &&
      itemBounds.bottom < innerBounds.bottom
    ) {
      y += deltaBottom;
    }
    if (
      itemBounds.left < innerBounds.left &&
      itemBounds.right < innerBounds.right
    ) {
      x += deltaRight;
    }

    this.itemBounds = new Bounds(x, y, itemBounds.width, itemBounds.height);
  }

  get innerBounds() {
    const { margin, width, height } = this;
    return new Bounds(margin, margin, width - margin * 2, height - margin * 2);
  }

  get outerBounds() {
    return new Bounds(0, 0, this.width, this.height);
  }

  get visibleSourceBounds() {
    const { innerBounds } = this;
    const origin = this.viewToLocalPoint(0, 0);
    const corner = this.viewToLocalPoint(innerBounds.width, innerBounds.height);
    return new Bounds(
      origin.x,
      origin.y,
      corner.x - origin.x,
      corner.y - origin.y,
    );
  }

  get itemSourceBounds() {
    const { itemSourceRect } = this;
    return new Bounds(0, 0, itemSourceRect.width, itemSourceRect.height);
  }

  get fittedItemBounds() {
    const { margin, itemSourceRect, innerBounds } = this;
    const ratio = itemSourceRect.scaleToFitSmallestSide(innerBounds.rect);
    const width = itemSourceRect.width * ratio;
    const height = itemSourceRect.height * ratio;
    const x = margin + (innerBounds.width - width) * 0.5;
    const y = margin + (innerBounds.height - height) * 0.5;
    return new Bounds(x, y, width, height);
  }

  get isEmpty() {
    return this.itemSourceRect.width <= 0 && this.itemSourceRect.height <= 0;
  }

  get maxScale() {
    const { itemSourceBounds, innerBounds } = this;
    const minSize = Math.min(itemSourceBounds.width, itemSourceBounds.height);
    if (minSize <= innerBounds.width) {
      return MAX_SCALE;
    } else {
      return (minSize * MAX_SCALE) / innerBounds.width;
    }
  }

  get maxItemViewRect() {
    const { fittedItemBounds, maxScale } = this;
    const maxWidth = fittedItemBounds.width * maxScale;
    const maxHeight = fittedItemBounds.height * maxScale;
    return new Rectangle(maxWidth, maxHeight);
  }

  clear() {
    this.itemBounds = new Bounds(0, 0, 0, 0);
    this.itemSourceRect = new Rectangle(0, 0);
    delete this.item;
  }

  setItemSize(width: number, height: number) {
    this.itemSourceRect = new Rectangle(width, height);
    this.zoomToFit();
    return this;
  }

  setItem(item: any) {
    this.item = item;
    return this;
  }

  setScale(scale: number) {
    // number between 0 - 100
    const { fittedItemBounds, maxItemViewRect, itemBounds, innerBounds } = this;
    if (scale <= 1) {
      this.itemBounds = fittedItemBounds;
    } else {
      const clampedScale = Math.min(100, scale);
      const floatingScale = clampedScale / 100;
      const width =
        fittedItemBounds.width +
        (maxItemViewRect.width - fittedItemBounds.width) * floatingScale;
      const height =
        fittedItemBounds.height +
        (maxItemViewRect.height - fittedItemBounds.height) * floatingScale;
      const scaledBounds = new Bounds(
        itemBounds.x,
        itemBounds.y,
        width,
        height,
      );
      const localCenterBefore = this.viewToLocalPoint(
        innerBounds.width * 0.5,
        innerBounds.height * 0.5,
      );
      const center = itemBounds.center;
      const left = center.x - scaledBounds.width * 0.5;
      const top = center.y - scaledBounds.height * 0.5;
      this.itemBounds = new Bounds(
        left,
        top,
        scaledBounds.width,
        scaledBounds.height,
      );
      const localCenterAfter = this.viewToLocalPoint(
        innerBounds.width * 0.5,
        innerBounds.height * 0.5,
      );
      this.itemBounds = this.itemBounds.translated(
        localCenterAfter.x - localCenterBefore.x,
        localCenterAfter.y - localCenterBefore.y,
      );
      this.applyConstraints();
    }
    return this;
  }

  startDrag() {
    this.dragStartPos = this.itemBounds.origin;
    return this;
  }

  dragBy(xDelta: number, yDelta: number) {
    return this.startDrag().dragMove(xDelta, yDelta);
  }

  dragMove(xDelta: number, yDelta: number) {
    const { dragStartPos, itemBounds } = this;
    const x = dragStartPos.x + xDelta;
    const y = dragStartPos.y + yDelta;
    this.itemBounds = new Bounds(x, y, itemBounds.width, itemBounds.height);
    this.applyConstraints();
    return this;
  }

  viewToLocalPoint(viewX: number, viewY: number): Vector2 {
    const { itemSourceRect, itemBounds, innerBounds } = this;
    const offset = innerBounds.origin.sub(itemBounds.origin);
    const rect = itemBounds.rect;
    const localX = (offset.x + viewX) / rect.width;
    const localY = (offset.y + viewY) / rect.height;
    return new Vector2(
      itemSourceRect.width * localX,
      itemSourceRect.height * localY,
    );
  }
}
