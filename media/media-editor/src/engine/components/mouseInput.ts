import { Component } from './component';
import { Signal } from '../signal';

// Each coordinate is a float value between 0.0 and 1.0.
// (0.0, 0.0) corresponds to the top left corner, (1.0, 1.0) corresponds to the bottom right corner of the input area.
export interface ScreenPoint {
  x: number;
  y: number;
}

export interface MouseInput extends Component {
  click: Signal<ScreenPoint>;
  dragStart: Signal<ScreenPoint>;
  dragMove: Signal<ScreenPoint>;
  dragEnd: Signal<ScreenPoint>;
  dragLost: Signal<{}>;
}

export type PositionCalculator = (event: MouseEvent) => ScreenPoint;

export class DefaultMouseInput implements MouseInput {
  readonly click = new Signal<ScreenPoint>();
  readonly dragStart = new Signal<ScreenPoint>();
  readonly dragMove = new Signal<ScreenPoint>();
  readonly dragEnd = new Signal<ScreenPoint>();
  readonly dragLost = new Signal<{}>();

  private readonly mouseDownListener = (event: MouseEvent) =>
    this.mouseDown(event);
  private readonly mouseMoveListener = (event: MouseEvent) =>
    this.mouseMove(event);
  private readonly mouseUpListener = (event: MouseEvent) => this.mouseUp(event);
  private readonly mouseLostListener = () => this.mouseLost();

  private readonly getPosition: PositionCalculator;
  private isDragging: boolean;
  private isCapturingInput: boolean;
  private initialPosition: ScreenPoint = { x: 0, y: 0 };

  constructor(
    private readonly inputArea: HTMLElement,
    positionCalculator?: PositionCalculator,
  ) {
    this.getPosition =
      positionCalculator || ((event) => this.defaultPositionCalculator(event));
    this.isDragging = false;
    this.isCapturingInput = false;
    this.inputArea.addEventListener('mousedown', this.mouseDownListener);
  }

  unload(): void {
    this.inputArea.removeEventListener('mousedown', this.mouseDownListener);
    this.interruptInputIfNecessary();
  }

  private mouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      // We stop propagation of the event to prevent stealing focus from the hidden textarea if there is text input.
      // Otherwise we may notice strange behavior in Firefox: when you input text and click outside the text to stop input
      // the new input is started from the position where you clicked.
      // This happens because the textarea loses the focus, the text input component reports about completed input
      // and then the new click starts new text input.
      event.stopPropagation();
      event.preventDefault();

      this.isCapturingInput = true;
      this.isDragging = false;
      this.initialPosition = this.getPosition(event);

      // We subscribe to window (not inputArea) events to get mouse input even when the mouse leaves the element
      this.subscribeToWindowEvents();
    }
  }

  private mouseMove(event: MouseEvent): void {
    if (this.isCapturingInput) {
      if (!this.isDragging) {
        this.dragStart.emit(this.initialPosition);
        this.isDragging = true;
      }

      this.dragMove.emit(this.getPosition(event));
    }
  }

  private mouseUp(event: MouseEvent): void {
    if (event.button === 0 && this.isCapturingInput) {
      this.unsubscribeFromWindowEvents();
      this.isCapturingInput = false;

      if (this.isDragging) {
        this.dragEnd.emit(this.getPosition(event));
        this.isDragging = false;
      } else {
        this.click.emit(this.initialPosition);
      }
    }
  }

  private mouseLost(): void {
    this.interruptInputIfNecessary();
  }

  private interruptInputIfNecessary(): void {
    if (this.isCapturingInput) {
      this.unsubscribeFromWindowEvents();
      this.isCapturingInput = false;

      if (this.isDragging) {
        this.dragLost.emit({});
      }
    }
  }

  private subscribeToWindowEvents(): void {
    window.addEventListener('mousemove', this.mouseMoveListener);
    window.addEventListener('mouseup', this.mouseUpListener);
    window.addEventListener('blur', this.mouseLostListener);
  }

  private unsubscribeFromWindowEvents(): void {
    window.removeEventListener('mousemove', this.mouseMoveListener);
    window.removeEventListener('mouseup', this.mouseUpListener);
    window.removeEventListener('blur', this.mouseLostListener);
  }

  private defaultPositionCalculator(event: MouseEvent): ScreenPoint {
    const rect = this.inputArea.getBoundingClientRect();
    const x = event.pageX - rect.left - window.pageXOffset;
    const y = event.pageY - rect.top - window.pageYOffset;

    return {
      x: x / rect.width,
      y: y / rect.height,
    };
  }
}
