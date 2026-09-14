export function extractCssVarName(prop: string): string {
	return prop.substring(prop.indexOf('(') + 1).split(/\,|\)/)[0];
}
