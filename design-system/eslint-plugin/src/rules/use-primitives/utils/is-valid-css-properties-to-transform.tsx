import type { CSSProperties } from 'react';

import type { Rule } from 'eslint';
import { isNodeOfType, type SimpleCallExpression } from 'eslint-codemod-utils';

import * as ast from '../../../ast-nodes';
import { type RuleConfig } from '../config';
import { supportedDimensionAttributesMap, supportedStylesMap } from '../transformers/css-to-xcss';

import { convertASTObjectExpressionToJSObject } from './convert-ast-object-expression-to-js-object';

export const isValidCssPropertiesToTransform = (
	node: SimpleCallExpression & Rule.NodeParentExtension,
	config: RuleConfig,
): boolean => {
	if (!node) {
		return false;
	}
	const cssObjectExpression = node.arguments[0];
	// Bail on empty object calls
	if (!cssObjectExpression || !isNodeOfType(cssObjectExpression, 'ObjectExpression')) {
		return false;
	}

	if (!ast.Object.isFlat(cssObjectExpression)) {
		return false;
	}

	// `use-primitives` should not report on empty style objects. See: https://product-fabric.atlassian.net/browse/DSP-16520
	if (ast.Object.getEntries(cssObjectExpression).length === 0) {
		return false;
	}

	const { unsupported, ...cssObject } = convertASTObjectExpressionToJSObject(
		cssObjectExpression as any,
	);
	// Bail if there are any unsupported styles
	if (unsupported.length > 0) {
		return false;
	}

	if (!config.patterns.includes('multiple-properties') && Object.keys(cssObject).length > 1) {
		return false;
	}

	// Short-circuit when token calls are found but pattern is not enabled in config
	if (
		!config.patterns.includes('css-property-with-tokens') &&
		Object.values(cssObject).some((value) => typeof value === 'object' && value.tokenName)
	) {
		return false;
	}

	// Short-circuit when dimension properties found but pattern is not enabled in config
	if (
		!config.patterns.includes('dimension-properties') &&
		Object.keys(cssObject).some((attribute) => supportedDimensionAttributesMap[attribute])
	) {
		return false;
	}

	// NOTE: Our approach with this lint rule is to strictly whitelist css properties we can map.
	// It means we have to provide mappings for everything (e.g. `display: block`).
	// However, from a maker's experience, it's much better that the rule doesn't report (if we miss a mapping)
	// than the rule reporting on things that can't be mapped.
	const containsOnlyValidStyles = (Object.keys(cssObject) as Array<keyof CSSProperties>).every(
		(styleProperty) => {
			const styleValue = cssObject[styleProperty]!;

			// token function call
			if (typeof styleValue === 'object') {
				// if there is no fallback value, we just map to the token name, if one is found
				if (!styleValue.fallbackValue) {
					return (
						supportedStylesMap[styleProperty] &&
						Object.values(supportedStylesMap[styleProperty]).includes(styleValue.tokenName)
					);
				}
				// token with fallback
				return (
					supportedStylesMap[styleProperty] &&
					supportedStylesMap[styleProperty][styleValue.fallbackValue] === styleValue.tokenName
				);
			} else {
				// direct value used
				return (
					supportedStylesMap[styleProperty] && // Is the key something we can map
					supportedStylesMap[styleProperty][styleValue] // Is the value something we can map
				);
			}
		},
	);
	if (!containsOnlyValidStyles) {
		return false;
	}

	return true;
};
