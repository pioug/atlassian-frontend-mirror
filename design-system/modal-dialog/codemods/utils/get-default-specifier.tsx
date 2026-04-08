import { type ASTPath, type ImportDeclaration, type JSCodeshift } from 'jscodeshift';

export function getDefaultSpecifier(
	j: JSCodeshift,
	source: ReturnType<typeof j>,
	specifier: string,
): string | null {
	const specifiers = source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === specifier)
		.find(j.ImportDefaultSpecifier);

	if (!specifiers.length) {
		return null;
	}
	return specifiers.nodes()[0]!.local!.name;
}
