import { ColorWithAlpha } from '../../common';
import { Component } from './component';
import { Signal } from '../signal';

export interface OutputSize {
  width: number;
  height: number;
  screenScaleFactor: number;
}

export interface DrawingArea extends Component {
  readonly canvas: HTMLCanvasElement;
  readonly outputSize: OutputSize;
  readonly backgroundColor: ColorWithAlpha;

  readonly resize: Signal<OutputSize>;
}

export class DefaultDrawingArea implements DrawingArea {
  public readonly resize: Signal<OutputSize> = new Signal<OutputSize>();

  constructor(
    public readonly canvas: HTMLCanvasElement,
    private size: OutputSize,
    public readonly backgroundColor: ColorWithAlpha,
  ) {
    this.setCanvasSize();
  }

  get outputSize(): OutputSize {
    return this.size;
  }

  unload(): void {}

  setSize(size: OutputSize): void {
    this.size = size;
    this.setCanvasSize();
    this.resize.emit(size);
  }

  private setCanvasSize(): void {
    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
  }
}
