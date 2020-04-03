import * as Core from './binaries/mediaEditor';
import { Dimensions } from '../../common';

// Responsible for receiving the image
export class BitmapExporter implements Core.BitmapExporterInterop {
  constructor(
    private supplementaryCanvas: HTMLCanvasElement,
    private module: Core.NativeModule,
  ) {}

  prepare(imageWidth: number, imageHeight: number): boolean {
    if (imageWidth <= 0 || imageHeight <= 0) {
      return false;
    }

    this.supplementaryCanvas.width = imageWidth;
    this.supplementaryCanvas.height = imageHeight;

    return (
      this.supplementaryCanvas.width === imageWidth &&
      this.supplementaryCanvas.height === imageHeight
    );
  }

  // Puts the part of the image to the canvas.
  // The array is allocated in Emscripten heap. The core is responsible for releasing it.
  // buffer is the offset in the 8-bit Emscripten heap, bufferLength is the length of the buffer in bytes.
  // The image format is RGBA, no extra conversion necessary to place it to the canvas.
  putImagePart(
    left: number,
    top: number,
    width: number,
    height: number,
    buffer: number,
    bufferLength: number,
  ): void {
    const context = this.supplementaryCanvas.getContext('2d');
    if (context) {
      const array = new Uint8ClampedArray(
        this.module.HEAPU8.buffer,
        buffer,
        bufferLength,
      );
      const imageData = context.createImageData(width, height); // new ImageData() doesn't work in IE11
      imageData.data.set(array);
      context.putImageData(imageData, left, top);
    }
  }

  getBase64Image(format: string): string {
    return this.supplementaryCanvas.toDataURL(format);
  }

  getDimensions(): Dimensions {
    return {
      width: this.supplementaryCanvas.width,
      height: this.supplementaryCanvas.height,
    };
  }
}
