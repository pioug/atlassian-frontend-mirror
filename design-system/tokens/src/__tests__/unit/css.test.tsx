import fs from 'fs';

describe('generated CSS', () => {
  const getCSSFileNames = () => fs.readdirSync(`${__dirname}/../../../css`);
  const getCSSFile = (name: string) =>
    fs.readFileSync(`${__dirname}/../../../css/${name}`, 'utf-8');

  it('should place css in the root css folder', () => {
    const names = getCSSFileNames();

    expect(names).toEqual([
      'atlassian-dark.css',
      'atlassian-legacy-dark.css',
      'atlassian-legacy-light.css',
      'atlassian-light.css',
      'atlassian-spacing.css',
    ]);
  });

  it('should place all themes on the theme attribute', () => {
    getCSSFileNames().forEach((name) => {
      const css = getCSSFile(name);

      if (name === 'atlassian-spacing.css') {
        expect(css).toMatch(
          /\nhtml\[data-spacing-theme="([a-z][a-z0-9]*)(-[a-z0-9]+)*"\] {\n/,
        );
      } else {
        expect(css).toMatch(
          /\nhtml\[data-theme="([a-z][a-z0-9]*)(-[a-z0-9]+)*"\] {\n/,
        );
      }
    });
  });

  it('should not have any unexpected values found in the CSS', () => {
    getCSSFileNames().forEach((name) => {
      const css = getCSSFile(name);

      expect(css).not.toMatch(/undefined|\[object Object\]/);
    });
  });

  it('should throw if duplicates are found', () => {
    const CSSNames = getCSSFileNames();

    expect(() => {
      CSSNames.forEach((CSSName) => {
        const valueMap: Record<string, boolean> = {};
        const customProperties = getCSSFile(CSSName)
          .split('\n')
          .filter(Boolean)
          .map((line) => line.split(':')[0].trim());

        customProperties.forEach((customPropertyName) => {
          if (valueMap[customPropertyName]) {
            throw new Error(
              `A duplicate custom property "${customPropertyName}" was found in the CSS output!`,
            );
          }

          valueMap[customPropertyName] = true;
        });
      });
    }).not.toThrow();
  });
});
