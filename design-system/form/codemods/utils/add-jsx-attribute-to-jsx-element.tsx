import { type ASTPath, type JSCodeshift, type JSXAttribute, type JSXElement } from 'jscodeshift';

export const addJSXAttributeToJSXElement: (
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	jsxAttribute: JSXAttribute,
	limit?: number,
) => void = (
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	jsxAttribute: JSXAttribute,
	limit?: number,
) => {
	j(jsxElementPath)
		.find(j.JSXOpeningElement)
		.forEach((openingElement, i) => {
			if (!limit || i < limit) {
				openingElement.node.attributes?.push(jsxAttribute);
			}
		});
};
