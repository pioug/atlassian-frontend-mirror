/* eslint-disable @repo/internal/react/consistent-css-prop-usage */
import * as emotion from '@emotion/react';

import { xcss } from '../../xcss';

describe('xcss()', () => {
  beforeEach(() => {
    // @ts-expect-error
    jest.spyOn(emotion, 'css').mockImplementation(styles => styles);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not transform non-token styles', () => {
    const styles = xcss({
      margin: '8px',
    });

    expect(styles).toMatchInlineSnapshot(`
      Object {
        Symbol(UNSAFE_INTERNAL_styles): Object {
          "margin": "8px",
        },
      }
    `);
  });

  it('transforms token styles', () => {
    const styles = xcss({
      padding: 'space.100',
      zIndex: 'blanket',
      color: 'color.text',
      boxShadow: 'overflow',
    });

    expect(styles).toMatchInlineSnapshot(`
      Object {
        Symbol(UNSAFE_INTERNAL_styles): Object {
          "boxShadow": "var(--ds-shadow-overflow, 0px 0px 8px #091e423f, 0px 0px 1px #091e424f)",
          "color": "var(--ds-text, #172B4D)",
          "padding": "var(--ds-space-100, 8px)",
          "zIndex": 500,
        },
      }
    `);
  });

  it('does not transform non-transformable properties', () => {
    const styles = xcss({
      margin: '8px',
    });

    expect(styles).toMatchInlineSnapshot(`
      Object {
        Symbol(UNSAFE_INTERNAL_styles): Object {
          "margin": "8px",
        },
      }
    `);
  });

  it('handles CSSObjects with both token styles and non-token styles', () => {
    const styles = xcss({
      borderColor: 'color.border',
      justifyContent: 'center',
    });

    expect(styles).toMatchInlineSnapshot(`
      Object {
        Symbol(UNSAFE_INTERNAL_styles): Object {
          "borderColor": "var(--ds-border, #091e4221)",
          "justifyContent": "center",
        },
      }
    `);
  });

  it('transforms pseudo classes', () => {
    const styles = xcss({
      ':hover': {
        display: 'flex',
        borderWidth: 'width.100',
      },
      ':visited': {
        borderWidth: 'width.050',
      },
    });

    expect(styles).toMatchInlineSnapshot(`
      Object {
        Symbol(UNSAFE_INTERNAL_styles): Object {
          ":hover": Object {
            "borderWidth": "var(--ds-width-100, 0.125rem)",
            "display": "flex",
          },
          ":visited": Object {
            "borderWidth": "var(--ds-width-050, 0.0625rem)",
          },
        },
      }
    `);
  });

  it('allows CSS transitions', () => {
    const styles = xcss({
      transition: 'all 0.3s',
    });

    expect(styles).toMatchInlineSnapshot(`
      Object {
        Symbol(UNSAFE_INTERNAL_styles): Object {
          "transition": "all 0.3s",
        },
      }
    `);
  });

  it('allows pseudo elements', () => {
    const styles = xcss({
      '::before': {
        content: '>',
      },
    });

    expect(styles).toMatchInlineSnapshot(`
      Object {
        Symbol(UNSAFE_INTERNAL_styles): Object {
          "::before": Object {
            "content": ">",
          },
        },
      }
    `);
  });

  it('allows valid interpolated keys', () => {
    const keyVariable = ':hover';

    const styles = xcss({
      // eslint-disable-next-line @repo/internal/styles/no-nested-styles
      [keyVariable]: {
        gap: 'space.200',
      },
    });

    expect(styles).toMatchInlineSnapshot(`
      Object {
        Symbol(UNSAFE_INTERNAL_styles): Object {
          ":hover": Object {
            "gap": "var(--ds-space-200, 16px)",
          },
        },
      }
    `);
  });

  it('allows non-token values to be passed through for tokenisable properties', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(jest.fn);

    const styles = xcss({
      // @ts-expect-error
      padding: '10px',
      // @ts-expect-error
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      color: '#F0F0F0',
      // @ts-expect-error
      top: 0,
    });

    expect(warn).toBeCalledTimes(3);
    expect(styles).toMatchInlineSnapshot(`
      Object {
        Symbol(UNSAFE_INTERNAL_styles): Object {
          "color": "#F0F0F0",
          "padding": "10px",
          "top": 0,
        },
      }
    `);
    warn.mockReset();
  });

  it('throws on unsupported selectors', () => {
    process.env.NODE_ENV = 'development';
    [
      { '.container': { gap: 'space.200' } },
      { '#some-id': { gap: 'space.200' } },
      { '[data-testid="beep"]': { gap: 'space.200' } },
      { 'div[aria-labelledby="boop"]': { gap: 'space.200' } },
      { '> *': { gap: 'space.200' } },
      { '&': { gap: 'space.200' } },
      { '&&': { gap: 'space.200' } },
    ].forEach(style => {
      // @ts-expect-error
      expect(() => xcss(style)).toThrow();
    });
  });

  it('supports arrays', () => {
    const colorStyles = {
      backgroundColor: 'brand.bold',
      color: 'color.text',
    } as const;
    const spacingStyles = {
      paddingBlock: 'space.100',
      paddingInline: 'space.200',
    } as const;

    const styles = xcss([colorStyles, spacingStyles]);

    expect(styles).toMatchInlineSnapshot(`
      Object {
        Symbol(UNSAFE_INTERNAL_styles): Array [
          Object {
            "backgroundColor": "var(--ds-background-brand-bold, #0052CC)",
            "color": "var(--ds-text, #172B4D)",
          },
          Object {
            "paddingBlock": "var(--ds-space-100, 8px)",
            "paddingInline": "var(--ds-space-200, 16px)",
          },
        ],
      }
    `);
  });

  // TODO: Uncomment these when dealing with responsiveness
  // it('allows ', () => {
  //   const result = xcss({
  //     padding: 'space.100',
  //     ':hover': {
  //       // Are we allowing nested selectors like this?
  //       'below-md': {
  //         padding: 'space.100',
  //       },
  //     },
  //   });

  //   const expected = {};

  //   expect(result).toMatchInlineSnapshot()
  // });
});
