import {
	type ASTPath,
	type Identifier,
	type JSCodeshift,
	type JSXElement,
	type StringLiteral,
} from 'jscodeshift';

import { getJSXAttributeByName } from './get-jsx-attribute-by-name';
import { getJSXAttributesByName } from './get-jsx-attributes-by-name';
import { removeJSXAttributeByName } from './remove-jsx-attribute-by-name';

export const removeJSXAttributeObjectPropertyByName: (
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	attrName: string,
	propertyToRemove: string,
) => void = (
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	attrName: string,
	propertyToRemove: string,
) => {
	const attr = getJSXAttributeByName(j, jsxElementPath, attrName);

	if (!attr) {
		return;
	}

	const attrCollection = getJSXAttributesByName(j, jsxElementPath, attrName);

	const removeMatchingNodes = (p: ASTPath<Identifier | StringLiteral>) => {
		const name = p.node.type === 'Identifier' ? p.node?.name : p.node?.value;
		// Need to account for quoted properties
		const nameMatches = propertyToRemove.match(new RegExp(`['"]?${name}['"]?`));
		// This will otherwise try to remove values of properties since they are literals
		const isKey = p.parent.value?.type === 'ObjectProperty';
		// Sorry about all the parents. This is the easiest way to get the name
		// of the attribute name. And I always know the depth of the object
		// property here.
		const parentNameMatches = attrName === p.parent.parent.parent.parent.node?.name?.name;
		if (isKey && nameMatches && parentNameMatches) {
			j(p.parent).remove();
		}
	};

	// Remove all the now migrated object properties
	const objectProperties = attrCollection.find(j.ObjectProperty);
	objectProperties.find(j.Identifier).forEach(removeMatchingNodes);
	objectProperties.find(j.StringLiteral).forEach(removeMatchingNodes);

	// @ts-ignore -- Property 'expression' does not exist on type 'LiteralKind | JSXElement | JSXExpressionContainer | JSXFragment'. Property 'expression' does not exist on type 'Literal'.
	const attrProperties = attr.value?.expression.properties;

	if (attrProperties && attrProperties?.length === 0) {
		removeJSXAttributeByName(j, jsxElementPath, attrName);
	}
};
