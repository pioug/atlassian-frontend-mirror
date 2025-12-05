import type { Rule } from 'eslint';
import { isNodeOfType, type JSXAttribute } from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { getModuleOfIdentifier } from '../../utils/get-import-node-by-source';
import { blockedJSXAttributeLookup } from '../shared/blocked';

function getJSXElementNameFromAttribute(
	attribute: JSXAttribute & Partial<Rule.NodeParentExtension>,
): string | null {
	const parent = attribute.parent;

	if (!parent) {
		return null;
	}

	if (!isNodeOfType(parent, 'JSXOpeningElement')) {
		return null;
	}

	const identifier = parent.name;

	if (!isNodeOfType(identifier, 'JSXIdentifier')) {
		return null;
	}

	return identifier.name;
}

function isOnIntrinsicJSXElement(
	attribute: JSXAttribute & Partial<Rule.NodeParentExtension>,
): boolean {
	const name = getJSXElementNameFromAttribute(attribute);

	if (!name) {
		return false;
	}

	const firstLetter = name.at(0);

	if (!firstLetter) {
		return false;
	}

	return firstLetter === firstLetter.toLocaleLowerCase();
}

function isOnBoxPrimitive(
	context: Rule.RuleContext,
	attribute: JSXAttribute & Partial<Rule.NodeParentExtension>,
): boolean {
	if (getJSXElementNameFromAttribute(attribute) !== 'Box') {
		return false;
	}

	const module = getModuleOfIdentifier(getSourceCode(context), 'Box');

	return module?.moduleName === '@atlaskit/primitives';
}

export function isBlockedJSXAttribute(context: Rule.RuleContext, node: JSXAttribute): boolean {
	const attributeName = node.name;

	if (!isNodeOfType(attributeName, 'JSXIdentifier')) {
		return false;
	}

	// not using a blocked attribute name, can continue on
	if (!blockedJSXAttributeLookup.has(attributeName.name)) {
		return false;
	}

	return isOnIntrinsicJSXElement(node) || isOnBoxPrimitive(context, node);
}
