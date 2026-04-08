import { type ASTPath, type JSXAttribute, type JSXElement } from 'jscodeshift';

export const getJSXAttributes: (jsxElementPath: ASTPath<JSXElement>) => JSXAttribute[] = (
	jsxElementPath: ASTPath<JSXElement>,
) => jsxElementPath.node.openingElement.attributes as JSXAttribute[];
