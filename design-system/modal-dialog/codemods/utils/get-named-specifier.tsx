import {
	type ASTPath,
	type ImportDeclaration,
	type ImportSpecifier,
	type JSCodeshift,
} from 'jscodeshift';

export function getNamedSpecifier(
	j: JSCodeshift,
	source: any,
	specifier: string,
	importName: string,
): any {
	const specifiers = source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === specifier)
		.find(j.ImportSpecifier)
		.filter((path: ASTPath<ImportSpecifier>) => path.node.imported.name === importName);

	if (!specifiers.length) {
		return null;
	}
	return specifiers.nodes()[0]!.local!.name;
}
