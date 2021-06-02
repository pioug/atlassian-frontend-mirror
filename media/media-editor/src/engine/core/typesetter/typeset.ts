import { TextDirection } from '../../../common';
import * as Core from '../binaries/mediaEditor';
import { FontInfo, FontMetrics } from './fontInfo';
import { Fragment, FragmentPosition } from './fragment';
import { Paragraph } from './paragraph';
import { adjustSize } from '../../../util';

export interface TypesetConfig {
  gl: WebGLRenderingContext;
  supplementaryCanvas: HTMLCanvasElement;
  textHelperDiv: HTMLDivElement;
  fontInfo: FontInfo;
  module: Core.NativeModule;
}

const defaultFontMetrics: FontMetrics = {
  lineHeight: 0,
  descent: 0,
};

// Each fragment has position assuming that the paragraph it belongs to starts from (0, 0).
// To display fragments correctly we need to store the y coordinate where the paragraph starts.
interface StoredFragment {
  fragment: Fragment;
  yline: number;
}

// Each text model stored in the core has a corresponding typeset.
// When a model is changed, the core calls 'update()'.
//
// Paragraphs are separated with the character '\n'. Currently each paragraph is one line.
//
// A typeset must provide text fragments and cursor positions.
//
// A fragment consists of:
//   - two alpha textures: one for the text per se and one for the stroke (outline); they should be bound when requested;
//   - position of the text fragment assuming that the text origin is in (0, 0).
//
// For the text containing N characters the typeset must produce N + 1 cursor positions. Each of them is a point with two values x and y.
// Line height and descent are used to render the cursor. Cursor positions for subsequent lines must have y coordinates that differ
// exactly in line height.
export class Typeset implements Core.TypesetInterop {
  private isContextLost: boolean = false;
  private fontMetrics: FontMetrics = defaultFontMetrics;

  // We store paragraphs of text and update them when necessary.
  // Fragments are owned by paragraphs, paragraphs are responsible for their lifetime,
  // here we store fragments only to implement Core.TypesetInterop conveniently.
  private paragraphs: Array<Paragraph> = [];
  private fragments: Array<StoredFragment> = [];

  constructor(private readonly config: TypesetConfig) {}

  unload(): void {
    // might be called multiple times
    this.destroy();
  }

  contextLost(): void {
    this.isContextLost = true;
    this.destroy();
  }

  contextRestored(): void {
    this.isContextLost = false;
  }

  // Updates the typeset with the new text. Passes the following arguments:
  //   text - the text to typeset
  //   textLength - the length of the text line (in UTF-32 code units)
  //   direction - text direction: 'ltr' or 'rtl'
  //   fontSize - font size in pixels
  //   cursorArray - array to be filled in with cursor data, the memory is pre-allocated in Emscripten heap
  //                 for  2 * (textLength + 1)  32-bit integers (x and y coordinates for cursor positions)
  //
  // Returns true if the update was successful
  // If the result is false, the core will not call the other functions from Core.TypesetInterop.
  update(
    text: string,
    textLength: number,
    direction: string,
    fontSize: number,
    cursorArray: number,
  ): boolean {
    if (this.isContextLost) {
      // sanity check because we manipulate textures during update
      return false;
    }

    this.fontMetrics = this.config.fontInfo.getFontMetrics(fontSize);

    return (
      this.updateParagraphs(text, direction as TextDirection, fontSize) &&
      this.collectParagraphData(cursorArray, textLength + 1)
    );
  }

  // After update is completed successfully, the following functions are available:

  getFragmentCount(): number {
    return this.fragments.length;
  }

  bindNormal(fragmentIndex: number): boolean {
    return this.bindFragmentTexture(fragmentIndex, (fragment) =>
      fragment.bindNormal(),
    );
  }

  bindStroke(fragmentIndex: number): boolean {
    return this.bindFragmentTexture(fragmentIndex, (fragment) =>
      fragment.bindStroke(),
    );
  }

  getXBase(fragmentIndex: number): number {
    return this.getFragmentCoordinate(fragmentIndex, (pos) => pos.xbase);
  }

  getYBase(fragmentIndex: number): number {
    return this.getFragmentCoordinate(
      fragmentIndex,
      (pos, yline) => pos.ybase + yline,
    );
  }

  getXOpposite(fragmentIndex: number): number {
    return this.getFragmentCoordinate(fragmentIndex, (pos) => pos.xopposite);
  }

  getYOpposite(fragmentIndex: number): number {
    return this.getFragmentCoordinate(
      fragmentIndex,
      (pos, yline) => pos.yopposite + yline,
    );
  }

  getLineHeight(): number {
    return this.fontMetrics.lineHeight;
  }

  getDescent(): number {
    return this.fontMetrics.descent;
  }

  private destroy() {
    // We should not release fragments explicitly because fragments are owned by paragraphs and released when we release paragraphs,
    // fragments are stored here only for convenience.
    this.fragments = [];
    this.paragraphs.forEach((par) => par.unload(this.isContextLost));
    this.paragraphs = [];
  }

  private bindFragmentTexture(
    index: number,
    bindMethod: (fragment: Fragment) => boolean,
  ): boolean {
    return bindMethod(this.fragments[index].fragment);
  }

  private getFragmentCoordinate(
    index: number,
    getter: (position: FragmentPosition, yline: number) => number,
  ): number {
    const { fragment, yline } = this.fragments[index];
    return getter(fragment.position, yline);
  }

  private updateParagraphs(
    text: string,
    direction: TextDirection,
    fontSize: number,
  ): boolean {
    // Paragraphs are separated by '\n'. Currently one paragraph contains one line
    const paragraphTexts = text.split('\n');

    // We don't recreate, we reuse paragraphs.
    // So we need the same number of paragraphs as the number of texts that we got in paragraphTexts array.
    adjustSize<Paragraph>(
      this.paragraphs,
      paragraphTexts.length,
      () => {
        return new Paragraph(this.config);
      },
      (paragraph: Paragraph) => {
        // paragraphs contain textures and must be released explicitly
        paragraph.unload(this.isContextLost);
      },
    );

    // Update each paragraph. The lengths of this.paragraphs and paragraphTexts are the same
    return this.paragraphs.every((paragraph, index) => {
      return paragraph.update(paragraphTexts[index], direction, fontSize);
    });
  }

  private collectParagraphData(
    cursorArray: number,
    cursorPosCount: number,
  ): boolean {
    // Since every paragraph is successfully updated, we need to collect fragments and cursor positions
    return (
      this.collectFragments() &&
      this.collectCursorPositions(cursorArray, cursorPosCount)
    );
  }

  private collectFragments(): boolean {
    // For fragments we will record each fragment and the y coordinate of the line
    // (currently one paragraph contains only one line).
    this.fragments = []; // we don't own fragments (paragraphs do), so we don't need to delete textures explicitly
    const { lineHeight } = this.fontMetrics;

    this.paragraphs.forEach((par, parIndex) => {
      const yline = -parIndex * lineHeight;

      par.textFragments.forEach((fragment) => {
        this.fragments.push({ fragment, yline });
      });
    });

    return true;
  }

  private collectCursorPositions(
    cursorArray: number,
    cursorPosCount: number,
  ): boolean {
    // For cheaper interoperation the core preallocates the array in Emscripten memory heap.
    // 'cursorArray' is the offset in this 32-bit heap.
    // We must populate this array with the values from paragraphs.
    //
    // This array contains (cursorPosCount * 2) 32-bit numbers. For each cursor position it should store
    // firstly x and then y coordinate.
    // For example, if we have 3 cursor positions (12, -5), (16, -11), (22, -11) the core expects the array:
    // [12, -5, 16, -11, 22, -11]
    // which contains 6 elements

    const count = 2 * cursorPosCount; // number of elements in the array
    const heapBase = this.config.module.HEAP32.buffer;
    const array = new Int32Array(heapBase, cursorArray, count);
    let index = 0;
    const { lineHeight } = this.fontMetrics;

    this.paragraphs.forEach((par, parIndex) => {
      const yline = Math.round(-parIndex * lineHeight);

      par.textCursorPositions.forEach((x) => {
        if (index < count - 1) {
          // We must check the limits for not to destroy heap data
          array[index] = Math.round(x);
          array[index + 1] = yline;
        }

        index += 2;
      });
    });

    return true;
  }
}
