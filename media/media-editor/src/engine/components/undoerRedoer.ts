import { Component } from './component';
import { Signal } from '../signal';
import { isMac, isWindows } from './platformDetector';

export interface UndoerRedoer extends Component {
  // These methods are called by the core to notify about the availability of the undo operation
  undoEnabled(): void;

  undoDisabled(): void;

  // These methods are called by the core to notify about the availability of the redo operation
  redoEnabled(): void;

  redoDisabled(): void;

  // Signals that the user wants to delete the shape
  readonly undo: Signal<{}>;
  readonly redo: Signal<{}>;
}

export class DefaultUndoerRedoer implements UndoerRedoer {
  readonly undo = new Signal<{}>();
  readonly redo = new Signal<{}>();

  private readonly keyDownListener = (event: KeyboardEvent) =>
    this.keyDown(event);
  private isUndoEnabled: boolean = false;
  private isRedoEnabled: boolean = false;

  constructor() {
    document.addEventListener('keydown', this.keyDownListener);
  }

  unload(): void {
    document.removeEventListener('keydown', this.keyDownListener);
  }

  undoEnabled(): void {
    this.isUndoEnabled = true;
  }

  undoDisabled(): void {
    this.isUndoEnabled = false;
  }

  redoEnabled(): void {
    this.isRedoEnabled = true;
  }

  redoDisabled(): void {
    this.isRedoEnabled = false;
  }

  private keyDown(event: KeyboardEvent): void {
    const isModKeyPressed = isMac() ? event.metaKey : event.ctrlKey;

    const yKeyWithoutShift = event.key === 'y' && !event.shiftKey;
    const zKeyWithShift = event.key === 'z' && event.shiftKey;
    const zKeyWithoutShift = event.key === 'z' && !event.shiftKey;

    if (this.isUndoEnabled && isModKeyPressed && zKeyWithoutShift) {
      this.undo.emit({});
      event.preventDefault();
    }
    if (
      this.isRedoEnabled &&
      isModKeyPressed &&
      (isWindows() ? yKeyWithoutShift : zKeyWithShift)
    ) {
      this.redo.emit({});
      event.preventDefault();
    }
  }
}
