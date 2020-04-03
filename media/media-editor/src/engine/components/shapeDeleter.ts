import { Component } from './component';
import { Signal } from '../signal';

export interface ShapeDeleter extends Component {
  // These methods are called by the core to notify about the availability of the delete operation
  deleteEnabled(): void;
  deleteDisabled(): void;

  // Signals that the user wants to delete the shape
  readonly deleteShape: Signal<{}>;
}

// The default implementation of ShapeDeleter interface.
// Accepts a hidden text area that receives text input when activated.
// When "delete" or "backspace" is pressed, it emits the deleteShape signal
export class DefaultShapeDeleter implements ShapeDeleter {
  readonly deleteShape = new Signal<{}>();

  private readonly keyDownListener = (event: KeyboardEvent) =>
    this.keyDown(event);
  private isDeleteEnabled: boolean = false;

  constructor(private readonly hTextArea: HTMLTextAreaElement) {
    this.hTextArea.addEventListener('keydown', this.keyDownListener);
  }

  unload(): void {
    this.hTextArea.removeEventListener('keydown', this.keyDownListener);
  }

  deleteEnabled(): void {
    this.hTextArea.style.visibility = 'visible';
    this.hTextArea.focus();
    this.isDeleteEnabled = true;
  }

  deleteDisabled(): void {
    this.hTextArea.style.visibility = 'hidden';
    this.hTextArea.value = '';
    this.isDeleteEnabled = false;
  }

  private keyDown(event: KeyboardEvent): void {
    if (!this.isDeleteEnabled) {
      return;
    }

    const isDeletePressed = event.key === 'Delete' || event.which === 46;
    const isBackspacePressed = event.key === 'Backspace' || event.which === 8;

    if (isDeletePressed || isBackspacePressed) {
      this.deleteShape.emit({});
    }
  }
}
