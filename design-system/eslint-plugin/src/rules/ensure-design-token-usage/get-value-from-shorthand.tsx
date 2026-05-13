import { removePixelSuffix } from './remove-pixel-suffix';
import { splitShorthandValues } from './split-shorthand-values';

export const getValueFromShorthand = (str: unknown): (string | number)[] => {
	const valueString = String(str);
	const fontFamily = /(Charlie)|(sans-serif$)|(monospace$)/;
	const fontWeightString = /(regular$)|(medium$)|(semibold$)|(bold$)/;
	const fontStyleString = /(inherit$)|(normal$)|(italic$)/;
	if (
		fontFamily.test(valueString) ||
		fontWeightString.test(valueString) ||
		fontStyleString.test(valueString)
	) {
		return [valueString];
	}
	// If we want to filter out NaN just add .filter(Boolean)
	return splitShorthandValues(String(str).trim()).map(removePixelSuffix);
};
