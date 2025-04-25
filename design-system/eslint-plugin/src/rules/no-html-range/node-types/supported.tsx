import { type EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import * as ast from '../../../ast-nodes';

type SupportedElements = Array<{
	name: string;
	attributes?: Array<{
		name: string;
		values?: string[];
	}>;
}>;

const supportedElements: SupportedElements = [
	{
		name: 'input',
		attributes: [
			{
				name: 'type',
				values: ['range'],
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
		!supportedElement.attributes.every(({ name, values }) => {
			return attributes.some((attribute) => {
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

				return isMatchingName && isMatchingValues;
			});
		})
	) {
		return false;
	}

	return true;
}
