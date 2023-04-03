import {
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutLineLength,
  akEditorFullWidthLayoutWidth,
  akEditorSwoopCubicBezier,
} from '@atlaskit/editor-shared-styles';

import {
  absoluteBreakoutWidth,
  breakoutConsts,
  calculateBreakoutStyles,
} from '../breakout';

describe('breakout utils', () => {
  describe('calculateBreakoutStyles', () => {
    it('should return with type "line-length-unknown" when widthStateLineLength is not provided', () => {
      const breakoutStyles = calculateBreakoutStyles({
        mode: 'full-width',
        widthStateWidth: 0,
      });
      expect(breakoutStyles.type).toBe('line-length-unknown');
    });
    it('should return with type "line-length-known" when widthStateLineLength is provided', () => {
      const breakoutStyles = calculateBreakoutStyles({
        mode: 'full-width',
        widthStateWidth: 1200,
        widthStateLineLength: 800,
      });
      expect(breakoutStyles.type).toBe('line-length-known');
    });

    // note: these tests are using random values
    // the logic powering this method pre existed these tests
    // and the intent of these tests is to avoid regressions.
    it('should have consistent results for default width', () => {
      const breakoutStyles1 = calculateBreakoutStyles({
        mode: 'wide',
        widthStateWidth: breakoutConsts.defaultLayoutWidth,
        widthStateLineLength: breakoutConsts.defaultLayoutWidth,
      });
      expect(breakoutStyles1).toMatchInlineSnapshot(`
        Object {
          "marginLeft": "50%",
          "minWidth": undefined,
          "transform": "translateX(-50%)",
          "transition": "min-width 0.5s ${akEditorSwoopCubicBezier}",
          "type": "line-length-known",
          "width": "100%",
        }
      `);

      const breakoutStyles2 = calculateBreakoutStyles({
        mode: 'full-width',
        widthStateWidth: breakoutConsts.defaultLayoutWidth + 100,
        widthStateLineLength: breakoutConsts.defaultLayoutWidth,
      });
      expect(breakoutStyles2).toMatchInlineSnapshot(`
        Object {
          "marginLeft": "50%",
          "minWidth": 764,
          "transform": "translateX(-50%)",
          "transition": "min-width 0.5s ${akEditorSwoopCubicBezier}",
          "type": "line-length-known",
          "width": "764px",
        }
      `);

      const breakoutStyles3 = calculateBreakoutStyles({
        mode: 'full-width',
        widthStateWidth: breakoutConsts.defaultLayoutWidth + 200,
        widthStateLineLength: breakoutConsts.defaultLayoutWidth,
      });
      expect(breakoutStyles3).toMatchInlineSnapshot(`
        Object {
          "marginLeft": "50%",
          "minWidth": 864,
          "transform": "translateX(-50%)",
          "transition": "min-width 0.5s ${akEditorSwoopCubicBezier}",
          "type": "line-length-known",
          "width": "864px",
        }
      `);
    });
  });

  // note: these tests are using random values
  // the logic powering this method pre existed these tests
  // and the intent of these tests is to avoid regressions.
  it('should have consistent results for full width layout', () => {
    const breakoutStyles1 = calculateBreakoutStyles({
      mode: 'full-width',
      widthStateWidth: akEditorFullWidthLayoutWidth,
      widthStateLineLength: akEditorFullWidthLayoutLineLength,
    });
    expect(breakoutStyles1).toMatchInlineSnapshot(`
      Object {
        "marginLeft": "50%",
        "minWidth": 1704,
        "transform": "translateX(-50%)",
        "transition": "min-width 0.5s ${akEditorSwoopCubicBezier}",
        "type": "line-length-known",
        "width": "1704px",
      }
    `);

    const breakoutStyles2 = calculateBreakoutStyles({
      mode: 'full-width',
      widthStateWidth: akEditorFullWidthLayoutWidth + 100,
      widthStateLineLength: akEditorFullWidthLayoutLineLength,
    });
    expect(breakoutStyles2).toMatchInlineSnapshot(`
      Object {
        "marginLeft": "50%",
        "minWidth": 1800,
        "transform": "translateX(-50%)",
        "transition": "min-width 0.5s ${akEditorSwoopCubicBezier}",
        "type": "line-length-known",
        "width": "1800px",
      }
    `);

    const breakoutStyles3 = calculateBreakoutStyles({
      mode: 'full-width',
      widthStateWidth: akEditorFullWidthLayoutWidth - 100,
      widthStateLineLength: akEditorFullWidthLayoutLineLength - 100,
    });
    expect(breakoutStyles3).toMatchInlineSnapshot(`
      Object {
        "marginLeft": "50%",
        "minWidth": 1604,
        "transform": "translateX(-50%)",
        "transition": "min-width 0.5s ${akEditorSwoopCubicBezier}",
        "type": "line-length-known",
        "width": "1604px",
      }
    `);
  });

  describe('absoluteBreakoutWidth', () => {
    it('default width - should return 760 for regular screens', () => {
      const breakoutWidth = absoluteBreakoutWidth('default', 1920);
      expect(breakoutWidth).toBe(akEditorDefaultLayoutWidth);
    });

    it('default width - should return 760 for larger screens', () => {
      const breakoutWidth = absoluteBreakoutWidth('default', 2700);
      expect(breakoutWidth).toBe(akEditorDefaultLayoutWidth);
    });

    it('wide width - should return 1011 for regular screens', () => {
      const breakoutWidth = absoluteBreakoutWidth('wide', 1920);
      expect(breakoutWidth).toBe(1011);
    });

    it('wide width - should return 1011 for larger screens', () => {
      const breakoutWidth = absoluteBreakoutWidth('wide', 3000);
      expect(breakoutWidth).toBe(1011);
    });

    it('full-width - should return 1800 for regular screens', () => {
      const breakoutWidth = absoluteBreakoutWidth('full-width', 1920);
      expect(breakoutWidth).toBe(akEditorFullWidthLayoutWidth);
    });

    it('full-width - should return 1800 for larger screens', () => {
      const breakoutWidth = absoluteBreakoutWidth('full-width', 3000);
      expect(breakoutWidth).toBe(akEditorFullWidthLayoutWidth);
    });
  });
});
