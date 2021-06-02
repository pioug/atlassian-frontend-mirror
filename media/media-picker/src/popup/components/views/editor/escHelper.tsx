export type EscHandler = () => void;

/**
 * Subscribes to the window 'keydown' event, calls escHandler when ESC is pressed.
 * Call unload() to unsubscribe from the window event.
 */
export class EscHelper {
  private readonly keyDownListener: (event: KeyboardEvent) => void;

  constructor(private readonly escHandler: EscHandler) {
    this.keyDownListener = (event) => this.onKeyDown(event);

    window.addEventListener('keydown', this.keyDownListener);
    window.focus();
  }

  teardown() {
    window.removeEventListener('keydown', this.keyDownListener);
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.which === 27) {
      this.escHandler();
    }
  }
}
