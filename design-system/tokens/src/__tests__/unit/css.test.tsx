import fs from 'fs';

describe('generated CSS', () => {
  const getCSSFileNames = () => fs.readdirSync(`${__dirname}/../../../css`);
  const getCSSFile = (name: string) =>
    fs.readFileSync(`${__dirname}/../../../css/${name}`, 'utf-8');

  it('should place css in the root css folder', () => {
    const names = getCSSFileNames();

    expect(names).toEqual(['atlassian-dark.css', 'atlassian-light.css']);
  });

  it('should place all light themes on the root and theme attribute', () => {
    const names = getCSSFileNames().filter((name) =>
      name.endsWith('-light.css'),
    );

    names.forEach((name) => {
      const css = getCSSFile(name).split('\n').slice(2, 3).join('');

      expect(css).toEqual(':root, html[data-theme="light"] {');
    });
  });

  it('should place all other themes on the theme attribute', () => {
    const names = getCSSFileNames().filter(
      (name) => !name.endsWith('-light.css'),
    );

    names.forEach((name) => {
      const css = getCSSFile(name).split('\n').slice(2, 3).join('');

      expect(css).toMatch(/^html\[data-theme="\w+"\] {$/);
    });
  });

  it('should not have any unexpected values found in the CSS', () => {
    const names = getCSSFileNames();

    names.forEach((name) => {
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
