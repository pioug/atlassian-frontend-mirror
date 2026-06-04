import type {
	API,
	ASTPath,
	default as core,
	FileInfo,
	ImportDeclaration,
	Options,
} from 'jscodeshift';
import type { Collection } from 'jscodeshift/src/Collection';

function hasImportDeclaration(
	j: core.JSCodeshift,
	source: Collection<unknown>,
	importPath: string,
) {
	const imports = source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === importPath);

	return Boolean(imports.length);
}

export const createTransformer =
	(
		packageName: string,
		migrations: { (j: core.JSCodeshift, source: Collection<unknown>): void }[],
	) =>
	(fileInfo: FileInfo, { jscodeshift: j }: API, options: Options): string => {
		const source = j(fileInfo.source);

		if (!hasImportDeclaration(j, source, packageName)) {
			return fileInfo.source;
		}

		migrations.forEach((transform) => transform(j, source));

		return source.toSource(options.printOptions || { quote: 'single' });
	};
