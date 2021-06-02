import { TextDirection } from '../../../common';
import { FontInfo } from './fontInfo';
import { Fragment } from './fragment';
import { renderText } from './textRenderer';
import { getCursorPositions } from './cursorPositions';

export interface ParagraphConfig {
  gl: WebGLRenderingContext;
  supplementaryCanvas: HTMLCanvasElement;
  textHelperDiv: HTMLDivElement;
  fontInfo: FontInfo;
}

// Holds fragments and cursor positions for one paragraph.
// Each fragment has two textures and the position. The paragraph is responsible for releasing the fragment textures.
// The position of the fragment is in the coordinates where the paragraph starts at (0, 0).
// Currently a paragraph can contain only one line, thus we store only x positions of the cursors.
export class Paragraph {
  private text: string = '';
  private direction: TextDirection = 'ltr';
  private fontSize: number = 0;
  private isValid: boolean = false; // indicates whether fragments or cursor positions were created for the last update

  private fragments: Array<Fragment> = []; // text fragments
  private cursorPositions: Array<number> = []; // x coordinates of the cursor positions
  // if a text contains N UTF-32 code units, we should have N + 1 cursor positions

  constructor(private config: ParagraphConfig) {}

  unload(isContextLost: boolean): void {
    this.destroy(isContextLost);
  }

  get textFragments(): Array<Fragment> {
    return this.fragments;
  }

  get textCursorPositions(): Array<number> {
    return this.cursorPositions;
  }

  update(text: string, direction: TextDirection, fontSize: number): boolean {
    if (
      text === this.text &&
      direction === this.direction &&
      fontSize === this.fontSize &&
      this.isValid
    ) {
      // The paragraph is up to date.
      // No need to recreate fragments or calculate cursor positions.
      return true;
    }

    this.text = text;
    this.direction = direction;
    this.fontSize = fontSize;
    this.destroy(false); // 'false' because we receive update() only when the context is valid
    this.cursorPositions = [];

    this.isValid = this.createFragments() && this.calculateCursorPositions();
    return this.isValid;
  }

  private destroy(isContextLost: boolean): void {
    this.fragments.forEach((fragment) => fragment.unload(isContextLost));
  }

  private createFragments(): boolean {
    this.fragments = [];

    const { text, direction, fontSize } = this;
    return renderText(this.fragments, {
      text,
      direction,
      fontSize,
      // TODO: Media migration to new repo - textHelperDiv is not expected
      ...(this.config as any),
    });
  }

  private calculateCursorPositions(): boolean {
    const { text, direction, fontSize } = this;
    const { textHelperDiv } = this.config;

    // We create a helper div, set its font and direction to the required and call getCursorPositions()
    const rootDiv = document.createElement('div');
    textHelperDiv.appendChild(rootDiv);

    rootDiv.style.font = FontInfo.getFontStyle(fontSize);
    rootDiv.style.direction = direction;
    this.cursorPositions = getCursorPositions(text, direction, rootDiv);

    textHelperDiv.removeChild(rootDiv);
    return true;
  }
}
