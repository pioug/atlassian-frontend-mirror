import { type API, type Collection, type ImportDeclaration, type Specifier } from 'jscodeshift';

/**
 * Returns default import specifiers from the given import declarations.
 */
export default function getDefaultImports(
	importDeclarations: Collection<ImportDeclaration>,
	j: API['jscodeshift'],
): Collection<Specifier> {
	return importDeclarations
		.find(j.Specifier)
		.filter((path) => path.node.type === 'ImportDefaultSpecifier');
}
