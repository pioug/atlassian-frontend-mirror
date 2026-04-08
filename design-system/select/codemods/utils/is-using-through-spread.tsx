import { type NodePath } from 'ast-types/lib/node-path';
import { type default as core, type JSXElement } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { isUsingSupportedSpread } from './is-using-supported-spread';

export function isUsingThroughSpread({
	j,
	base,
	element,
	propName,
}: {
	j: core.JSCodeshift;
	base: Collection<any>;
	element: NodePath<JSXElement, JSXElement>;
	propName: string;
}): boolean {
	if (!isUsingSupportedSpread({ j, base, element })) {
		return false;
	}

	const isUsedThroughExpression: boolean =
		j(element)
			.find(j.JSXSpreadAttribute)
			.find(j.ObjectExpression)
			.filter((item) => {
				const match: boolean =
					item.value.properties.filter(
						(property) =>
							property.type === 'ObjectProperty' &&
							property.key.type === 'Identifier' &&
							property.key.name === propName,
					).length > 0;

				return match;
			}).length > 0;

	if (isUsedThroughExpression) {
		return true;
	}

	const isUsedThroughIdentifier: boolean =
		j(element)
			.find(j.JSXSpreadAttribute)
			.find(j.Identifier)
			.filter((identifier): boolean => {
				return (
					base
						.find(j.VariableDeclarator)
						.filter(
							(declarator) =>
								declarator.value.id.type === 'Identifier' &&
								declarator.value.id.name === identifier.value.name,
						)
						.filter((declarator) => {
							const value = declarator.value;
							if (value.id.type !== 'Identifier') {
								return false;
							}

							if (value.id.name !== identifier.value.name) {
								return false;
							}
							// @ts-ignore
							if (value.init.type !== 'ObjectExpression') {
								return false;
							}

							const match: boolean =
								// @ts-ignore
								value.init.properties.filter(
									// @ts-ignore
									(property) =>
										property.type === 'ObjectProperty' &&
										property.key.type === 'Identifier' &&
										property.key.name === propName,
								).length > 0;

							return match;
						}).length > 0
				);
			}).length > 0;

	return isUsedThroughIdentifier;
}
