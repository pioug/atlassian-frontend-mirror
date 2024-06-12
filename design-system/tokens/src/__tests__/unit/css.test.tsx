import fs from 'fs';

import themeConfig from '../../theme-config';

describe('generated CSS', () => {
	const getCSSFileNames = () => fs.readdirSync(`${__dirname}/../../artifacts/themes/`);
	const getCSSFile = (name: string) =>
		fs.readFileSync(`${__dirname}/../../artifacts/themes/${name}`, 'utf-8');

	it('should place css in the root css folder', () => {
		const names = getCSSFileNames();

		Object.keys(themeConfig).forEach((theme) => {
			expect(names).toContain(`${theme}.tsx`);
		});
	});

	it('should place themes on the theme attribute', () => {
		getCSSFileNames().forEach((name) => {
			const css = getCSSFile(name);

			expect(css).toMatch(/\[data-theme~="([A-Za-z][A-Za-z0-9:]*)(-[A-Za-z0-9:]+)*"\]/);
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
				let cssFile = getCSSFile(CSSName);
				cssFile = cssFile.substring(0, cssFile.indexOf('@media'));

				const customProperties = cssFile
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
