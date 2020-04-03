// Position of a text fragment.
// The core assumes that
//   (xbase, ybase) is the position where the texture coordinates are (0.0, 1.0),
//   (xopposite, yopposite) is the position where the texture coordinates are (1.0, 0.0)
export interface FragmentPosition {
  xbase: number;
  ybase: number;
  xopposite: number;
  yopposite: number;
}

// Part of a text. Contains two alpha textures:
//   - normal for the text itself,
//   - stroke for the outline.
//
// A fragment owns its textures: when it is unloaded it must release its textures.
export class Fragment {
  constructor(
    private readonly gl: WebGLRenderingContext,
    private readonly normal: WebGLTexture,
    private readonly stroke: WebGLTexture,
    public readonly position: FragmentPosition,
  ) {}

  unload(isContextLost: boolean): void {
    if (!isContextLost) {
      const gl = this.gl;
      gl.deleteTexture(this.normal);
      gl.deleteTexture(this.stroke);
    }
  }

  bindNormal(): boolean {
    return this.bindTexture(this.normal);
  }

  bindStroke(): boolean {
    return this.bindTexture(this.stroke);
  }

  private bindTexture(texture: WebGLTexture): boolean {
    if (!texture) {
      return false;
    }

    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    return true;
  }
}
