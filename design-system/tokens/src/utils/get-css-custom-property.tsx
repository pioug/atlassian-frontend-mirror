import { CSS_PREFIX, CSS_VAR_FULL } from '../constants';

/**
 * Transforms a style dictionary token path to a CSS custom property.
 *
 * A css prefix will be prepended and all [default] key words will be omitted
 * from the path
 *
 * @example <caption>Passing a path as an array</caption>
 * // Returns ds-background-bold
 * getCSSCustomProperty(['color', 'background', 'bold', '[default]'])
 *
 * @example <caption>Passing a path as a string</caption>
 * // Returns ds-background-bold
 * getCSSCustomProperty('color.background.bold.[default]')
 */
export const getCSSCustomProperty = (path: string | string[]): string => {
	const normalizedPath = typeof path === 'string' ? path.split('.') : path;

	// Opacity and other 'shallow' groups are more readable when not trimmed
	const slice = CSS_VAR_FULL.includes(normalizedPath[0]) ? 0 : 1;

	return `--${[CSS_PREFIX, ...normalizedPath.slice(slice)]
		.filter((el) => el !== '[default]')
		.join('-')}`;
};
