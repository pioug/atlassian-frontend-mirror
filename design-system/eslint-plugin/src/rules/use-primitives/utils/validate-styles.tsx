import {
	type CallExpression,
	type EslintNode,
	isNodeOfType,
	type Property,
	type SpreadElement,
} from 'eslint-codemod-utils';

import * as ast from '../../../ast-nodes';
import { type RuleConfig } from '../config';
import { spaceTokenMap, supportedStylesMap } from '../transformers';
import { supportedDimensionAttributesMap } from '../transformers/css-to-xcss';

export const validateStyles = (node: CallExpression, config: RuleConfig): boolean => {
	if (!node) {
		return false;
	}
	const cssObjectExpression = node.arguments[0];
	// Bail on empty object calls
	if (!isNodeOfType(cssObjectExpression, 'ObjectExpression')) {
		return false;
	}

	if (!ast.Object.isFlat(cssObjectExpression)) {
		return false;
	}

	const entries = ast.Object.getEntries(cssObjectExpression);

	if (entries.length === 0) {
		return false;
	}

	if (!config.patterns.includes('multiple-properties') && entries.length > 1) {
		return false;
	}

	return entries.every((entry: Property | SpreadElement) => {
		// Bail on SpreadElements
		if (!isNodeOfType(entry, 'Property')) {
			return false;
		}

		const { key, value } = entry;

		// Bail if the property is not something we understand, e.g. `{ [SOME_CONSTANT]: '8px' }`
		if (!isNodeOfType(key, 'Identifier')) {
			return false;
		}

		const property = ast.ObjectEntry.getPropertyName(entry);
		if (!property) {
			return false;
		}

		const isDimensionProperty = !!supportedDimensionAttributesMap[property];

		// Currently, we handle values like `'8px'` (a 'Literal') or `token('space.100')` (a 'CallExpression')
		if (isNodeOfType(value, 'Literal')) {
			if (!value.value) {
				return false;
			}

			const valueString = value.value.toString();
			if (!supportedStylesMap[property] || !supportedStylesMap[property][valueString]) {
				return false;
			}
		} else if (isNodeOfType(value, 'CallExpression')) {
			// If it's a function call, then make sure it's the `token` function (and we have `css-property-with-tokens` enabled)

			// Short-circuit when token calls are found but pattern is not enabled in config
			if (isTokenCall(value)) {
				if (!config.patterns.includes('css-property-with-tokens')) {
					return false;
				}

				// Don't attempt to convert `width: token('space.100') -> width: 'size.100'`
				if (isDimensionProperty) {
					return false;
				}
			}

			// Bail if it's a function, but that function call is not `tokens('<token>')`
			if (!isTokenCall(value)) {
				return false;
			}
		} else {
			return false;
		}

		// Bail if dimension property is found but pattern is not enabled in config
		// Note: We don't need to exhaustively re-check the key/value pair here. That's already been done above.
		// This is just to check wether 'dimension-properties' pattern is enabled and can be removed when the pattern is completely rolled out
		if (isDimensionProperty && !config.patterns.includes('dimension-properties')) {
			return false;
		}

		return true;
	});
};

const isTokenCall = (node: EslintNode): node is CallExpression => {
	// Is it a function call?
	if (!isNodeOfType(node, 'CallExpression')) {
		return false;
	}

	// Is the function called 'token'?
	if (ast.FunctionCall.getName(node) !== 'token') {
		return false;
	}

	const token = ast.FunctionCall.getArgumentAtPos(node, 0);

	if (!token || token.type !== 'Literal') {
		return false;
	}

	// Is the token one that we understand
	if (!Object.values(spaceTokenMap).includes(token.value)) {
		return false;
	}

	// Not all `token()` calls have a fall back. This is fine, but if there is a fallback, make sure it's the same as the fallback xcss will use
	if (node.arguments.length === 2) {
		const fallback = ast.FunctionCall.getArgumentAtPos(node, 1);

		// `getArgumentAtPos` is only able to understand `Literal` and `ObjectExpression` statements
		// If there are 2 args, but `fallback` is undefined, then the fallback is something wild, like `token('space.100, `${gridSize * rem(3)`})`
		if (!fallback) {
			return false;
		}

		if (fallback.type !== 'Literal') {
			return false;
		}

		if (spaceTokenMap[fallback.value] !== token.value) {
			return false;
		}
	}

	return true;
};
