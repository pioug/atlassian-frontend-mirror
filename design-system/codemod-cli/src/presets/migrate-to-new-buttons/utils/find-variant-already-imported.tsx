import type { API, Collection } from 'jscodeshift';

export const findVariantAlreadyImported = (
	variant: string,
	entryPoint: string,
	fileSource: Collection<any>,
	j: API['jscodeshift'],
	isDefaultSpecifier: boolean = false,
): Collection<any> => {
	const imports = fileSource
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === entryPoint);

	if (isDefaultSpecifier) {
		return imports.find(j.ImportDefaultSpecifier);
	}

	return imports.find(j.ImportSpecifier).filter((path) => path.node.imported.name === variant);
};
