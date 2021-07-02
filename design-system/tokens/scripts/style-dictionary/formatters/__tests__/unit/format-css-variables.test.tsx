import formatter from '../../format-css-variables';

describe('formatter', () => {
  it('should parse token', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'brand',
            value: '#ffffff',
            path: ['color', 'brand'],
            attributes: { group: 'paint' },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any)
      .split('html')
      .pop();

    expect(result).toEqual(`[data-theme="dark"] {
  --brand: #ffffff;
}
`);
  });

  it('should preserve camelCase tokens', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'colorAccent',
            value: '#ffffff',
            path: ['color', 'colorAccent'],
            attributes: { group: 'paint' },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any)
      .split('html')
      .pop();

    expect(result).toEqual(`[data-theme="dark"] {
  --colorAccent: #ffffff;
}
`);
  });

  it('should omit palette tokens', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'B900',
            value: '#ffffff',
            path: ['color', 'B900'],
            attributes: {
              group: 'paint',
              isPalette: true,
            },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any)
      .split('html')
      .pop();

    expect(result).toEqual('[data-theme="dark"] {\n}\n');
  });

  it('should parse nested token', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'accent',
            value: '#ffffff',
            path: ['color', 'accent'],
            attributes: { group: 'paint' },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any)
      .split('html')
      .pop();

    expect(result).toEqual(`[data-theme="dark"] {
  --accent: #ffffff;
}
`);
  });

  it('should parse deeply nested token', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'brand',
            value: '#ffffff',
            path: ['color', 'accent', 'brand'],
            attributes: { group: 'paint' },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any)
      .split('html')
      .pop();

    expect(result).toEqual(`[data-theme="dark"] {
  --accent-brand: #ffffff;
}
`);
  });
});
