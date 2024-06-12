// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import type { ASTPath, default as core, ImportDeclaration } from 'jscodeshift';

export type Nullable<T> = T | null;

function getDefaultSpecifier(j: core.JSCodeshift, source: any, specifier: string) {
	const specifiers = source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === specifier)
		.find(j.ImportDefaultSpecifier);
	if (!specifiers.length) {
		return null;
	}
	return specifiers.nodes()[0]!.local!.name;
}

export { getDefaultSpecifier };
