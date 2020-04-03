// Describes the position of a fragment on the whole bitmap
export type FragmentPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
  uTopLeft: number;
  vTopLeft: number;
  uBottomRight: number;
  vBottomRight: number;
};

// One piece of a bitmap. Holds one texture.
export class BitmapFragment {
  readonly position: FragmentPosition;
  private readonly texture: WebGLTexture;

  constructor(
    private readonly gl: WebGLRenderingContext,
    x: number,
    y: number,
    width: number,
    height: number,
    image: HTMLImageElement,
    supplementaryCanvas: HTMLCanvasElement,
  ) {
    this.position = {
      x,
      y,
      width,
      height,
      uTopLeft: 0.0,
      vTopLeft: 0.0,
      uBottomRight: 1.0,
      vBottomRight: 1.0,
    };

    this.texture = this.createTexture(image, supplementaryCanvas);
  }

  unload(contextLost: boolean): void {
    if (!contextLost) {
      this.gl.deleteTexture(this.texture);
    }
  }

  bind(): boolean {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    return true;
  }

  private createTexture(
    image: HTMLImageElement,
    supplementaryCanvas: HTMLCanvasElement,
  ): WebGLTexture {
    const { width, height, x, y } = this.position;

    // Draw the fragment on the supplementary canvas
    supplementaryCanvas.width = width;
    supplementaryCanvas.height = height;
    const context = supplementaryCanvas.getContext(
      '2d',
    ) as CanvasRenderingContext2D;
    context.drawImage(image, x, y, width, height, 0, 0, width, height);

    // Create the texture
    const gl = this.gl;
    const texture = gl.createTexture();
    if (!texture) {
      throw new Error('Could not create a texture');
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      supplementaryCanvas,
    );
    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
  }
}
