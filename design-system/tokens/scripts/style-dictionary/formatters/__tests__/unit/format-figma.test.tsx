import { figmaFormatter as formatter } from '../../format-figma';

const output = (
  themeName: string,
  formattedOutput: string,
) => `// eslint-disable-next-line no-undef
synchronizeFigmaTokens('${themeName}', ${formattedOutput}, {});
`;

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

    expect(result).toEqual(
      expect.stringContaining(
        output(
          'AtlassianDark',
          JSON.stringify(
            {
              'Color/Brand': {
                value: '#ffffff',
              },
            },
            null,
            2,
          ),
        ),
      ),
    );
  });

  it('should not parse UNSAFE token', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'brand',
            value: '#ffffff',
            path: ['color', 'brand'],
            attributes: { group: 'paint' },
          },
          {
            name: 'UNSAFE_brand',
            value: '#ffffff',
            path: ['utility', 'UNSAFE_brand'],
            attributes: { group: 'raw' },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any);

    expect(result).toEqual(
      expect.stringContaining(
        output(
          'AtlassianDark',
          JSON.stringify(
            {
              'Color/Brand': {
                value: '#ffffff',
              },
            },
            null,
            2,
          ),
        ),
      ),
    );
  });

  it('should persist [default] keywords in path', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'background/[default]',
            value: '#ffffff',
            path: ['color', 'background', '[default]'],
            attributes: { group: 'paint' },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any);

    expect(result).toEqual(
      expect.stringContaining(
        output(
          'AtlassianDark',
          JSON.stringify(
            { 'Color/Background/Default': { value: '#ffffff' } },
            null,
            2,
          ),
        ),
      ),
    );
  });

  it('should persist nested [default] keywords in path', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'background/[default]/foo',
            value: '#ffffff',
            path: ['color', 'background', '[default]', 'foo'],
            attributes: { group: 'paint' },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any);

    expect(result).toEqual(
      expect.stringContaining(
        output(
          'AtlassianDark',
          JSON.stringify(
            { 'Color/Background/Default/Foo': { value: '#ffffff' } },
            null,
            2,
          ),
        ),
      ),
    );
  });

  it('should persist repeated [default] keywords in path', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'background/[default]/[default]',
            value: '#ffffff',
            path: ['color', 'background', '[default]', '[default]'],
            attributes: { group: 'paint' },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
      },
    } as any);

    expect(result).toEqual(
      expect.stringContaining(
        output(
          'AtlassianDark',
          JSON.stringify(
            { 'Color/Background/Default/Default': { value: '#ffffff' } },
            null,
            2,
          ),
        ),
      ),
    );
  });

  it('should generate correct rename mapping', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'background/[default]',
            value: '#ffffff',
            path: ['color', 'background', '[default]'],
            attributes: {
              group: 'paint',
              replacement: 'color.background.foo.bar.[default]',
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
        `\"Color/Background/Default\": \"Color/Background/Foo/Bar/Default\"`,
      ),
    );
  });
});
