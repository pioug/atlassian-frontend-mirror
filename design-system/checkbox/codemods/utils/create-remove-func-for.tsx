import { type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { addCommentToStartOfFile } from './add-comment-to-start-of-file';
import { getDefaultSpecifier } from './get-default-specifier';
import { getJSXAttributesByName } from './get-jsx-attributes-by-name';
import { getNamedSpecifier } from './get-named-specifier';

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
