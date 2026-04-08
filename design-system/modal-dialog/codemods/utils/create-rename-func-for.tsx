import { type JSCodeshift, type VariableDeclaration } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { findIdentifierAndReplaceAttribute } from './find-identifier-and-replace-attribute';
import { getJSXAttributesByName } from './get-jsx-attributes-by-name';
import { getNamedSpecifier } from './get-named-specifier';
import { hasVariableAssignment } from './has-variable-assignment';

export const createRenameFuncFor: (
	component: string,
	importName: string,
	from: string,
	to: string,
) => (j: JSCodeshift, source: Collection<Node>) => void =
	(component: string, importName: string, from: string, to: string) =>
	(j: JSCodeshift, source: Collection<Node>) => {
		const specifier = getNamedSpecifier(j, source, component, importName);

		if (!specifier) {
			return;
		}

		source.findJSXElements(specifier).forEach((element) => {
			getJSXAttributesByName(j, element, from).forEach((attribute) => {
				j(attribute).replaceWith(j.jsxAttribute(j.jsxIdentifier(to), attribute.node.value));
			});
		});

		let variable = hasVariableAssignment(j, source, specifier);
		if (variable) {
			(variable as Collection<VariableDeclaration>)
				.find(j.VariableDeclarator)
				.forEach((declarator) => {
					j(declarator)
						.find(j.Identifier)
						.filter((identifier) => identifier.name === 'id')
						.forEach((ids) => {
							findIdentifierAndReplaceAttribute(j, source, ids.node.name, from, to);
						});
				});
		}
	};
