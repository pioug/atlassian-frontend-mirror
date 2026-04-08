import { type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { addCommentToStartOfFile } from './add-comment-to-start-of-file';
import { getDefaultSpecifier } from './get-default-specifier';
import { getJSXAttributesByName } from './get-jsx-attributes-by-name';
import { getNamedSpecifier } from './get-named-specifier';

export const createRemoveFuncIfBooleanFor: (
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
				const el = attribute.parent.value;
				if (
					// Verify the element we are working on is the element we want
					el.type === 'JSXOpeningElement' &&
					el.name.type === 'JSXIdentifier' &&
					el.name.name === specifier &&
					(attribute.value.value === null ||
						(attribute.value.value?.type === 'JSXExpressionContainer' &&
							attribute.value.value.expression.type === 'BooleanLiteral'))
				) {
					j(attribute).remove();
					if (comment) {
						addCommentToStartOfFile({ j, base: source, message: comment });
					}
				}
			});
		});
	};
