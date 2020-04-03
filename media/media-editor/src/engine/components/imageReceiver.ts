import { Component } from './component';

// When the core is asked to provide the image, it doesn't get the whole image at once.
// Instead it provides image parts. They are rendered on the supplementary canvas.
export interface ImageReceiver extends Component {
  readonly supplementaryCanvas: HTMLCanvasElement;
}

export class DefaultImageReceiver implements ImageReceiver {
  constructor(public readonly supplementaryCanvas: HTMLCanvasElement) {}

  unload(): void {}
}
