import { type NodePath } from 'ast-types/lib/node-path';
import { type default as core, type JSXElement } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function isUsingSupportedSpread({
	j,
	base,
	element,
}: {
	j: core.JSCodeshift;
	base: Collection<any>;
	element: NodePath<JSXElement, JSXElement>;
}): boolean {
	const isUsingSpread: boolean = j(element).find(j.JSXSpreadAttribute).length > 0;

	if (!isUsingSpread) {
		return true;
	}

	return (
		j(element)
			.find(j.JSXSpreadAttribute)
			.filter((spread) => {
				const argument = spread.value.argument;
				// in place expression is supported
				if (argument.type === 'ObjectExpression') {
					return true;
				}

				// Supporting identifiers that point to an a local object expression
				if (argument.type === 'Identifier') {
					return (
						base.find(j.VariableDeclarator).filter((declarator): boolean => {
							return (
								declarator.value.id.type === 'Identifier' &&
								// @ts-ignore
								declarator.value.init.type === 'ObjectExpression'
							);
						}).length > 0
					);
				}

				// We don't support anything else
				return false;
			}).length > 0
	);
}
