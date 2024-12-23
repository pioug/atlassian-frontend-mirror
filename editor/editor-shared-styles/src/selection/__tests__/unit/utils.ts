import { SelectionStyle } from '../../types';
import { getSelectionStyles } from '../../utils';

describe('selection plugin: utils', () => {
	describe('getSelectionStyles', () => {
		const selectionStyles = [
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			{ name: 'border', style: SelectionStyle.Border, regex: /border\:/ },
			{
				name: 'box-shadow',
				style: SelectionStyle.BoxShadow,
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				regex: /box\-shadow\:/,
			},
			{
				name: 'background',
				style: SelectionStyle.Background,
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				regex: /background\-color\:/,
			},
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			{ name: 'blanket', style: SelectionStyle.Blanket, regex: /\:\:before/ },
		];

		for (const selectionStyle of selectionStyles) {
			it(`gets styles for ${selectionStyle.name}`, () => {
				const css = getSelectionStyles([selectionStyle.style]);
				expect(css).toMatch(selectionStyle.regex);
			});
		}

		it('combines multiple styles', () => {
			const allStyles = selectionStyles.map((selectionStyle) => selectionStyle.style);
			const allRegex = selectionStyles.map((selectionStyle) => selectionStyle.regex);

			const css = getSelectionStyles(allStyles);

			for (const regex of allRegex) {
				expect(css).toMatch(regex);
			}
		});
	});
});
