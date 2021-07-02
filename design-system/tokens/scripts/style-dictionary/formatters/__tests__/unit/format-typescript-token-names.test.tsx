import prettier from 'prettier';

jest.mock('prettier');

import formatter from '../../format-typescript-token-names';

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
            attributes: { group: 'paint' },
          },
        ],
      },
    } as any);

    expect(result).toEqual(`'color.brand': 'var(--brand)',`);
  });

  it('should preserve camelCase tokens', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'specialAccent',
            value: 'B900',
            path: ['color', 'specialAccent'],
            attributes: { group: 'paint' },
          },
        ],
      },
    } as any);

    expect(result).toEqual(`'color.specialAccent': 'var(--specialAccent)',`);
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
              group: 'paint',
              isPalette: true,
            },
          },
        ],
      },
    } as any);

    expect(result).toEqual('');
  });

  it('should parse nested token', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'accent',
            value: 'B900',
            path: ['color', 'accent'],
            attributes: { group: 'paint' },
          },
        ],
      },
    } as any);

    expect(result).toEqual(`'color.accent': 'var(--accent)',`);
  });

  it('should parse deeply nested token', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'brand',
            value: 'B900',
            path: ['color', 'accent', 'brand'],
            attributes: { group: 'paint' },
          },
        ],
      },
    } as any);

    expect(result).toEqual(`'color.accent.brand': 'var(--accent-brand)',`);
  });
});
