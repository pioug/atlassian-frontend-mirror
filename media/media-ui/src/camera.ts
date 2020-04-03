export class Vector2 {
  constructor(public readonly x: number, public readonly y: number) {}

  add({ x: thatX, y: thatY }: Vector2): Vector2 {
    const { x: thisX, y: thisY } = this;
    return new Vector2(thisX + thatX, thisY + thatY);
  }

  sub({ x: thatX, y: thatY }: Vector2): Vector2 {
    const { x: thisX, y: thisY } = this;
    return new Vector2(thisX - thatX, thisY - thatY);
  }

  scaled(scalar: number): Vector2 {
    const { x, y } = this;
    return new Vector2(x * scalar, y * scalar);
  }

  map(fn: (component: number) => number): Vector2 {
    return new Vector2(fn(this.x), fn(this.y));
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  rounded() {
    return new Vector2(Math.round(this.x), Math.round(this.y));
  }

  toString() {
    return `[${this.x}, ${this.y}]`;
  }
}

export class Rectangle {
  constructor(public readonly width: number, public readonly height: number) {}

  get aspectRatio(): number {
    return this.width / this.height;
  }

  get center(): Vector2 {
    return new Vector2(this.width / 2, this.height / 2);
  }

  scaled(scale: number): Rectangle {
    return new Rectangle(this.width * scale, this.height * scale);
  }

  resized(width: number, height: number): Rectangle {
    return new Rectangle(width, height);
  }

  flipped(): Rectangle {
    return new Rectangle(this.height, this.width);
  }

  // Computes the scaling factor that needs to be applied to this
  // Rectangle so that it
  // - is fully visible inside of the containing Rectangle
  // - is the LARGEST possible size
  // - maintains the original aspect ratio (no distortion)
  scaleToFit(containing: Rectangle): number {
    const widthRatio = containing.width / this.width;
    const heightRatio = containing.height / this.height;
    if (widthRatio <= heightRatio) {
      return widthRatio;
    } else {
      return heightRatio;
    }
  }

  scaleToFitLargestSide(containing: Rectangle): number {
    return this.scaleToFit(containing);
  }

  // Computes the scaling factor that needs to be applied to this
  // Rectangle so that it
  // - is fully visible inside of the containing Rectangle
  // - is the SMALLEST possible size
  // - maintains the original aspect ratio (no distortion)
  scaleToFitSmallestSide(containing: Rectangle): number {
    const widthRatio = containing.width / this.width;
    const heightRatio = containing.height / this.height;
    if (widthRatio >= heightRatio) {
      return widthRatio;
    } else {
      return heightRatio;
    }
  }

  clone(): Rectangle {
    return new Rectangle(this.width, this.height);
  }
}

export class Bounds extends Rectangle {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly width: number,
    public readonly height: number,
  ) {
    super(width, height);
  }

  get origin(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  get corner(): Vector2 {
    return new Vector2(this.x + this.width, this.y + this.height);
  }

  get center(): Vector2 {
    return new Vector2(this.x + this.width * 0.5, this.y + this.height * 0.5);
  }

  get rect(): Rectangle {
    return new Rectangle(this.width, this.height);
  }

  get left() {
    return this.x;
  }

  get top() {
    return this.y;
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }

  flipped(): Bounds {
    const rect = this.rect.flipped();
    return new Bounds(this.x, this.y, rect.width, rect.height);
  }

  scaled(scale: number): Bounds {
    return new Bounds(
      this.x * scale,
      this.y * scale,
      this.width * scale,
      this.height * scale,
    );
  }

  relativeTo(bounds: Bounds): Bounds {
    return new Bounds(
      this.x - bounds.x,
      this.y - bounds.y,
      this.width,
      this.height,
    );
  }

  clone(): Bounds {
    return new Bounds(this.x, this.y, this.width, this.height);
  }

  map(fn: (value: number) => number): Bounds {
    return new Bounds(fn(this.x), fn(this.y), fn(this.width), fn(this.height));
  }

  hFlipWithin(containerBounds: Bounds) {
    const hGap = containerBounds.right - this.right;
    return new Bounds(
      containerBounds.left + hGap,
      this.top,
      this.width,
      this.height,
    );
  }

  vFlipWithin(containerBounds: Bounds) {
    const vGap = this.top - containerBounds.top;
    return new Bounds(
      this.left,
      containerBounds.bottom - vGap - this.height,
      this.width,
      this.height,
    );
  }

  rotate90DegWithin(containerBounds: Bounds) {
    const hGap = containerBounds.right - this.right;
    const vGap = this.top - containerBounds.top;
    return new Bounds(
      containerBounds.left + vGap,
      containerBounds.top + hGap,
      this.height,
      this.width,
    );
  }

  translated(xDelta: number, yDelta: number) {
    return new Bounds(
      this.x + xDelta,
      this.y + yDelta,
      this.width,
      this.height,
    );
  }

  equals(bounds: Bounds) {
    return (
      this.x === bounds.x &&
      this.y === bounds.y &&
      this.width === bounds.width &&
      this.height === bounds.height
    );
  }
}

export class Camera {
  constructor(
    public readonly viewport: Rectangle,
    public readonly originalImg: Rectangle,
  ) {}

  resizedViewport(newViewport: Rectangle): Camera {
    return new Camera(newViewport, this.originalImg);
  }

  get scaleToFit(): number {
    return this.originalImg.scaleToFitLargestSide(this.viewport);
  }

  // If the image is smaller than or equal to the viewport, it won't be scaled.
  // If the image is larger than the viewport, it will be scaled down to fit.
  get scaleDownToFit(): number {
    return Math.min(1, this.scaleToFit);
  }

  get fittedImg(): Rectangle {
    return this.originalImg.scaled(this.scaleDownToFit);
  }

  scaledImg(newScale: number): Rectangle {
    return this.originalImg.scaled(newScale);
  }

  scaledOffset(
    prevOffset: Vector2,
    prevScale: number,
    newScale: number,
  ): Vector2 {
    const { viewport } = this;
    return prevOffset
      .add(viewport.center)
      .scaled(newScale / prevScale)
      .sub(viewport.center);
  }
}
