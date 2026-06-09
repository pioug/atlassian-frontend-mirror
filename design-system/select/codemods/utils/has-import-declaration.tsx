import { type ASTPath, type ImportDeclaration, type default as core } from 'jscodeshift';

export function hasImportDeclaration(
	j: core.JSCodeshift,
	source: string,
	importPath: string,
): boolean {
	return (
		j(source)
			.find(j.ImportDeclaration)
			.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === importPath).length >
		0
	);
}
