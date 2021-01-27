export class ElementSelection {
  public readonly type: string;
  public readonly range?: Range;

  private constructor(selection: Selection | null) {
    this.type = selection ? selection.type : 'None';

    if (selection && this.type !== 'None') {
      this.range = selection.getRangeAt(0);
    }
  }

  public eq(selection?: ElementSelection) {
    if (!selection) {
      return false;
    }

    if (this.range && selection.range) {
      const startMatches =
        this.range?.compareBoundaryPoints(
          Range.START_TO_START,
          selection.range,
        ) === 0;

      const endMatches =
        this.range?.compareBoundaryPoints(Range.END_TO_END, selection.range) ===
        0;

      return startMatches && endMatches;
    }

    return this.type === 'None' && selection.type === 'None';
  }

  public inside(el: HTMLElement) {
    return el.contains(this.range?.commonAncestorContainer ?? null);
  }

  public select(el: HTMLElement): ElementSelection {
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();

    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    return ElementSelection.fromWindow();
  }

  public static fromWindow(win: Window = window) {
    return new ElementSelection(win.getSelection());
  }
}
