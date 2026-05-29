export function isCssDeclaration(prop: string): boolean {
	return prop.startsWith('--');
}
