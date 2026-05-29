const COLOR_PROPERTIES = [
	'color',
	'background',
	'background-color',
	'box-shadow',
	'border',
	'border-left',
	'border-right',
	'border-top',
	'border-bottom',
	'border-color',
	'border-left-color',
	'border-right-color',
	'border-top-color',
	'border-bottom-color',
	'outline',
	'outline-color',
	'accent-color',
	'caret-color',
	'scrollbar-color',
	'text-stroke',
] as const;

export function isColorRelatedProperty(prop: string): boolean {
	return COLOR_PROPERTIES.some((property) => property === prop);
}

export function extractCssVarName(prop: string): string {
	return prop.substring(prop.indexOf('(') + 1).split(/\,|\)/)[0];
}
export { isCssDeclaration } from './is-css-declaration';
export { extractLessVarName } from './extract-less-var-name';
export { splitCssValue } from './split-css-value';
