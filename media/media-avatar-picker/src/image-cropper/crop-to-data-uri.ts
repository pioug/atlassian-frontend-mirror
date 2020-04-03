import { isRotated } from '@atlaskit/media-ui';
import { CONTAINER_PADDING } from './styled';
import { getCanvas } from '../util';

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const cropToDataURI = (
  imageElement: HTMLImageElement,
  imageRect: Rect,
  cropRect: Rect,
  scale: number,
  imageOrientation: number,
) => {
  const { top, left, width, height } = cropRect;
  const scaleWithDefault = scale || 1;
  let destinationWidth = Math.max(width - CONTAINER_PADDING * 2, 0);
  let destinationHeight = Math.max(height - CONTAINER_PADDING * 2, 0);

  const { canvas, context } = getCanvas(destinationWidth, destinationHeight);

  if (!context) {
    return '';
  }

  //    ┏┅┅┅┅┅┅┅┅┅┅┅ ← Border of an original Image
  //    ┇  Not Visible part of an image
  //    ┇    ╔══════════════════════════════════════╗
  //    ┇    ║  Padded area (semi transparent)      ║
  //    ┇    ║    ┌────────────────────────────┐    ║
  //    ┇    ║    │                            │    ║
  //    ┇    ║    │  Cropped Part of an Image  │    ║
  //    ┇    ║    │                            │    ║
  //    ↑     ↑    ↑                            ↑    ↑
  //   (a)   (b)  (c)                          (d)  (e)
  //
  //  cropRect.left and cropRect.top are the coordinates of (c) with (b) as origin in mind
  //  sourceLeft and sourceTop are coordinates of (c) with (a) as origin in mind
  //
  //  cropRect.width is a distance from (b) to (e)
  //  sourceWidth is a distance between (c) and (d)
  //
  //  CONTAINER_PADDING is a distance from (b) to (c)
  //
  //  Example:
  //  if cropRect.left === -100 (100 px to the left from (b) and CONTAINER_PADDING == 10,
  //  then sourceLeft === 10 - (-100) = 10 + 100 = 110 (distance from (a) to (c)

  const sourceImageWidth = imageRect.width / scaleWithDefault;
  const sourceImageHeight = imageRect.height / scaleWithDefault;
  let sourceLeft = (CONTAINER_PADDING - left) / scaleWithDefault;
  let sourceTop = (CONTAINER_PADDING - top) / scaleWithDefault;
  let sourceWidth = destinationWidth / scaleWithDefault;
  let sourceHeight = destinationHeight / scaleWithDefault;
  const sourceRight = sourceImageWidth - sourceWidth - sourceLeft;
  const sourceBottom = sourceImageHeight - sourceHeight - sourceTop;

  const cw180 = Math.PI;
  const cw90 = Math.PI / 2;
  const ccw90 = -Math.PI / 2;

  // Here we solve two problems:
  // 1. At this point sourceLeft and sourceTop based on target orientation of an image.
  //    Those represent what user has chosen as a top left corner. We need to convert
  //    these into top and left corner of the same rect, but in original image. We will
  //    use these new coordinates when we read from original image.
  //
  // 2. Perform affine transformation for canvas to orientate extracted part of an original image.

  /*
    Example image that user sees and specifies crop for:

   ┌───────────────────┐
   │         T         |
   │   x               | <--- x - Crop's top left corner
   │                   |
   │       - . o       |
   │ L     \___/     R |
   │                   |
   │                   |
   │         B         |
   └───────────────────┘
   */

  switch (imageOrientation) {
    case 2:
      /*  Image is stored like this:
                         Original Image Left == User's Right
                         ↓
         ┌───────────────────┐
         │         T         |
         │               x   | <--- Top == User's Top
         │                   |
         │       o . -       |
         │ R     \___/     L |
         │                   |
         │                   |
         │         B         |
         └───────────────────┘
       */
      [sourceLeft, sourceTop] = [sourceRight, sourceTop];

      /*
      CX = Canvas Origin X
      FX = Final Origin X

      For details see this: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate

      0) Starting point       1) translate              2) mirror horizontally
      ┌─────┬──────→ CX, FX   ┌─────┬─────┬─→ CX, FX       CX ⃪───┬─────┬───────→ FX
      │  T  │                 │     │  T  │                      │  T  │
      │R   L│                 │     │R   L│                      │L   R│
      │  B  │                 │     │  B  │                      │  B  │
      ├─────┘                 │     ├─────┘                      ├─────┤
      │                       │     │                            │     │
      ↓                       ↓     ↓                            ↓     ↓
      CY                      FY    CY                           FY    CY
      FY

       */
      context.translate(destinationWidth, 0);
      context.scale(-1, 1);
      break;
    case 3:
      /*                 Left = Source Right
                         ↓
         ┌───────────────────┐
         │         B         |
         │                   |
         │        ___        |
         │       /   \       |
         │ R     o . -     L |
         │                   |
         │               x   |  <--- Top = Source Bottom
         │         T         |
         └───────────────────┘
       */
      [sourceLeft, sourceTop] = [sourceRight, sourceBottom];

      /*

      0) Starting point       1) translate             2) rotate 180
      ┌─────┬──────→ CX, FX   ┌─────────────→ CX, FX                  CY
      │  B  │                 │                                       ↑
      │R   L│                 │                                 ┌─────┼───────→ FX
      │  T  │                 │                                 │  T  │
      ├─────┘                 │     ┌─────┬─→ CX                │L   R│
      │                       │     │  B  │                     │  B  │
      ↓                       │     │R   L│               CX ⃪───┼─────┘
      CY                      │     │  T  │                     │
      FY                      │     ├─────┘                     ↓
                              │     │                           FY
                              ↓     ↓
                              FY    CY

       */
      context.translate(destinationWidth, destinationHeight);
      context.rotate(cw180);
      break;
    case 4:
      /*    Left = Source Left
            ↓
         ┌───────────────────┐
         │         B         |
         │  x                | <--- Top = Source Bottom
         │        ___        |
         │       /   \       |
         │ L     - . o     R |
         │                   |
         │                   |
         │         T         |
         └───────────────────┘
       */
      [sourceLeft, sourceTop] = [sourceLeft, sourceBottom];

      /*

      0) Starting point        1) Translate    2) Mirror
      ┌─────┬──────→ CX, FX    ┌──────→ FX     CY
      │  B  │                  │               ↑
      │L   R│                  │               ├─────┬───→ FX
      │  T  │                  │               │  T  │
      ├─────┘                  ├─────┬─→ CX    │L   R│
      │                        │  B  │         │  B  │
      ↓                        │L   R│         ├─────┴─→ CX
      CY                       │  T  │         │
      FY                       ├─────┘         ↓
                               │               FY
                               ↓
                               CY
                               FY
      */
      context.translate(0, destinationHeight);
      context.scale(1, -1);
      break;
    case 5:
      /*    Left = Source Top
            ↓
         ┌───────────────────┐
         │         L         |
         │  x                | <--- Top = Source Left
         │       |  \        |
         │        .  |       |
         │ T     o  /      B |
         │                   |
         │                   |
         │         R         |
         └───────────────────┘
       */
      [sourceLeft, sourceTop] = [sourceTop, sourceLeft];

      /*

      0) Starting point        1) Rotate Clock Wise 90     2) Mirror horizontally
      ┌─────┬──────→ CX, FX    CY ⃪───┬─────┬───────→ FX    ┌─────┬──────→ CY, FX
      │  L  │                        │  T  │               │  T  │
      │T   B│                        │R   L│               │L   R│
      │  R  │                        │  B  │               │  B  │
      ├─────┘                        └─────┤               ├─────┘
      │                                    │               │
      ↓                                    ↓               ↓
      CY                                   CX              CX
      FY                                   FY              FY

      */
      context.rotate(cw90);
      context.scale(1, -1);
      break;
    case 6:
      /*    Left = Source Top
            ↓
         ┌───────────────────┐
         │         R         |
         │                   |
         │       o  \        |
         │        .  |       |
         │ T     |  /      B |
         │                   |
         │  x                | <--- Top = Source right
         │         L         |
         └───────────────────┘
       */
      [sourceLeft, sourceTop] = [sourceTop, sourceRight];

      /*

      0) Starting point        1) translate              2) Rotate 90 clock wise
      ┌─────┬──────→ CX, FX    ┌─────┬─────┬─→ CX, FX    CY ⃪───┬─────┬───────→ FX
      │  R  │                  │     │  R  │                   │  T  │
      │T   B│                  │     │T   B│                   │L   R│
      │  L  │                  │     │  L  │                   │  B  │
      ├─────┘                  │     ├─────┘                   ├─────┤
      │                        │     │                         │     │
      ↓                        ↓     ↓                         ↓     ↓
      CY                       FY    CY                        FY    CX
      FY

       */
      context.translate(destinationWidth, 0);
      context.rotate(cw90);
      break;
    case 7:
      /*                Left = Source Bottom
                        ↓
         ┌───────────────────┐
         │         R         |
         │                   |
         │      / o          |
         │     | .           |
         │ B    \ |        T |
         │                   |
         │              x    | <--- Top = Source right
         │         L         |
         └───────────────────┘
       */
      [sourceLeft, sourceTop] = [sourceBottom, sourceRight];

      /*

      0) Starting point       1) translate             2) Rotate            3) Mirror horizontally
      ┌─────┬──────→ CX, FX   ┌─────────────→ CX, FX         CX
      │  R  │                 │                              ↑                          CX
      │B   T│                 │                        ┌─────┼─────┬─→ FX               ↑
      │  L  │                 │                        │     │  T  │              ┌─────┼─→ FX
      ├─────┘                 │     ┌─────┬─→ CX       │     │R   L│              │  T  │
      │                       │     │  R  │            │     │  B  │              │L   R│
      ↓                       │     │B   T│            │     └─────┴─→ CY         │  B  │
      CY                      │     │  L  │            │                    CY ⃪───┼─────┘
      FY                      │     ├─────┘            ↓                          │
                              │     │                  FY                         ↓
                              ↓     ↓                                             FY
                              FY    CY
      */
      context.translate(destinationWidth, destinationHeight);
      context.rotate(ccw90);
      context.scale(1, -1);
      break;
    case 8:
      /*                Left = Source Bottom
                        ↓
         ┌───────────────────┐
         │         L         |
         │                   |
         │      / |          |
         │     | .           |
         │ B    \ o        T |
         │                   |
         │              x    | <--- Top = Source Left
         │         R         |
         └───────────────────┘
       */
      [sourceLeft, sourceTop] = [sourceBottom, sourceLeft];

      /*

      0) Starting point       1) Translate   2) Rotate 90 Counter Clock Wise
      ┌─────┬──────→ CX, FX   ┌──────→ FX    CX
      │  L  │                 │              ↑
      │B   T│                 │              ├─────┬───→ FX
      │  R  │                 │              │  T  │
      ├─────┘                 ├─────┬─→ CX   │L   R│
      │                       │  L  │        │  B  │
      ↓                       │B   T│        ├─────┴─→ CY
      CY                      │  R  │        │
      FY                      ├─────┘        ↓
                              │              FY
                              ↓
                              CY
                              FY
      */
      context.translate(0, destinationHeight);
      context.rotate(ccw90);
      break;
  }

  if (isRotated(imageOrientation)) {
    [sourceWidth, sourceHeight] = [sourceHeight, sourceWidth];
    [destinationHeight, destinationWidth] = [
      destinationWidth,
      destinationHeight,
    ];
  }

  context.drawImage(
    imageElement,
    sourceLeft,
    sourceTop,
    sourceWidth,
    sourceHeight,
    0,
    0,
    destinationWidth,
    destinationHeight,
  );

  return canvas.toDataURL();
};
