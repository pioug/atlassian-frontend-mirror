/* eslint-disable @repo/internal/fs/filename-pattern-match */

export function createDefaultImportDeclaration(
	j: any,
	componentName: string,
	importPath: string,
): any {
	const defaultSpecifier = j.importDefaultSpecifier(j.identifier(componentName));
	return j.importDeclaration([defaultSpecifier], j.stringLiteral(importPath));
}
