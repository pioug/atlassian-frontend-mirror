// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import {
	type EslintNode,
	type ImportDeclaration,
	isNodeOfType,
	type ObjectExpression,
} from 'eslint-codemod-utils';

import { getImportSources } from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';
import { includesHardCodedColor } from '../utils/is-color';
import {
	isDecendantOfGlobalToken,
	isDecendantOfStyleBlock,
	isDecendantOfType,
	isDecendantOfXcssBlock,
} from '../utils/is-node';

import {
	lintJSXIdentifierForColor,
	lintJSXLiteralForColor,
	lintJSXMemberForColor,
	lintObjectForColor,
	lintTemplateIdentifierForColor,
} from './color';
import ruleMeta from './rule-meta';
import { lintObjectForSpacing } from './spacing';
import { type RuleConfig } from './types';
import {
	convertHyphenatedNameToCamelCase,
	emToPixels,
	getDomainsForProperty,
	getFontSizeValueInScope,
	getPropertyNodeFromParent,
	getTokenReplacement,
	getValueForPropertyNode,
	getValueFromShorthand,
	getValueFromTemplateLiteralRaw,
	includesTokenString,
	insertTokensImport,
	isAuto,
	isCalc,
	isTokenValueString,
	isValidSpacingValue,
	isZero,
	processCssNode,
	splitShorthandValues,
} from './utils';

const defaultConfig: RuleConfig = {
	domains: ['color', 'spacing'],
	applyImport: true,
	shouldEnforceFallbacks: false,
	failSilently: false,
};

const createWithConfig: (initialConfig: RuleConfig) => Rule.RuleModule['create'] =
	(initialConfig: RuleConfig) => (context: Rule.RuleContext) => {
		const userConfig = context.options[0];
		// merge configs
		const config: RuleConfig = {
			domains: userConfig?.domains || initialConfig.domains,
			applyImport:
				userConfig?.applyImport !== undefined ? userConfig.applyImport : initialConfig.applyImport,
			shouldEnforceFallbacks:
				userConfig?.shouldEnforceFallbacks !== undefined
					? userConfig.shouldEnforceFallbacks
					: initialConfig.shouldEnforceFallbacks,
			exceptions: userConfig?.exceptions || [],
			failSilently: userConfig?.failSilently || defaultConfig.failSilently,
		};

		let tokenNode: ImportDeclaration | null = null;

		return {
			ImportDeclaration: (node) =>
				errorBoundary(
					() => {
						if (node.source.value === '@atlaskit/tokens' && config.applyImport) {
							tokenNode = node;
						}
					},
					{ config },
				),
			// For expressions within template literals (e.g. `color: ${red}`) - color only
			'TemplateLiteral > Identifier': (node: Rule.Node) =>
				errorBoundary(
					() => {
						if (config.domains.includes('color')) {
							return lintTemplateIdentifierForColor(node, context, config);
						}
						return;
					},
					{ config },
				),
			// const styles = css({ color: 'red', margin: '4px' }), styled.div({ color: 'red', margin: '4px' })
			ObjectExpression: (parentNode: Rule.Node) =>
				errorBoundary(
					() => {
						const { references } = context.getScope();
						/**
						 * NOTE: This rule doesn't have an `importSources` config option,
						 * so this will just be equal to DEFAULT_IMPORT_SOURCES (which is fine)
						 */
						const importSources = getImportSources(context);

						// To force the correct node type
						if (!isNodeOfType(parentNode, 'ObjectExpression')) {
							return;
						}

						// Return for nested objects - these get handled automatically so without returning we'd be doubling up
						if (parentNode.parent.type === 'Property') {
							return;
						}

						if (isDecendantOfXcssBlock(parentNode, references, importSources)) {
							return;
						}

						if (
							!isDecendantOfStyleBlock(parentNode) &&
							!isDecendantOfType(parentNode, 'JSXExpressionContainer')
						) {
							return;
						}

						function findObjectStyles(node: EslintNode): void {
							if (!isNodeOfType(node, 'Property')) {
								return;
							}

							if (isNodeOfType(node.value, 'ObjectExpression')) {
								return node.value.properties.forEach(findObjectStyles);
							}

							if (!isNodeOfType(node.key, 'Identifier') && !isNodeOfType(node.key, 'Literal')) {
								return;
							}

							const propertyName = isNodeOfType(node.key, 'Identifier')
								? node.key.name
								: String(node.key.value);

							// Returns which domains to lint against based on rule's config and current property
							const domains = getDomainsForProperty(propertyName, config.domains);

							if (domains.length === 0 || isDecendantOfGlobalToken(node.value)) {
								return;
							}

							if (isNodeOfType(node.value, 'TemplateLiteral')) {
								const value = getValueFromTemplateLiteralRaw(node.value, context);

								if (Array.isArray(value) && value.some(isCalc)) {
									return context.report({
										node,
										messageId: 'noCalcUsage',
										data: {
											payload: `${propertyName}`,
										},
									});
								}

								if (node.value.expressions.some(isDecendantOfGlobalToken)) {
									return;
								}
							}

							if (domains.includes('color')) {
								return lintObjectForColor(node, context, config);
							}

							if (domains.includes('spacing') || domains.includes('shape')) {
								/**
								 * We do this in case the fontSize for a style object is declared alongside the `em` or `lineHeight` declaration.
								 */
								const fontSizeNode = getPropertyNodeFromParent(
									'fontSize',
									parentNode as ObjectExpression & Rule.NodeParentExtension,
								);
								const fontSize = fontSizeNode && getValueForPropertyNode(fontSizeNode, context);

								return lintObjectForSpacing(node, context, config, fontSize, tokenNode);
							}
						}

						parentNode.properties.forEach(findObjectStyles);
					},
					{ config },
				),
			// CSSTemplateLiteral and StyledTemplateLiteral
			// const cssTemplateLiteral = css`color: red; padding: 12px`;
			// const styledTemplateLiteral = styled.p`color: red; padding: 8px`;
			'TaggedTemplateExpression[tag.name="css"],TaggedTemplateExpression[tag.object.name="styled"],TaggedTemplateExpression[tag.callee.name="styled"]':
				(node: Rule.Node) =>
					errorBoundary(
						() => {
							// To force the correct node type
							if (!isNodeOfType(node, 'TaggedTemplateExpression')) {
								return;
							}

							const processedCssLines = processCssNode(node, context);
							if (!processedCssLines) {
								// if we can't get a processed css we bail
								return;
							}
							const globalFontSize = getFontSizeValueInScope(processedCssLines);
							const textForSource = context.getSourceCode().getText(node.quasi);
							const allReplacedValues: string[][] = [];

							const completeSource = processedCssLines.reduce(
								(currentSource, [resolvedCssLine, originalCssLine]) => {
									const [originalProperty, resolvedCssValues] = resolvedCssLine.split(':');
									const [_, originalCssValues] = originalCssLine.split(':');
									const propertyName = convertHyphenatedNameToCamelCase(originalProperty);
									const isFontFamily = /fontFamily/.test(propertyName);
									const replacedValuesPerProperty: string[] = [originalProperty];

									const domains = getDomainsForProperty(propertyName, config.domains);

									if (domains.length === 0 || !resolvedCssValues) {
										// in both of these cases no changes should be made to the current property
										return currentSource;
									}

									if (domains.includes('color')) {
										if (includesTokenString(resolvedCssValues.trim())) {
											return currentSource;
										}

										if (includesHardCodedColor(resolvedCssValues)) {
											context.report({ messageId: 'hardCodedColor', node });
											return currentSource;
										}
									}

									if (domains.includes('spacing') || domains.includes('shape')) {
										if (!isValidSpacingValue(resolvedCssValues, globalFontSize)) {
											// no changes should be made to the current property
											return currentSource;
										}

										// gets the values from the associated property, numeric values or NaN
										const processedNumericValues = getValueFromShorthand(resolvedCssValues);
										const processedValues = splitShorthandValues(resolvedCssValues);
										// only splits shorthand values but it does not transform NaNs so tokens are preserved
										const originalValues = splitShorthandValues(originalCssValues);

										// reconstructing the string
										// should replace what it can and preserve the raw value for everything else

										const replacementValue = processedNumericValues
											// put together resolved value and original value on a tuple
											.map((value, index) => [
												// if emToPX conversion fails we'll default to original value
												emToPixels(value, globalFontSize) || value,
												processedValues[index],
												originalValues[index],
											])
											.map(([numericOrNanValue, pxValue, originalValue]) => {
												if (!originalValue) {
													return originalValue;
												}

												if (isCalc(originalValue)) {
													context.report({
														node,
														messageId: 'noCalcUsage',
														data: {
															payload: `${propertyName}`,
														},
													});
													return originalValue;
												}

												if (isTokenValueString(originalValue as string)) {
													// if the value is already valid, nothing to report or replace
													return originalValue;
												}

												// do not replace 0 or auto with tokens
												if (isZero(pxValue) || isAuto(pxValue)) {
													return originalValue;
												}

												if (isNaN(numericOrNanValue as number) && !isFontFamily) {
													// do not report if we have nothing to replace with
													return originalValue;
												}

												// value is numeric or fontFamily, and needs replacing we'll report first
												context.report({
													node,
													messageId: 'noRawSpacingValues',
													data: {
														payload: `${propertyName}:${numericOrNanValue}`,
													},
												});

												// from here on we know value is numeric or a font family, so it might or might not have a token equivalent
												const replacementNode = getTokenReplacement(
													propertyName,
													numericOrNanValue as string,
												);

												if (!replacementNode) {
													return originalValue;
												}

												const replacementToken = '${' + replacementNode.toString() + '}';

												replacedValuesPerProperty.push(
													isFontFamily ? (numericOrNanValue as any).trim() : pxValue,
												);
												return replacementToken;
											})
											.join(' ');

										if (replacedValuesPerProperty.length > 1) {
											// first value is the property name, so it will always have at least 1
											allReplacedValues.push(replacedValuesPerProperty);
										}

										// replace property:val with new property:val
										const replacedCssLine: string = currentSource.replace(
											originalCssLine, //  padding: ${gridSize()}px;
											`${originalProperty}: ${replacementValue}`,
										);

										if (!replacedCssLine) {
											return currentSource;
										}

										return replacedCssLine;
									}
									return currentSource;
								},
								textForSource,
							);

							if (completeSource !== textForSource) {
								// means we found some replacement values, we'll give the option to fix them

								context.report({
									node,
									messageId: 'autofixesPossible',
									fix: (fixer) => {
										return (
											!tokenNode && config.applyImport ? [insertTokensImport(fixer)] : []
										).concat([fixer.replaceText(node.quasi, completeSource)]);
									},
								});
							}
						},
						{ config },
					),

			// For inline JSX styles - literals (e.g. <Test color="red"/>) - color only
			'JSXAttribute > Literal': (node: Rule.Node) =>
				errorBoundary(
					() => {
						if (config.domains.includes('color')) {
							return lintJSXLiteralForColor(node, context, config);
						}
						return;
					},
					{ config },
				),

			// For inline JSX styles - members (e.g. <Test color={color.red}/>) - color only
			'JSXExpressionContainer > MemberExpression': (node: Rule.Node) =>
				errorBoundary(
					() => {
						if (config.domains.includes('color')) {
							return lintJSXMemberForColor(node, context, config);
						}
						return;
					},
					{ config },
				),

			// For inline JSX styles - identifiers (e.g. <Test color={red}/>) - color only
			'JSXExpressionContainer > Identifier': (node: Rule.Node) =>
				errorBoundary(
					() => {
						if (config.domains.includes('color')) {
							return lintJSXIdentifierForColor(node, context, config);
						}
						return;
					},
					{ config },
				),
		};
	};

const rule = createLintRule({
	meta: ruleMeta,
	create: createWithConfig(defaultConfig),
});

export default rule;
export { createWithConfig };
