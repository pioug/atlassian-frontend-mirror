import { cssVariableFormatter as formatter } from '../../css-variables';

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
    } as any);

    expect(result).toMatchInlineSnapshot(`
      "html[data-theme~=\\"dark\\"] {
        --ds-brand: #ffffff;
      }

      @media (prefers-color-scheme: dark) {
        html[data-color-mode=\\"auto\\"] {
          --ds-brand: #ffffff;
        }
      }
      "
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
    } as any);

    expect(result).toMatchInlineSnapshot(`
      "html[data-theme~=\\"dark\\"] {
        --ds-colorAccent: #ffffff;
      }

      @media (prefers-color-scheme: dark) {
        html[data-color-mode=\\"auto\\"] {
          --ds-colorAccent: #ffffff;
        }
      }
      "
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
              group: 'palette',
            },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any);

    expect(result).toMatchInlineSnapshot(
      `
      "html[data-theme~=\\"dark\\"] {
      }

      @media (prefers-color-scheme: dark) {
        html[data-color-mode=\\"auto\\"] {
        }
      }
      "
    `,
    );
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
    } as any);

    expect(result).toMatchInlineSnapshot(`
      "html[data-theme~=\\"dark\\"] {
        --ds-accent: #ffffff;
      }

      @media (prefers-color-scheme: dark) {
        html[data-color-mode=\\"auto\\"] {
          --ds-accent: #ffffff;
        }
      }
      "
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
    } as any);

    expect(result).toMatchInlineSnapshot(`
      "html[data-theme~=\\"dark\\"] {
        --ds-accent-brand: #ffffff;
      }

      @media (prefers-color-scheme: dark) {
        html[data-color-mode=\\"auto\\"] {
          --ds-accent-brand: #ffffff;
        }
      }
      "
    `);
  });

  it('should omit [default] keywords in token paths', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: '[default]',
            value: '#ffffff',
            path: ['color', 'background', 'brand', '[default]'],
            attributes: {
              group: 'paint',
            },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any);

    expect(result).toMatchInlineSnapshot(`
      "html[data-theme~=\\"dark\\"] {
        --ds-background-brand: #ffffff;
      }

      @media (prefers-color-scheme: dark) {
        html[data-color-mode=\\"auto\\"] {
          --ds-background-brand: #ffffff;
        }
      }
      "
    `);
  });

  it('should omit nested [default] keywords in token paths', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: '[default]',
            value: '#ffffff',
            path: ['color', 'background', 'brand', '[default]', '[default]'],
            attributes: {
              group: 'paint',
            },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any);

    expect(result).toMatchInlineSnapshot(`
      "html[data-theme~=\\"dark\\"] {
        --ds-background-brand: #ffffff;
      }

      @media (prefers-color-scheme: dark) {
        html[data-color-mode=\\"auto\\"] {
          --ds-background-brand: #ffffff;
        }
      }
      "
    `);
  });

  it('should omit nested [default] keywords in the middle of token paths', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: '[default]',
            value: '#ffffff',
            path: [
              'color',
              'background',
              'brand',
              '[default]',
              '[default]',
              'pressed',
            ],
            attributes: {
              group: 'paint',
            },
          },
        ],
      },
      options: {
        themeName: 'atlassian-light',
      },
    } as any);

    expect(result).toMatchInlineSnapshot(`
      "html[data-theme~=\\"light\\"] {
        --ds-background-brand-pressed: #ffffff;
      }

      @media (prefers-color-scheme: light) {
        html[data-color-mode=\\"auto\\"] {
          --ds-background-brand-pressed: #ffffff;
        }
      }
      "
    `);
  });

  it('should omit prefers-color-scheme media selector for non-color themes', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            value: '0',
            name: 'spacing.scale.Space0',
            path: ['spacing', 'scale', 'Space0'],
            attributes: {
              group: 'scale',
            },
          },
          {
            value: '11px',
            name: 'fontSize.FontSize050',
            path: ['fontSize', 'FontSize050'],
            attributes: {
              group: 'scale',
            },
          },
        ],
      },
      options: {
        themeName: 'atlassian-spacing',
      },
    } as any);

    expect(result).not.toContain('prefers-color-scheme');
  });
});
