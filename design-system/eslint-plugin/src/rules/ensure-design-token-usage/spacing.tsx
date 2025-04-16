import type { Rule } from 'eslint';
import {
	type Identifier,
	type ImportDeclaration,
	isNodeOfType,
	property,
	type Property,
} from 'eslint-codemod-utils';

import type { RuleConfig } from './types';
import {
	emToPixels,
	findTokenNameByPropertyValue,
	getRawExpression,
	getTokenNodeForValue,
	getTokenReplacement,
	getValue,
	insertTokensImport,
	isAuto,
	isCalc,
	isValidSpacingValue,
	isZero,
	splitShorthandValues,
} from './utils';

export const lintObjectForSpacing = (
	node: Property,
	context: Rule.RuleContext,
	ruleConfig: RuleConfig,
	fontSize: any,
	tokenNode: ImportDeclaration | null,
) => {
	if (isNodeOfType(node.value, 'Literal') && !isValidSpacingValue(node.value.value, fontSize)) {
		context.report({
			node,
			messageId: 'noRawSpacingValues',
			data: {
				payload: `NaN:${node.value.value}`,
			},
		});
		return;
	}

	const propertyName = (node.key as Identifier).name;
	const isFontFamily = /fontFamily/.test(propertyName);

	// Report on CSS calc function for strings
	if (isNodeOfType(node.value, 'Literal') && isCalc(node.value.value)) {
		return context.report({
			node,
			messageId: 'noCalcUsage',
			data: {
				payload: `${propertyName}`,
			},
		});
	}

	const value = getValue(node.value, context);

	// Value is a token string (e.g. set via a variable)
	if (typeof value === 'string' && /\${token\(.*\)}/.test(value)) {
		return;
	}

	// value is either NaN or it can't be resolved (e.g. em, 100% etc...)
	if (!(value && isValidSpacingValue(value, fontSize))) {
		return context.report({
			node,
			messageId: 'noRawSpacingValues',
			data: {
				payload: `NaN:${value}`,
			},
		});
	}

	// The corresponding values for a single CSS property (e.g. padding: '8px 16px 2px' => [8, 16, 2])
	const valuesForProperty = Array.isArray(value) ? value : [value];

	// value is a single value so we can apply a more robust approach to our fix
	// treat fontFamily as having one value
	if (valuesForProperty.length === 1 || isFontFamily) {
		const [value] = valuesForProperty;

		// Do not report or suggest a token to replace 0 or auto
		if (isZero(value) || isAuto(value)) {
			return;
		}

		const pixelValue = isFontFamily ? value : emToPixels(value, fontSize);

		return context.report({
			node,
			messageId: 'noRawSpacingValues',
			data: {
				payload: `${propertyName}:${pixelValue}`,
			},
			fix: (fixer) => {
				// Casting due to possibility of pixelValue being string | number from emToPixels
				const replacementNode =
					pixelValue && getTokenReplacement(propertyName, pixelValue as string);

				if (!replacementNode) {
					return null;
				}

				return (!tokenNode && ruleConfig.applyImport ? [insertTokensImport(fixer)] : []).concat([
					fixer.replaceText(
						node,
						property({
							...node,
							value: replacementNode,
						}).toString(),
					),
				]);
			},
		});
	}

	/**
	 * Compound values are hard to deal with / replace because we need to find/replace strings inside an
	 * estree node.
	 *
	 * @example
	 * { padding: '8px 0px' }
	 */
	valuesForProperty.forEach((val) => {
		if (isCalc(val)) {
			return context.report({
				node,
				messageId: 'noCalcUsage',
				data: {
					payload: `${propertyName}:${val}`,
				},
			});
		}
		const pixelValue = emToPixels(val, fontSize);

		// Do not report or suggest a token to replace 0 or auto
		if (isZero(val) || isAuto(val)) {
			return;
		}

		context.report({
			node,
			messageId: 'noRawSpacingValues',
			data: {
				payload: `${propertyName}:${pixelValue}`,
			},
			fix: (fixer) => {
				const allResolvableValues = valuesForProperty.every(
					(value) => !Number.isNaN(emToPixels(value, fontSize)),
				);
				if (!allResolvableValues) {
					return null;
				}

				// Casting due to possibility of value being string | number
				const valuesWithTokenReplacement = valuesForProperty
					.filter((value) => findTokenNameByPropertyValue(propertyName, value as string))
					.filter((value) => value !== 0);

				if (valuesWithTokenReplacement.length === 0) {
					// all values could be replaceable but that just means they're numeric
					// if none of the values have token replacement we bail
					return null;
				}

				const originalCssString = getRawExpression(node.value, context);
				if (!originalCssString) {
					return null;
				}
				/**
				 * at this stage none of the values are tokens or irreplaceable values
				 * since we know this is shorthand, there will be multiple values
				 * we'll need to remove all quote chars since `getRawExpression` will return those as part of the string
				 * given they're part of the substring of the current node
				 */
				const originalValues = splitShorthandValues(originalCssString.replace(/`|'|"/g, ''));
				if (originalValues.length !== valuesForProperty.length) {
					// we bail just in case original values don't correspond to the replaced values
					return null;
				}

				return (!tokenNode && ruleConfig.applyImport ? [insertTokensImport(fixer)] : []).concat([
					fixer.replaceText(
						node.value,
						`\`${valuesForProperty
							.map((value, index) => {
								if (isZero(value)) {
									return originalValues[index];
								}
								const pixelValue = emToPixels(value, fontSize);
								const pixelValueString = `${pixelValue}px`;
								// if there is a token we take it, otherwise we go with the original value

								// Casting due to possibility of value being string | number
								return findTokenNameByPropertyValue(propertyName, value as string)
									? `\${${getTokenNodeForValue(propertyName, pixelValueString)}}`
									: originalValues[index];
							})
							.join(' ')}\``,
					),
				]);
			},
		});
	});
};
