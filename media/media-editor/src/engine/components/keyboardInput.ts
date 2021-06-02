import { Component } from './component';
import { Signal } from '../signal';
import { getUtf32Codes } from '../../util';

export type InputCommand =
  | 'complete'
  | 'newline'
  | 'backspace'
  | 'delete'
  | 'left'
  | 'right'
  | 'up'
  | 'down';

// Conversion of special key codes to input commands
const inputCommands: { [code: number]: InputCommand } = {
  27: 'complete', // Esc
  8: 'backspace', // Backspace
  13: 'newline', // Enter
  46: 'delete', // Delete
  40: 'down', // Arrow down
  38: 'up', // Arrow up
  37: 'left', // Arrow left
  39: 'right', // Arrow right
};

export interface KeyboardInput extends Component {
  // These functions are called by the core to notify about input start or input end
  startInput(): void;
  endInput(): void;

  characterPressed: Signal<number>; // provides a UTF-32 code of the pressed character
  inputCommand: Signal<InputCommand>;

  readonly supplementaryCanvas: HTMLCanvasElement; // hidden canvas which will be used for text rendering
  readonly textHelperDiv: HTMLDivElement; // hidden helper div in which the typesetter will create temporary spans when necessary;
  // it should be hidden with 'visibility: hidden', but not with 'display: none' because
  // the typesetter will call getCoundingClientRect() for temporary spans.
  // it should have 'white-space: pre' to preserve multiple whitespace characters and not to break lines.
}

// The default implementation of KeyboardInput interface.
// Accepts a hidden text area which will receive text input.
// The hidden text area should have 'hidden' visibility, but not 'display: none'.
export class DefaultKeyboardInput implements KeyboardInput {
  readonly characterPressed = new Signal<number>();
  readonly inputCommand = new Signal<InputCommand>();

  private readonly inputListener = () => this.input();
  private readonly compositionStartListener = () => this.compositionStart();
  private readonly compositionEndListener = () => this.compositionEnd();
  private readonly keyUpListener = () => this.keyUp();
  private readonly keyDownListener = (event: KeyboardEvent) =>
    this.keyDown(event);
  private readonly blurListener = () => this.blur();

  private isInputActive: boolean = false;
  private isComposing: boolean = false;
  private readCompositionResultOnKeyUp: boolean = false;

  constructor(
    private hTextArea: HTMLTextAreaElement,
    public readonly supplementaryCanvas: HTMLCanvasElement,
    public readonly textHelperDiv: HTMLDivElement,
  ) {
    this.subscribeToTextAreaEvents();
  }

  unload(): void {
    this.unsubscribeFromTextAreaEvents();
  }

  startInput(): void {
    // Called by the core when it is ready to accept text input
    this.isInputActive = true;

    this.hTextArea.style.visibility = 'visible';
    this.acquireFocus();
  }

  endInput(): void {
    // Called by the core when it no longer needs text input
    this.isInputActive = false;
    this.isComposing = false;
    this.readCompositionResultOnKeyUp = false;

    this.hTextArea.style.visibility = 'hidden';
  }

  private subscribeToTextAreaEvents(): void {
    const hTextArea = this.hTextArea;

    hTextArea.addEventListener('input', this.inputListener);
    hTextArea.addEventListener(
      'compositionstart',
      this.compositionStartListener,
    );
    hTextArea.addEventListener('compositionend', this.compositionEndListener);
    hTextArea.addEventListener('keyup', this.keyUpListener);
    hTextArea.addEventListener('keydown', this.keyDownListener);
    hTextArea.addEventListener('blur', this.blurListener);
  }

  private unsubscribeFromTextAreaEvents(): void {
    const hTextArea = this.hTextArea;

    hTextArea.removeEventListener('input', this.inputListener);
    hTextArea.removeEventListener(
      'compositionstart',
      this.compositionStartListener,
    );
    hTextArea.removeEventListener(
      'compositionend',
      this.compositionEndListener,
    );
    hTextArea.removeEventListener('keyup', this.keyUpListener);
    hTextArea.removeEventListener('keydown', this.keyDownListener);
    hTextArea.removeEventListener('blur', this.blurListener);
  }

  private input(): void {
    // Composition starts when the IME panel (for Chinese, Japanese, etc.) appears.
    // In this case the input is necessary for this panel to choose the correct hieroglyph, not for us.
    // We should read characters only when there is no composition.
    if (!this.isComposing) {
      this.passText();
    }
  }

  private compositionStart(): void {
    // We will get this notification when the IME panel (for Chinese, Japanese, etc.) appears.
    // At this point there is no input for us to pass to the core.
    this.isComposing = true;
    this.readCompositionResultOnKeyUp = false;
  }

  private compositionEnd(): void {
    // We get this notification when the IME panel disappears
    this.isComposing = false;

    // In Safari at this point the value of the hidden text area contains the original text, not composed.
    // Thus we'll catch the updated text in keyup. For that we set readCompositionResultOnKeyUp to true.
    // All tested browsers fire keyup after compositionend.
    this.readCompositionResultOnKeyUp = true;
  }

  private keyUp(): void {
    // The only purpose of listening to this event is to get the composition result
    if (this.readCompositionResultOnKeyUp) {
      this.passText();
      this.readCompositionResultOnKeyUp = false;
    }
  }

  private keyDown(event: KeyboardEvent): void {
    const command = inputCommands[event.which || event.keyCode];
    if (command) {
      event.stopPropagation();
      event.preventDefault();
      this.inputCommand.emit(command);
    }
  }

  private blur(): void {
    if (this.isInputActive) {
      // If our text area is blurred, we try to restore the focus.
      // If we can't do this, we inform the core that the input has been completed (this.acquireFocus() does this).
      this.acquireFocus();
    }
  }

  private acquireFocus(): void {
    this.hTextArea.focus();

    // If we can't get the focus we inform the core that the input is complete.
    // The core will call endInput() automatically
    if (document.activeElement !== this.hTextArea) {
      this.inputCommand.emit('complete');
    }
  }

  private passText(): void {
    const text = this.hTextArea.value;
    if (text) {
      getUtf32Codes(text).forEach((code) => this.characterPressed.emit(code));
      this.hTextArea.value = '';
    }
  }
}
