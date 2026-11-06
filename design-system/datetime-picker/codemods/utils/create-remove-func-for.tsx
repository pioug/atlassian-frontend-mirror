import { type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import {
	addCommentToStartOfFile,
	getJSXAttributesByName,
	getNamedSpecifier,
} from '@atlaskit/codemod-utils/support';

export const createRemoveFuncFor: (
	component: string,
	importName: string,
	prop: string,
	comment?: string,
) => (j: JSCodeshift, source: Collection<Node>) => void =
	(component: string, importName: string, prop: string, comment?: string) =>
	(j: JSCodeshift, source: Collection<Node>) => {
		const specifier = getNamedSpecifier(j, source, component, importName);

		if (!specifier) {
			return;
		}

		source.findJSXElements(specifier).forEach((element) => {
			getJSXAttributesByName(j, element, prop).forEach((attribute: any) => {
				j(attribute).remove();
				if (comment) {
					addCommentToStartOfFile({ j, base: source, message: comment });
				}
			});
		});
	};
