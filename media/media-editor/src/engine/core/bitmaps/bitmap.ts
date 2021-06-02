import { BitmapFragment, FragmentPosition } from './bitmapFragment';

export interface BitmapSize {
  width: number;
  height: number;
}

// Holds a bitmap from the bitmap provider. Each bitmap consists of several fragments (textures)
export class Bitmap {
  readonly size: BitmapSize;
  private readonly fragments: Array<BitmapFragment>;

  constructor(
    img: HTMLImageElement,
    gl: WebGLRenderingContext,
    supplementaryCanvas: HTMLCanvasElement,
  ) {
    this.size = { width: img.width, height: img.height };

    const maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    this.fragments = this.splitToFragments(
      img,
      gl,
      supplementaryCanvas,
      maxSize,
    );
  }

  unload(contextLost: boolean): void {
    this.fragments.forEach((fragment) => fragment.unload(contextLost));
  }

  get numberOfFragments(): number {
    return this.fragments.length;
  }

  getFragmentPosition(fragmentIndex: number): FragmentPosition | null {
    return this.applyToFragment(
      fragmentIndex,
      (fragment) => fragment.position,
      null,
    );
  }

  bindFragment(fragmentIndex: number): boolean {
    return this.applyToFragment(
      fragmentIndex,
      (fragment) => fragment.bind(),
      false,
    );
  }

  // Generic method to perform an action on a fragment specified by the index
  // If no fragment is found, the 'notFound' value is returned
  private applyToFragment<T>(
    fragmentIndex: number,
    action: (fragment: BitmapFragment) => T,
    notFound: T,
  ): T {
    if (fragmentIndex < 0 || fragmentIndex >= this.fragments.length) {
      return notFound;
    }

    return action(this.fragments[fragmentIndex]);
  }

  private splitToFragments(
    img: HTMLImageElement,
    gl: WebGLRenderingContext,
    supplementaryCanvas: HTMLCanvasElement,
    maxSize: number,
  ): Array<BitmapFragment> {
    const fragments: Array<BitmapFragment> = [];
    const { width, height } = this.size;

    for (let x = 0; x < width; x += maxSize) {
      for (let y = 0; y < height; y += maxSize) {
        const xMax = Math.min(x + maxSize, width);
        const yMax = Math.min(y + maxSize, height);

        const fragmentWidth = xMax - x;
        const fragmentHeight = yMax - y;
        const fragment = new BitmapFragment(
          gl,
          x,
          y,
          fragmentWidth,
          fragmentHeight,
          img,
          supplementaryCanvas,
        );
        fragments.push(fragment);
      }
    }

    return fragments;
  }
}
