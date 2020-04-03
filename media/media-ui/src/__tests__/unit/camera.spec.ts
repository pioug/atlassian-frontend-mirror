import { Bounds, Rectangle, Camera, Vector2 } from '../../camera';
import * as jsc from 'jsverify';

const ACCEPTABLE_FLOATING_ERROR = 0.001;

const sideLenGenerator = () => jsc.integer(1, 10000);
const upscaleGenerator = () => jsc.number(1.1, 5);
const downscaleGenerator = () => jsc.number(0.1, 0.9);

describe('Rectangle', () => {
  describe('fitting rectangles', () => {
    jsc.property(
      "no side of the fitted rect is larger than the containing rect's sides",
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (w1, h1, w2, h2) => {
        const containing = new Rectangle(w1, h1);
        const original = new Rectangle(w2, h2);
        const fitted = original.scaled(
          original.scaleToFitLargestSide(containing),
        );
        expect(
          Math.round(fitted.width) > Math.round(containing.width) ||
            Math.round(fitted.height) > Math.round(containing.height),
        ).toBeFalsy();
        return !(
          Math.round(fitted.width) > Math.round(containing.width) ||
          Math.round(fitted.height) > Math.round(containing.height)
        );
      },
    );

    jsc.property(
      "at least one side of the fitted rect equals a containing rect's side",
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (w1, h1, w2, h2) => {
        const containing = new Rectangle(w1, h1);
        const original = new Rectangle(w2, h2);
        const fitted = original.scaled(
          original.scaleToFitSmallestSide(containing),
        );
        expect(
          Math.round(fitted.width) === Math.round(containing.width) ||
            Math.round(fitted.height) === Math.round(containing.height),
        ).toBeTruthy();
        return (
          Math.round(fitted.width) === Math.round(containing.width) ||
          Math.round(fitted.height) === Math.round(containing.height)
        );
      },
    );

    jsc.property(
      'the fitted rect has the same aspect ratio as the original',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (w1, h1, w2, h2) => {
        const containing = new Rectangle(w1, h1);
        const original = new Rectangle(w2, h2);
        const fitted = original.scaled(
          original.scaleToFitSmallestSide(containing),
        );
        expect(
          original.aspectRatio - fitted.aspectRatio <=
            ACCEPTABLE_FLOATING_ERROR,
        ).toBeTruthy();
        return (
          original.aspectRatio - fitted.aspectRatio <= ACCEPTABLE_FLOATING_ERROR
        );
      },
    );
  });
});

describe('Bounds', () => {
  it('should provide origin and size', () => {
    const X = 1;
    const Y = 2;
    const WIDTH = 3;
    const HEIGHT = 4;
    const bounds = new Bounds(X, Y, WIDTH, HEIGHT);
    expect(bounds.x).toBe(X);
    expect(bounds.y).toBe(Y);
    expect(bounds.width).toBe(WIDTH);
    expect(bounds.height).toBe(HEIGHT);
    expect(bounds.left).toBe(X);
    expect(bounds.top).toBe(Y);
    expect(bounds.right).toBe(X + WIDTH);
    expect(bounds.bottom).toBe(Y + HEIGHT);
    expect(bounds.corner).toEqual({ x: X + WIDTH, y: Y + HEIGHT });
  });

  it('should provide center point relative to origin', () => {
    const bounds = new Bounds(10, 20, 30, 40);
    const center = bounds.center;
    expect(center.x).toBe(bounds.x + bounds.width * 0.5);
    expect(center.y).toBe(bounds.y + bounds.height * 0.5);
  });

  it('should clone new bounds from current values', () => {
    const bounds = new Bounds(1, 2, 3, 4);
    const clone = bounds.clone();
    expect(clone.x).toBe(bounds.x);
    expect(clone.y).toBe(bounds.y);
    expect(clone.width).toBe(bounds.width);
    expect(clone.height).toBe(bounds.height);
  });

  it('should scale origin and size', () => {
    const bounds = new Bounds(1, 2, 3, 4);
    const scaled = bounds.scaled(0.5);
    expect(scaled.x).toBe(bounds.x * 0.5);
    expect(scaled.y).toBe(bounds.y * 0.5);
    expect(scaled.width).toBe(bounds.width * 0.5);
    expect(scaled.height).toBe(bounds.height * 0.5);
  });

  it('should flip correctly', () => {
    const bounds = new Bounds(1, 2, 3, 4);
    const flipped = bounds.flipped();
    expect(flipped.x).toBe(bounds.x);
    expect(flipped.y).toBe(bounds.y);
    expect(flipped.width).toBe(bounds.height);
    expect(flipped.height).toBe(bounds.width);
  });
});

describe('Camera', () => {
  describe('scaleDownToFit', () => {
    jsc.property(
      'no image is ever scaled up',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (side1, side2, side3, side4) => {
        const viewport = new Rectangle(side1, side2);
        const originalImg = new Rectangle(side3, side4);
        const camera = new Camera(viewport, originalImg);
        expect(camera.scaleDownToFit <= 1).toBeTruthy();
        return camera.scaleDownToFit <= 1;
      },
    );

    jsc.property(
      'an image smaller than or equal to the viewport is not scaled down',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (side1, side2, side3, side4) => {
        const viewport = new Rectangle(side1 + side3, side2 + side4);
        const originalImg = new Rectangle(side3, side4);
        const camera = new Camera(viewport, originalImg);
        expect(camera.scaleDownToFit === 1).toBeTruthy();
        return camera.scaleDownToFit === 1;
      },
    );

    jsc.property(
      'an image larger than the viewport is scaled down',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (side1, side2, side3, side4) => {
        const viewport = new Rectangle(side1, side2);
        const originalImg = new Rectangle(side1 + side3, side2 + side4);
        const camera = new Camera(viewport, originalImg);
        expect(camera.scaleDownToFit < 1).toBeTruthy();
        return camera.scaleDownToFit < 1;
      },
    );
  });

  describe('scaledImg', () => {
    jsc.property(
      'any up-scaled image is larger than the original one',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      upscaleGenerator(),
      (side1, side2, side3, side4, scale) => {
        const viewport = new Rectangle(side1, side2);
        const originalImg = new Rectangle(side3, side4);
        const camera = new Camera(viewport, originalImg);
        const fitted = camera.fittedImg;
        const upscaled = camera.scaledImg(scale);
        expect(
          fitted.width < upscaled.width && fitted.height < upscaled.height,
        ).toBeTruthy();
        return fitted.width < upscaled.width && fitted.height < upscaled.height;
      },
    );

    jsc.property(
      'any down-scaled image is smaller than the original one',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      downscaleGenerator(),
      (side1, side2, side3, side4, scale) => {
        const viewport = new Rectangle(side1, side2);
        const originalImg = new Rectangle(side3, side4);
        const camera = new Camera(viewport, originalImg);
        const downscaled = camera.scaledImg(scale);
        expect(
          originalImg.width > downscaled.width &&
            originalImg.height > downscaled.height,
        ).toBeTruthy();
        return (
          originalImg.width > downscaled.width &&
          originalImg.height > downscaled.height
        );
      },
    );
  });

  describe('scaledOffset', () => {
    jsc.property(
      'any up-scaled image is positioned further away from the center than a fitted one',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      upscaleGenerator(),
      (side1, side2, side3, side4, scale) => {
        const viewport = new Rectangle(side1, side2);
        const originalImg = new Rectangle(side3, side4);
        const camera = new Camera(viewport, originalImg);
        const prevOffset = new Vector2(0, 0);
        const fitted = camera.scaledOffset(prevOffset, 1, 1);
        const upscaled = camera.scaledOffset(prevOffset, 1, scale);
        expect(fitted.x < upscaled.x && fitted.y < upscaled.y).toBeTruthy();
        return fitted.x < upscaled.x && fitted.y < upscaled.y;
      },
    );

    jsc.property(
      'any down-scaled image is positioned closer to the center than a fitted one',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      downscaleGenerator(),
      (side1, side2, side3, side4, scale) => {
        const viewport = new Rectangle(side1, side2);
        const originalImg = new Rectangle(side3, side4);
        const camera = new Camera(viewport, originalImg);
        const prevOffset = new Vector2(0, 0);
        const fitted = camera.scaledOffset(prevOffset, 1, 1);
        const downscaled = camera.scaledOffset(prevOffset, 1, scale);
        expect(fitted.x > downscaled.x && fitted.y > downscaled.y).toBeTruthy();
        return fitted.x > downscaled.x && fitted.y > downscaled.y;
      },
    );
  });
});
