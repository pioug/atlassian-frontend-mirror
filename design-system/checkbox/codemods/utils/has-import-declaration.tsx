import { type ASTPath, type ImportDeclaration, type JSCodeshift } from 'jscodeshift';

export function hasImportDeclaration(j: JSCodeshift, source: any, importPath: string): boolean {
	const imports = source
		.find(j.ImportDeclaration)
		.filter(
			(path: ASTPath<ImportDeclaration>) =>
				typeof path.node.source.value === 'string' && path.node.source.value.startsWith(importPath),
		);

	return Boolean(imports.length);
}
