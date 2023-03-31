import { transformStyles } from '../../xcss';

describe('transformStyles()', () => {
  it('does not transform non-token styles', () => {
    const result = transformStyles({
      margin: '8px',
    });
    const expected = {
      margin: '8px',
    };

    expect(result).toEqual(expected);
  });

  it('gracefully handles invalid values', () => {
    [undefined, null, '', 'padding: 8px'].forEach(value => {
      // @ts-ignore
      const result = transformStyles(value);

      expect(result).toEqual(value);
    });
  });

  it('gracefully handles invalid nested values', () => {
    // @ts-ignore
    const result = transformStyles({
      ':hover': 'display: flex;',
    });
    const expected = {
      ':hover': 'display: flex;',
    };

    expect(result).toEqual(expected);
  });

  it('transforms token styles', () => {
    const result = transformStyles({
      padding: 'space.100',
    });
    const expected = {
      padding: 'var(--ds-space-100, 8px)',
    };

    expect(result).toEqual(expected);
  });

  it("throws on valid properties that don't have a token value", () => {
    const styles = {
      padding: '8px',
    };

    expect(() => transformStyles(styles)).toThrow();
  });

  it('does not transform non-transformable properties', () => {
    const result = transformStyles({
      margin: '8px',
    });
    const expected = {
      margin: '8px',
    };

    expect(result).toEqual(expected);
  });

  it('handles CSSObjects with both token styles and non-token styles', () => {
    const result = transformStyles({
      borderColor: 'color.border',
      justifyContent: 'center',
    });
    const expected = {
      borderColor: 'var(--ds-border, #091e4221)',
      justifyContent: 'center',
    };

    expect(result).toEqual(expected);
  });

  it('transforms pseudo classes', () => {
    const result = transformStyles({
      ':hover': {
        display: 'flex',
        borderWidth: 'size.100',
      },
      ':visited': {
        borderWidth: 'size.050',
      },
    });
    const expected = {
      ':hover': {
        display: 'flex',
        borderWidth: 'var(--ds-width-100, 2px)',
      },
      ':visited': {
        borderWidth: 'var(--ds-width-050, 1px)',
      },
    };

    expect(result).toEqual(expected);
  });

  it('allows CSS transitions', () => {
    const result = transformStyles({
      transition: 'all 0.3s',
    });
    const expected = {
      transition: 'all 0.3s',
    };

    expect(result).toEqual(expected);
  });

  it('gracefully handles invalid pseudo classes', () => {
    const result = transformStyles({
      ':hodor': {},
    });
    const expected = {
      ':hodor': {},
    };

    expect(result).toEqual(expected);
  });

  it('allows pseudo elements', () => {
    const result = transformStyles({
      '::before': {
        content: '>',
      },
    });
    const expected = {
      '::before': {
        content: '>',
      },
    };

    expect(result).toEqual(expected);
  });

  it('allows interpolated keys', () => {
    const keyVariable = ':hover';

    const result = transformStyles({
      [keyVariable]: {
        gap: 'space.200',
      },
    });
    const expected = {
      ':hover': {
        gap: 'space.200',
      },
    };

    expect(result).toEqual(expected);
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
      expect(() => transformStyles(style)).toThrow();
    });
  });

  it('supports arrays', () => {
    const colorStyles = {
      backgroundColor: 'brand.bold',
      color: 'color.text',
    };
    const spacingStyles = {
      paddingBlock: 'space.100',
      paddingInline: 'space.200',
    };

    const result = transformStyles([colorStyles, spacingStyles]);
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

    expect(result).toEqual(expected);
  });

  // TODO: Uncomment these when dealing with responsiveness
  // it('allows ', () => {
  //   const result = transformStyles({
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
