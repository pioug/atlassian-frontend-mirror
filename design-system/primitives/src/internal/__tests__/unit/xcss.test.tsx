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
    const { styles } = xcss({
      margin: '8px',
    });
    const expected = {
      margin: '8px',
    };

    expect(styles).toEqual(expected);
  });

  it('transforms token styles', () => {
    const { styles } = xcss({
      padding: 'space.100',
    });
    const expected = {
      padding: 'var(--ds-space-100, 8px)',
    };

    expect(styles).toEqual(expected);
  });

  it('does not transform non-transformable properties', () => {
    const { styles } = xcss({
      margin: '8px',
    });
    const expected = {
      margin: '8px',
    };

    expect(styles).toEqual(expected);
  });

  it('handles CSSObjects with both token styles and non-token styles', () => {
    const { styles } = xcss({
      borderColor: 'color.border',
      justifyContent: 'center',
    });
    const expected = {
      borderColor: 'var(--ds-border, #091e4221)',
      justifyContent: 'center',
    };

    expect(styles).toEqual(expected);
  });

  it('transforms pseudo classes', () => {
    const { styles } = xcss({
      ':hover': {
        display: 'flex',
        borderWidth: 'width.100',
      },
      ':visited': {
        borderWidth: 'width.050',
      },
    });
    const expected = {
      ':hover': {
        display: 'flex',
        borderWidth: 'var(--ds-width-100, 0.125rem)',
      },
      ':visited': {
        borderWidth: 'var(--ds-width-050, 0.0625rem)',
      },
    };

    expect(styles).toEqual(expected);
  });

  it('allows CSS transitions', () => {
    const { styles } = xcss({
      transition: 'all 0.3s',
    });
    const expected = {
      transition: 'all 0.3s',
    };

    expect(styles).toEqual(expected);
  });

  it('allows pseudo elements', () => {
    const { styles } = xcss({
      '::before': {
        content: '>',
      },
    });
    const expected = {
      '::before': {
        content: '>',
      },
    };

    expect(styles).toEqual(expected);
  });

  it('allows valid interpolated keys', () => {
    const keyVariable = ':hover';

    const { styles } = xcss({
      // eslint-disable-next-line @repo/internal/styles/no-nested-styles
      [keyVariable]: {
        gap: 'space.200',
      },
    });
    const expected = {
      ':hover': {
        gap: 'space.200',
      },
    };

    expect(styles).toEqual(expected);
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

    const { styles } = xcss([colorStyles, spacingStyles]);
    const expected = [
      {
        backgroundColor: 'var(--ds-background-brand-bold, #0052CC)',
        color: 'var(--ds-text, #172B4D)',
      },
      {
        paddingBlock: 'var(--ds-space-100, 8px)',
        paddingInline: 'var(--ds-space-200, 16px)',
      },
    ];

    expect(styles).toEqual(expected);
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

  //   expect(result).toEqual(expected);
  // });
});
