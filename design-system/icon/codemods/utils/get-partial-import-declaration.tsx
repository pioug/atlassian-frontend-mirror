import { type Collection, type JSCodeshift } from 'jscodeshift';

export function getPartialImportDeclaration(
	j: JSCodeshift,
	source: Collection<any>,
	sourcePath: string,
): Collection<any> {
	return source
		.find(j.ImportDeclaration)
		.filter(
			(path) =>
				typeof path.node.source.value === 'string' && path.node.source.value.includes(sourcePath),
		);
}
