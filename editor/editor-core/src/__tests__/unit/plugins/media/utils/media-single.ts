import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { akEditorBreakoutPadding } from '@atlaskit/editor-shared-styles';
import { EditorState } from 'prosemirror-state';
import { buildLayoutForWidths } from '../../../../../plugins/layout/__tests__/unit/_utils';
import { calcMediaPxWidth } from '../../../../../plugins/media/utils/media-single';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';

describe('Media Single Utils', () => {
  const containerWidth = { width: 1920, lineLength: 760 };
  const origWidth = 100;
  const origHeight = 100;

  // Percent widths are calculated as x% of line length - resize handle gutter
  const fixedWidthPctMap: { [key: number]: number } = {
    20: 133,
    40: 290,
    50: 368,
    60: 447,
    80: 604,
    100: 760,
  };
  const fullWidthPctMap: { [key: number]: number } = {
    20: 341,
    40: 706,
    50: 888,
    60: 1071,
    80: 1436,
    100: 1800,
  };

  describe('calcMediaPxWidth', () => {
    let state: EditorState;
    let pos: number;
    const calcWidth = (
      opts: Partial<Parameters<typeof calcMediaPxWidth>[0]> = {},
    ): number =>
      calcMediaPxWidth({
        origWidth,
        origHeight,
        state,
        containerWidth,
        pos,
        ...opts,
      });

    beforeEach(() => {
      state = createEditorState(doc(p('{<>}')));
      pos = state.selection.from;
    });

    describe('wide media', () => {
      it('calculates correct width when smaller than line length', () => {
        const width = calcWidth({
          layout: 'wide',
        });
        expect(width).toBe(Math.round(containerWidth.lineLength * 1.33));
      });

      it('calculates correct width when bigger than page width', () => {
        const width = calcWidth({
          layout: 'wide',
          containerWidth: { width: 600, lineLength: containerWidth.lineLength },
        });
        expect(width).toBe(containerWidth.lineLength);
      });
    });

    describe('full-width media', () => {
      it('calculates correct width for media', () => {
        const width = calcWidth({
          layout: 'full-width',
        });
        expect(width).toBe(containerWidth.width - akEditorBreakoutPadding);
      });
    });

    describe('aligned media', () => {
      it('calculates correct width for media when smaller than 50% line length', () => {
        const width = calcWidth({
          layout: 'align-start',
        });
        expect(width).toBe(origWidth);
      });

      it('calculates correct width for media when bigger than 50% line length', () => {
        const width = calcWidth({
          origWidth: 2000,
          layout: 'align-start',
        });
        expect(width).toBe(containerWidth.lineLength * 0.5);
      });
    });

    describe('resized media', () => {
      /**
       * Percentage means percent of line length, not percent of image
       * For sizes < 100% there is a gutter taken into account for the resize handles
       */

      describe('full-width mode', () => {
        for (const pct in fullWidthPctMap) {
          it(`calculates correct width for media resized to ${pct}%`, () => {
            const width = calcWidth({
              pctWidth: +pct,
              containerWidth: { width: 1920, lineLength: 1800 },
            });
            expect(width).toBe(fullWidthPctMap[pct]);
          });
        }
      });

      describe('fixed-width mode', () => {
        for (const pct in fixedWidthPctMap) {
          it(`calculates correct width for media resized to ${pct}%`, () => {
            const width = calcWidth({ pctWidth: +pct });
            expect(width).toBe(fixedWidthPctMap[pct]);
          });
        }
      });

      describe('that is aligned', () => {
        it('calculates resized width when user has previously resized to < 50%', () => {
          const width = calcWidth({
            layout: 'align-start',
            pctWidth: 50,
            resizedPctWidth: 20,
          });
          expect(width).toBe(fixedWidthPctMap[20]);
        });

        it('calculates 50% width when user has previously resized to > 50%', () => {
          const width = calcWidth({
            layout: 'align-start',
            pctWidth: 50,
            resizedPctWidth: 80,
          });
          expect(width).toBe(fixedWidthPctMap[50]);
        });
      });

      describe('that is centred', () => {
        it('calculates previous resized width when user has previously resized media', () => {
          const width = calcWidth({
            layout: 'center',
            pctWidth: 50,
            resizedPctWidth: 80,
          });
          expect(width).toBe(fixedWidthPctMap[80]);
        });
      });
    });

    describe('centred media', () => {
      it('calculates previous resized width when user has previously resized media', () => {
        const width = calcWidth({
          layout: 'center',
          resizedPctWidth: 80,
        });
        expect(width).toBe(fixedWidthPctMap[80]);
      });

      it('calculates original width when < line length', () => {
        const width = calcWidth({
          layout: 'center',
        });
        expect(width).toBe(origWidth);
      });

      it('calculates line length when image width > line length', () => {
        const width = calcWidth({
          layout: 'center',
          origWidth: 2000,
        });
        expect(width).toBe(containerWidth.lineLength);
      });
    });

    describe('media inside layouts', () => {
      beforeEach(() => {
        state = createEditorState(doc(buildLayoutForWidths([50, 50], true)));
        pos = state.selection.from;
      });

      describe('media smaller than layout column', () => {
        describe('full-width mode', () => {
          it('calculates correct width for media', () => {
            const width = calcWidth({
              containerWidth: { width: 1920, lineLength: 1800 },
            });
            expect(width).toBe(origWidth);
          });

          it('calculates correct width for resized media', () => {
            const width = calcWidth({
              containerWidth: { width: 1920, lineLength: 1800 },
              pctWidth: 20,
            });
            expect(width).toBe(fullWidthPctMap[20]);
          });
        });

        describe('fixed-width mode', () => {
          it('calculates correct width for media', () => {
            const width = calcWidth();
            expect(width).toBe(origWidth);
          });

          it('calculates correct width for resized media', () => {
            const width = calcWidth({
              pctWidth: 20,
            });
            expect(width).toBe(fixedWidthPctMap[20]);
          });
        });
      });
    });
  });
});
