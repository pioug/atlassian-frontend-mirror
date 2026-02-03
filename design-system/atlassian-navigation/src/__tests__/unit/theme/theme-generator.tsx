// TODO: Fix imports
// import { generateTheme, GenerateThemeArgs } from '../../../';

import { generateTheme } from '../../../theme/theme-generator';
import { type GenerateThemeArgs } from '../../../theme/types';

import { colorSchemes, themes } from './_theme-data';

type Component = 'search' | 'skeleton' | 'primaryButton' | 'navigation' | 'iconButton' | 'create';

describe('generateTheme', () => {
	colorSchemes.forEach((colorScheme: GenerateThemeArgs, i) => {
		describe(`${colorScheme.name} theme`, () => {
			const theme = generateTheme(colorScheme).mode;

			Object.keys(theme).forEach((component) => {
				it(`should match theme object for "${component}"`, () => {
					const componentTheme = theme[component as Component];
					expect(Object.keys(componentTheme).sort()).toEqual(
						Object.keys(themes[i].mode[component as Component]).sort(),
					);
					// Jest: Multiple inline snapshots for the same call are not supported.
					// eslint-disable-next-line @atlaskit/design-system/no-to-match-snapshot
					expect(componentTheme).toMatchSnapshot();
				});
			});
		});
	});
});
