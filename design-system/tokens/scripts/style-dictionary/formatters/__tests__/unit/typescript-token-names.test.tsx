import format from '@af/formatting/sync';

jest.mock('@af/formatting/sync');

import { CSS_PREFIX } from '../../../../../src/constants';
import { typescriptTokenFormatter as formatter } from '../../typescript-token-names';

describe('formatter', () => {
  beforeEach(() => {
    (format as jest.Mock).mockImplementation((str: string) =>
      str.split('{').pop()!.split('}')[0].trim(),
    );
  });

  afterEach(() => {
    (format as jest.Mock).mockReset();
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

    expect(result).toEqual(`'color.brand': 'var(--${CSS_PREFIX}-brand)',`);
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

    expect(result).toEqual(
      `'color.specialAccent': 'var(--${CSS_PREFIX}-specialAccent)',`,
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

    expect(result).toEqual(`'color.accent': 'var(--${CSS_PREFIX}-accent)',`);
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

    expect(result).toEqual(
      `'color.accent.brand': 'var(--${CSS_PREFIX}-accent-brand)',`,
    );
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

    expect(result).toEqual(
      `'color.background.brand': 'var(--${CSS_PREFIX}-background-brand)',`,
    );
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

    expect(result).toEqual(
      `'color.background.brand': 'var(--${CSS_PREFIX}-background-brand)',`,
    );
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
    } as any);

    expect(result).toEqual(
      `'color.background.brand.pressed': 'var(--${CSS_PREFIX}-background-brand-pressed)',`,
    );
  });
});
