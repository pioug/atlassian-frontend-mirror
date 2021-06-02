import * as Core from '../binaries/mediaEditor';
import { Typeset } from './typeset';
import { FontInfo } from './fontInfo';

export interface BrowserTypesetterConfig {
  gl: WebGLRenderingContext;
  supplementaryCanvas: HTMLCanvasElement;
  textHelperDiv: HTMLDivElement;
  module: Core.NativeModule;
}

// The core needs typesets to render text.
// This class is responsible for storing and providing typesets.
export class BrowserTypesetter implements Core.BrowserTypesetterInterop {
  private typesets: Array<Typeset> = [];
  private fontInfo: FontInfo;

  constructor(private readonly config: BrowserTypesetterConfig) {
    this.fontInfo = new FontInfo(this.config.textHelperDiv);
  }

  unload(): void {
    this.typesets.forEach((typeset) => typeset.unload());
  }

  // Creates a new typeset, returns its index.
  // The newly created typeset must exist until it is explicitly deleted with deleteTypeset() regardless context loss.
  createTypeset(): number {
    const typeset = new Typeset({
      ...this.config,
      fontInfo: this.fontInfo,
    });
    return this.typesets.push(typeset) - 1;
  }

  deleteTypeset(index: number): void {
    this.typesets[index].unload();
  }

  getTypeset(index: number): Core.TypesetInterop {
    return this.typesets[index];
  }

  handleContextLost(): void {
    this.typesets.forEach((typeset) => typeset.contextLost());
  }

  handleContextRestored(): void {
    this.typesets.forEach((typeset) => typeset.contextRestored());
  }
}
