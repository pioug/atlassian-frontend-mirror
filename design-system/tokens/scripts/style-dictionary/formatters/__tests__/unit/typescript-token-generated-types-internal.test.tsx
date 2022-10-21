import prettier from 'prettier';

jest.mock('prettier');

import { typescriptFormatter as formatter } from '../../typescript-token-generated-types-internal';

describe('formatter', () => {
  beforeEach(() => {
    (prettier.format as jest.Mock).mockImplementation((str: string) =>
      str.split('{').pop()!.split('}')[0].trim(),
    );
  });

  afterEach(() => {
    (prettier.format as jest.Mock).mockReset();
  });

  it('should parse token', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'brand',
            value: 'B900',
            path: ['color', 'brand'],
            attributes: { group: 'paint', state: 'active' },
          },
        ],
      },
    } as any);

    expect(result).toEqual(
      expect.stringContaining(
        `export type InternalTokenIds =  | 'color.brand';`,
      ),
    );
  });

  it('should preserve camelCase tokens', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'specialAccent',
            value: 'B900',
            path: ['color', 'specialAccent'],
            attributes: { group: 'paint', state: 'active' },
          },
        ],
      },
    } as any);

    expect(result).toEqual(
      expect.stringContaining(
        `export type InternalTokenIds =  | 'color.specialAccent';`,
      ),
    );
  });

  it('should omit palette tokens', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'B900',
            value: '#2104ff',
            path: ['color', 'B600'],
            attributes: {
              group: 'palette',
            },
          },
        ],
      },
    } as any);

    expect(result).toEqual(
      expect.stringContaining(`// No active tokens in this theme\nexport {}`),
    );
  });

  it('should parse deeply nested token', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'brand',
            value: 'B900',
            path: ['color', 'accent', 'brand'],
            attributes: { group: 'paint', state: 'active' },
          },
        ],
      },
    } as any);

    expect(result).toEqual(
      expect.stringContaining(
        `export type InternalTokenIds =  | 'color.accent.brand';`,
      ),
    );
  });

  it('should not omit [default] keywords in token paths', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: '[default]',
            value: '#ffffff',
            path: ['color', 'background', 'brand', '[default]'],
            attributes: {
              group: 'paint',
              state: 'active',
            },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any);

    expect(result).toEqual(
      expect.stringContaining(
        `export type InternalTokenIds =  | 'color.background.brand.[default]';`,
      ),
    );
  });
});
