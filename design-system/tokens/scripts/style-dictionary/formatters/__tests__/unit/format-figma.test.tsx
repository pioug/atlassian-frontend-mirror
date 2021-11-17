import formatter from '../../format-figma';

const output = (
  themeName: string,
  formattedOutput: string,
) => `// THIS IS AN AUTO-GENERATED FILE DO NOT MODIFY DIRECTLY
// Re-generate by running \`yarn build tokens\`.
// Read the instructions to use this here:
// \`packages/design-system/tokens/src/figma/README.md\`
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
        renameMapping: {},
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
        renameMapping: {},
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

  it('should group interaction states with appearances', () => {
    const result = formatter({
      dictionary: {
        allTokens: [
          {
            name: 'background/selected/resting',
            value: '#ffffff',
            path: ['color', 'background', 'selected', 'resting'],
            attributes: { group: 'paint' },
          },
          {
            name: 'background/selected/hover',
            value: '#ffffff',
            path: ['color', 'background', 'selected', 'hover'],
            attributes: { group: 'paint' },
          },
          {
            name: 'background/selected/pressed',
            value: '#ffffff',
            path: ['color', 'background', 'selected', 'pressed'],
            attributes: { group: 'paint' },
          },
        ],
      },
      options: {
        themeName: 'atlassian-dark',
        renameMapping: {},
      },
    } as any);

    expect(result).toEqual(
      expect.stringContaining(
        output(
          'AtlassianDark',
          JSON.stringify(
            {
              'Color/Background/Selected Resting': {
                value: '#ffffff',
              },
              'Color/Background/Selected Hover': {
                value: '#ffffff',
              },
              'Color/Background/Selected Pressed': {
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
});
