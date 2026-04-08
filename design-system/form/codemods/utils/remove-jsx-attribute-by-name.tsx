import { type ASTPath, type JSCodeshift, type JSXElement } from 'jscodeshift';

import { getJSXAttributeByName } from './get-jsx-attribute-by-name';
import { getJSXAttributes } from './get-jsx-attributes';

export const removeJSXAttributeByName: (
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	attrName: string,
) => void = (j: JSCodeshift, jsxElementPath: ASTPath<JSXElement>, attrName: string) => {
	const attributes = getJSXAttributes(jsxElementPath);
	const attr = getJSXAttributeByName(j, jsxElementPath, attrName);
	if (attr) {
		attributes?.splice(attributes.indexOf(attr), 1);
	}
};
