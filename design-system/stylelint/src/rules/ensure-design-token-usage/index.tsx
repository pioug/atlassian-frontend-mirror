import valueParser, { type Node } from 'postcss-value-parser';
import stylelint, { type Rule, type RuleBase } from 'stylelint';

import { isColorFunction, isHexColor, isNamedColor } from '../../utils/colors';
import { isFunction, isSpacingRule, isTypographyRule, isVar } from '../../utils/rules';
import { getSpacingToken, isLengthOrPercentage } from '../../utils/spacing';
import { isToken } from '../../utils/tokens';

const defaultIsEnabled = {
	color: true,
	spacing: false,
	typography: false,
	nonTokenCssVariables: false,
};

export const ruleName = 'design-system/ensure-design-token-usage';

const tokenUrl = 'https://atlassian.design/components/tokens/examples';
export const messages: {
    noHardcodedColors: string;
    noHardcodedSpacing: string;
    noHardcodedTypography: string;
    noNonTokenVars: string;
} = stylelint.utils.ruleMessages(ruleName, {
	noHardcodedColors: `Color values should be design tokens. See ${tokenUrl} for guidance.`,
	noHardcodedSpacing: `Spacing values should be design tokens. See ${tokenUrl} for guidance.`,
	noHardcodedTypography: `Typography values should be design tokens. See ${tokenUrl} for guidance.`,
	noNonTokenVars: 'CSS variables should be wrapped in a design token.',
});

const isColorNode = (node: Node) => {
	switch (node.type) {
		case 'function':
			return isColorFunction(node.value);
		case 'word':
			return isHexColor(node.value) || isNamedColor(node.value);
	}
};

const ruleBase: RuleBase = (isEnabled = defaultIsEnabled, _secondaryOptions, context) => {
	return (root, result) => {
		// Map to store spacing values for each declaration during fix mode
		// This allows us to collect all spacing values before applying fixes
		// to avoid position shifting issues when modifying the AST
		const declarationSpacingValues = new Map();
		const validOptions = stylelint.utils.validateOptions(result, ruleName, {
			actual: isEnabled,
			possible: {
				color: [true, false],
				spacing: [true, false],
				typography: [true, false],
				nonTokenCssVariables: [true, false],
			},
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			valueParser(decl.value).walk((node) => {
				if (isEnabled.color) {
					if (isFunction(node) && isVar(node)) {
						if (isToken(node.nodes[0])) {
							return false;
						}

						if (isEnabled.nonTokenCssVariables && !isToken(node.nodes[0])) {
							/**
							 * If we find a var, ensure it's a token var
							 */
							stylelint.utils.report({
								message: messages.noNonTokenVars,
								node: decl,
								word: node.value,
								result,
								ruleName,
							});

							return false;
						}
					}

					/**
					 * If we find a color function (rgba, hsl) or color (#eee), ensure it's a token
					 */
					if (isColorNode(node)) {
						stylelint.utils.report({
							message: messages.noHardcodedColors,
							node: decl,
							word: node.value,
							result,
							ruleName,
						});

						return false;
					}
				}

				if (isEnabled.spacing) {
					// Rule is gap, margin, padding, etc
					if (isSpacingRule(decl.prop)) {
						if (isFunction(node) && isVar(node)) {
							// A valid token was used, exit
							if (isToken(node.nodes[0])) {
								return false;
							}

							// A variable that isn't a token was used in a spacing rule
							// Only report in lint mode, not fix mode to avoid duplicate reports
							if (!context.fix) {
								stylelint.utils.report({
									message: messages.noHardcodedSpacing,
									node: decl,
									word: node.value,
									result,
									ruleName,
								});
							}
							return false;
						}

						/**
						 * Report on px, cm, in, etc
						 * This is necessary because we walk multiple types of nodes.
						 * So we need to first check whether it's a value that's a length
						 * or percentage so we don't report on other types of nodes like
						 * 'prop'.
						 */
						if (isLengthOrPercentage(node.value)) {
							// Check if we can auto-fix this spacing value by mapping it to a spacing token
							const spacingToken = getSpacingToken(node.value);

							// In fix mode, handle differently to collect values for post-processing
							if (context.fix) {
								// Store all spacing values for post-processing to avoid position shifting
								if (!declarationSpacingValues.has(decl)) {
									declarationSpacingValues.set(decl, []);
								}
								declarationSpacingValues.get(decl).push({
									originalValue: node.value,
									spacingToken,
									shouldReport: !spacingToken,
									originalNode: { ...node }, // Store a copy of the node for later use
								});
								return false; // Don't report yet - handle in post-processing
							} else {
								// In lint mode (not fix mode), report errors immediately
								stylelint.utils.report({
									message: messages.noHardcodedSpacing,
									node: decl,
									word: node.value,
									result,
									ruleName,
								});
								return false;
							}
						}
					}
				}

				if (isEnabled.typography) {
					// Rule is font-size, line-height, etc
					if (isTypographyRule(decl.prop)) {
						if (isFunction(node) && isVar(node)) {
							// A valid token was used, exit
							if (isToken(node.nodes[0])) {
								return false;
							}

							// A variable that isn't a token was used in a spacing rule
							stylelint.utils.report({
								message: messages.noHardcodedTypography,
								node: decl,
								word: node.value,
								result,
								ruleName,
							});

							return false;
						}

						/**
						 * Report on px, cm, in, etc
						 * This is necessary because we walk multiple types of nodes.
						 * So we need to first check whether it's a value that's a length
						 * or percentage so we don't report on other types of nodes like
						 * 'prop'.
						 */
						if (isLengthOrPercentage(node.value)) {
							stylelint.utils.report({
								message: messages.noHardcodedTypography,
								node: decl,
								word: node.value,
								result,
								ruleName,
							});

							return false;
						}
					}
				}
			});
		});

		// Post-process spacing values in fix mode
		// This section handles the actual auto-fixing of spacing values to design tokens
		if (context.fix) {
			declarationSpacingValues.forEach((spacingValues: any[], decl: any) => {
				// First, report errors using original positions before any modifications
				// This ensures error messages are accurate even after fixes are applied
				const reportableValues = spacingValues.filter((sv: any) => sv.shouldReport);

				reportableValues.forEach((spacingValue: any) => {
					stylelint.utils.report({
						message: messages.noHardcodedSpacing,
						node: decl,
						word: spacingValue.originalValue,
						result,
						ruleName,
					});
				});

				// Then apply fixes from right to left to avoid position shifting
				const parsedValue = valueParser(decl.value);

				// Collect positions for fixing by walking the parsed value again
				const valuePositions: any[] = [];
				parsedValue.walk((node) => {
					if (node.type === 'word') {
						// Find matching spacing values that have valid tokens for replacement
						const matchingSpacingValue = spacingValues.find(
							(sv: any) => sv.originalValue === node.value && sv.spacingToken,
						);
						if (matchingSpacingValue) {
							valuePositions.push({
								node: node,
								spacingValue: matchingSpacingValue,
								sourceIndex: node.sourceIndex || 0,
							});
						}
					}
				});

				// Sort by position (highest first = right to left) and apply fixes
				// This prevents position shifting issues when modifying multiple values
				valuePositions
					.sort((a: any, b: any) => b.sourceIndex - a.sourceIndex)
					.forEach(({ node, spacingValue }: any) => {
						node.value = spacingValue.spacingToken;
					});

				// Update the declaration value with all fixes applied
				decl.value = parsedValue.toString();
			});
		}
	};
};

const rule: Rule<any, any> = Object.assign(ruleBase, {
	ruleName: ruleName,
	messages: messages,
	meta: {
		url: tokenUrl,
		fixable: true,
	},
});

const plugin: stylelint.Plugin = stylelint.createPlugin(ruleName, rule);

export default plugin;
