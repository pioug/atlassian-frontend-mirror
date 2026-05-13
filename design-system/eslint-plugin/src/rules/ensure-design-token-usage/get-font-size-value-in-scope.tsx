import { getValueFromShorthand } from './get-value-from-shorthand';
import { type ProcessedCSSLines } from './types';

export function getFontSizeValueInScope(cssProperties: ProcessedCSSLines): number | undefined {
	const fontSizeNode = cssProperties.find(([style]) => {
		const [rawProperty, value] = style.split(':');
		return /font-size/.test(rawProperty) ? value : null;
	});
	if (!fontSizeNode) {
		return undefined;
	}
	const [_, fontSizeValue] = fontSizeNode[0].split(':');
	if (!fontSizeValue) {
		return undefined;
	}
	return getValueFromShorthand(fontSizeValue)[0] as number;
}
