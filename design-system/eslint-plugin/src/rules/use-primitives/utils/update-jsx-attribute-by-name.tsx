import type { Rule } from 'eslint';
import { jsxAttribute, type JSXElement, jsxIdentifier } from 'eslint-codemod-utils';

export const updateJSXAttributeByName: (
	oldName: string,
	newName: string,
	node: JSXElement,
	fixer: Rule.RuleFixer,
) => Rule.Fix | never[] = (
	oldName: string,
	newName: string,
	node: JSXElement,
	fixer: Rule.RuleFixer,
) => {
	const { openingElement } = node;
	const { attributes } = openingElement;

	const existingAttribute = attributes.find((attr) => {
		if (attr.type !== 'JSXAttribute') {
			return false;
		}

		if (attr.name.type !== 'JSXIdentifier') {
			return false;
		}

		return attr.name.name === oldName;
	});

	if (!existingAttribute || existingAttribute.type !== 'JSXAttribute') {
		return [];
	}

	const newAttribute = jsxAttribute({
		...existingAttribute,
		name: jsxIdentifier(newName),
	});

	return fixer.replaceText(existingAttribute, newAttribute.toString());
};
