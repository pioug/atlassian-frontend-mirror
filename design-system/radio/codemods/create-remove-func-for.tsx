import { type ASTPath, type ImportDeclaration, type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { addCommentToStartOfFile } from './add-comment-to-start-of-file';
import { getJSXAttributesByName } from './get-jsx-attributes-by-name';
import { getNamedSpecifier } from './get-named-specifier';

function getDefaultSpecifier(j: JSCodeshift, source: ReturnType<typeof j>, specifier: string) {
	const specifiers = source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === specifier)
		.find(j.ImportDefaultSpecifier);

	if (!specifiers.length) {
		return null;
	}
	return specifiers.nodes()[0]!.local!.name;
}

export const createRemoveFuncFor: (
	component: string,
	importName: string,
	prop: string,
	comment?: string,
) => (j: JSCodeshift, source: Collection<Node>) => void =
	(component: string, importName: string, prop: string, comment?: string) =>
	(j: JSCodeshift, source: Collection<Node>) => {
		const specifier =
			getNamedSpecifier(j, source, component, importName) ||
			getDefaultSpecifier(j, source, component);

		if (!specifier) {
			return;
		}

		source.findJSXElements(specifier).forEach((element) => {
			getJSXAttributesByName(j, element, prop).forEach((attribute) => {
				j(attribute).remove();
				if (comment) {
					addCommentToStartOfFile({ j, base: source, message: comment });
				}
			});
		});
	};
