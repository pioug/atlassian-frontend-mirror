import { type EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import * as ast from '../../../ast-nodes';

type SupportedElements = Array<{
	name: string;
	attributes?: Array<{
		name: string;
		values?: (string | undefined)[];
		canBeUndefined?: boolean;
	}>;
}>;

const supportedElements: SupportedElements = [
	{
		name: 'input',
		attributes: [
			{
				name: 'type',
				values: ['text'],
				canBeUndefined: true,
			},
		],
	},
];

/**
 * Determines if the given JSX element is a supported element to lint with this rule.
 */
export function isSupportedForLint(
	jsxNode: EslintNode,
	elementName?: string,
): jsxNode is Extract<
	EslintNode,
	{
		type: 'JSXElement';
	}
> {
	if (!isNodeOfType(jsxNode, 'JSXElement')) {
		return false;
	}

	// Allow passing in the element name because the jsxNode doesn't
	// represent the element name with styled components
	const elName = elementName || ast.JSXElement.getName(jsxNode);
	if (!elName) {
		return false;
	}

	// Only check native HTML elements, not components
	if (elName[0] !== elName[0].toLowerCase()) {
		return false;
	}

	let supportedElement = supportedElements.find(({ name }) => name === elName);

	if (!supportedElement) {
		supportedElement = supportedElements.find(({ name }) => name === '*');
	}

	if (!supportedElement) {
		return false;
	}

	// Check if the element has any attributes that are not supported
	const attributes = ast.JSXElement.getAttributes(jsxNode);
	if (
		supportedElement.attributes &&
		// If not every attribute resolves to `true`
		!supportedElement.attributes.every(({ name, values, canBeUndefined }) => {
			// If it can be an undefined prop
			if (canBeUndefined) {
				// Search attributes for `name`
				const foundAttribute = attributes.find(
					(attr) => isNodeOfType(attr, 'JSXAttribute') && attr.name.name === name,
				);
				// If we didn't find that attribute, then it should be linted
				if (!foundAttribute) {
					return true;
				}
			}

			// If we did find the attribute with a matching name, then check if one of
			// it's values matches
			return attributes.some((attribute) => {
				// Don't lint spreads
				if (attribute.type === 'JSXSpreadAttribute') {
					return false;
				}

				const isMatchingName = attribute.name.name === name;
				const isMatchingValues =
					values &&
					attribute.value &&
					attribute.value.type === 'Literal' &&
					typeof attribute.value.value === 'string' &&
					values?.includes(attribute.value.value);

				// If one of our values match the attribute's value, lint it
				return isMatchingName && isMatchingValues;
			});
		})
	) {
		return false;
	}

	return true;
}
