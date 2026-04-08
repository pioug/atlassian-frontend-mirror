import { type ASTPath, type JSCodeshift, type JSXAttribute, type JSXElement } from 'jscodeshift';

export const getJSXAttributeByName: (
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	attributeName: string,
) => JSXAttribute | undefined = (
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	attributeName: string,
): JSXAttribute | undefined => {
	const attributes: JSXAttribute[] = j(jsxElementPath).find(j.JSXAttribute).nodes();

	return attributes?.find((attr) => attr.name && attr.name.name === attributeName);
};
