import * as Core from '../binaries/mediaEditor';
import { ImageProvider } from '../../components/imageProvider';
import { Bitmap } from './bitmap';
import { FragmentPosition } from './bitmapFragment';

const defaultFragmentPosition = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  uTopLeft: 0,
  vTopLeft: 0,
  uBottomRight: 0,
  vBottomRight: 0,
};

// Now this class supports only one image
export class BitmapProvider implements Core.BitmapProviderInterop {
  private bitmap: Bitmap | null = null;
  private fragmentPosition: FragmentPosition;

  constructor(
    private imageProvider: ImageProvider,
    private gl: WebGLRenderingContext,
  ) {
    this.createBitmap();
    this.fragmentPosition = { ...defaultFragmentPosition };
  }

  unload(): void {
    this.destroyBitmap(false);
  }

  handleContextLost(): void {
    this.destroyBitmap(true);
  }

  handleContextRestored(): void {
    this.createBitmap();
  }

  private createBitmap(): void {
    const { backImage, supplementaryCanvas } = this.imageProvider;
    this.bitmap = new Bitmap(backImage, this.gl, supplementaryCanvas);
  }

  private destroyBitmap(contextLost: boolean): void {
    if (this.bitmap) {
      this.bitmap.unload(contextLost);
    }
  }

  // Gets the index of the bitmap specified by its UUID. Later a bitmap will be referenced with its index.
  // Once an index assigned to the bitmap, it cannot change during the lifetime of the bitmap provider.
  // In case of failure returns -1, 0 is a valid value.
  getBitmapIndex(uuid: string): number {
    if (uuid !== this.imageProvider.backImageUuid) {
      return -1;
    }

    return 0;
  }

  // Gets the bitmap dimensions
  getBitmapWidth(): number {
    return this.bitmap ? this.bitmap.size.width : 0;
  }

  getBitmapHeight(): number {
    return this.bitmap ? this.bitmap.size.height : 0;
  }

  getNumberOfFragments(): number {
    return this.bitmap ? this.bitmap.numberOfFragments : 0;
  }

  queryFragmentCoordinates(_: number, fragmentIndex: number): boolean {
    if (!this.bitmap) {
      return false;
    }

    const position = this.bitmap.getFragmentPosition(fragmentIndex);
    if (position) {
      this.fragmentPosition = position;
      return true;
    } else {
      this.fragmentPosition = { ...defaultFragmentPosition };
      return false;
    }
  }

  getX(): number {
    return this.fragmentPosition.x;
  }

  getY(): number {
    return this.fragmentPosition.y;
  }

  getWidth(): number {
    return this.fragmentPosition.width;
  }

  getHeight(): number {
    return this.fragmentPosition.height;
  }

  getUTopLeft(): number {
    return this.fragmentPosition.uTopLeft;
  }

  getVTopLeft(): number {
    return this.fragmentPosition.vTopLeft;
  }

  getUBottomRight(): number {
    return this.fragmentPosition.uBottomRight;
  }

  getVBottomRight(): number {
    return this.fragmentPosition.vBottomRight;
  }

  bind(_: number, fragmentIndex: number): boolean {
    if (!this.bitmap) {
      return false;
    }

    return this.bitmap.bindFragment(fragmentIndex);
  }
}
