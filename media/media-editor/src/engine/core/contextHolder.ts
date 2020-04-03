import { DrawingArea, OutputSize } from '../components/drawingArea';
import { Signal } from '../signal';

export class ContextHolder {
  readonly gl: WebGLRenderingContext;
  readonly contextLost: Signal<{}> = new Signal();
  readonly contextRestored: Signal<OutputSize> = new Signal<OutputSize>();

  private readonly canvas: HTMLCanvasElement;
  private readonly contextLostListener = () => this.contextLost.emit({});
  private readonly contextRestoredListener: EventListener;

  constructor(drawingArea: DrawingArea) {
    this.canvas = drawingArea.canvas;

    const gl = ContextHolder.getContext(this.canvas);
    if (gl) {
      this.gl = gl;
    } else {
      // eslint-disable-next-line no-console
      console.error('webgl is not supported');
      throw new Error('WEBGL is not supported');
    }

    this.contextRestoredListener = () => {
      this.contextRestored.emit(drawingArea.outputSize);
    };

    this.canvas.addEventListener('webglcontextlost', this.contextLostListener);
    this.canvas.addEventListener(
      'webglcontextrestored',
      this.contextRestoredListener,
    );
  }

  unload(): void {
    this.canvas.removeEventListener(
      'webglcontextlost',
      this.contextLostListener,
    );
    this.canvas.removeEventListener(
      'webglcontextrestored',
      this.contextRestoredListener,
    );
  }

  static getContext(canvas: HTMLCanvasElement) {
    return (
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
    );
  }
}
