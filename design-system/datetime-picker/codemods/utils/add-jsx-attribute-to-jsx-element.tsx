import { type ASTPath, type JSCodeshift, type JSXAttribute, type JSXElement } from 'jscodeshift';

export const addJSXAttributeToJSXElement: (
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	jsxAttribute: JSXAttribute,
) => void = (j: JSCodeshift, jsxElementPath: ASTPath<JSXElement>, jsxAttribute: JSXAttribute) => {
	j(jsxElementPath)
		.find(j.JSXOpeningElement)
		.forEach((openingElement) => {
			openingElement.node.attributes?.push(jsxAttribute);
		});
};
