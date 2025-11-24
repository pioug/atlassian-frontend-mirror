import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const rule = createLintRule({
	meta: {
		name: 'lozenge-isBold-and-lozenge-badge-appearance-migration',
		fixable: 'code',
		type: 'suggestion',
		docs: {
			description:
				'Helps migrate Lozenge isBold prop and appearance values (for both Lozenge and Badge components) as part of the Labelling System Phase 1 migration.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			updateAppearance: 'Update appearance value to new semantic value.',
			migrateTag: 'Non-bold <Lozenge> variants should migrate to <Tag> component.',
			manualReview: "Dynamic 'isBold' props require manual review before migration.",
			updateBadgeAppearance:
				'Update Badge appearance value "{{oldValue}}" to new semantic value "{{newValue}}".',
			dynamicBadgeAppearance:
				'Dynamic appearance prop values require manual review to ensure they use the new semantic values: neutral, information, inverse, danger, success.',
		},
	},

	create(context: Rule.RuleContext) {
		/**
		 * Contains a map of imported Lozenge components.
		 */
		const lozengeImports: Record<string, string> = {}; // local name -> import source

		/**
		 * Contains a map of imported Badge components.
		 */
		const badgeImports: Record<string, string> = {}; // local name -> import source

		/**
		 * Check if a JSX attribute value is a literal false
		 */
		function isLiteralFalse(node: any): boolean {
			return (
				node &&
				node.type === 'JSXExpressionContainer' &&
				node.expression &&
				node.expression.type === 'Literal' &&
				node.expression.value === false
			);
		}

		/**
		 * Check if a JSX attribute value is dynamic (not a static literal value)
		 * Can be used for any prop type (boolean, string, etc.)
		 */
		function isDynamicExpression(node: any): boolean {
			if (!node) {
				return false;
			}

			// If it's a plain literal (e.g., appearance="value"), it's not dynamic
			if (node.type === 'Literal') {
				return false;
			}

			// If it's an expression container with a non-literal expression, it's dynamic
			if (node.type === 'JSXExpressionContainer') {
				const expr = node.expression;
				return expr && expr.type !== 'Literal';
			}

			return false;
		}

		/**
		 * Get all attributes as an object for easier manipulation
		 */
		function getAttributesMap(attributes: any[]): Record<string, any> {
			const map: Record<string, any> = {};
			attributes.forEach((attr) => {
				if (attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier') {
					map[attr.name.name] = attr;
				}
			});
			return map;
		}

		/**
		 * Map old appearance values to new semantic appearance values
		 * Both Lozenge and Tag now use the same appearance prop with new semantic values
		 */
		function mapToNewAppearanceValue(oldValue: string): string {
			const mapping: Record<string, string> = {
				success: 'success',
				default: 'default',
				removed: 'removed',
				inprogress: 'inprogress',
				new: 'new',
				moved: 'moved',
			};
			// TODO: Update this mapping based on actual new semantic values when provided
			return mapping[oldValue] || oldValue;
		}

		/**
		 * Map Badge old appearance values to new semantic appearance values
		 */
		function mapBadgeToNewAppearanceValue(oldValue: string): string {
			const mapping: Record<string, string> = {
				added: 'success',
				removed: 'danger',
				default: 'neutral',
				primary: 'information',
				primaryInverted: 'inverse',
				important: 'danger',
			};
			return mapping[oldValue] || oldValue;
		}

		/**
		 * Extract the string value from a JSX attribute value
		 */
		function extractStringValue(attrValue: any): string | null {
			if (!attrValue) {
				return null;
			}

			if (attrValue.type === 'Literal') {
				return attrValue.value;
			}

			if (
				attrValue.type === 'JSXExpressionContainer' &&
				attrValue.expression &&
				attrValue.expression.type === 'Literal'
			) {
				return attrValue.expression.value;
			}

			return null;
		}

		/**
		 * Create a fixer function to replace an appearance prop value
		 * Handles both Literal and JSXExpressionContainer with Literal
		 */
		function createAppearanceFixer(attrValue: any, newValue: string) {
			return (fixer: any) => {
				if (!attrValue) {
					return null;
				}

				if (attrValue.type === 'Literal') {
					return fixer.replaceText(attrValue, `"${newValue}"`);
				}

				if (
					attrValue.type === 'JSXExpressionContainer' &&
					'expression' in attrValue &&
					attrValue.expression &&
					attrValue.expression.type === 'Literal'
				) {
					return fixer.replaceText(attrValue.expression, `"${newValue}"`);
				}

				return null;
			};
		}

		/**
		 * Generate the replacement JSX element text
		 */
		function generateTagReplacement(node: any): string {
			const sourceCode = context.getSourceCode();
			const attributes = node.openingElement.attributes;

			// Build new attributes array, excluding isBold and mapping appearance values to new semantics
			const newAttributes: string[] = [];

			attributes.forEach((attr: any) => {
				if (attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier') {
					const attrName = attr.name.name;

					if (attrName === 'isBold') {
						// Skip isBold attribute
						return;
					}

					if (attrName === 'appearance') {
						// Map appearance value to new semantic value but keep the prop name as appearance
						const stringValue = extractStringValue(attr.value);
						if (stringValue && typeof stringValue === 'string') {
							const mappedAppearance = mapToNewAppearanceValue(stringValue);
							newAttributes.push(`appearance="${mappedAppearance}"`);
						} else {
							// If we can't extract the string value, keep as-is with appearance prop
							const value = attr.value ? sourceCode.getText(attr.value) : '';
							newAttributes.push(`appearance${value ? `=${value}` : ''}`);
						}
						return;
					}

					// Keep all other attributes
					newAttributes.push(sourceCode.getText(attr));
				} else if (attr.type === 'JSXSpreadAttribute') {
					// Keep spread attributes
					newAttributes.push(sourceCode.getText(attr));
				}
			});

			const attributesText = newAttributes.length > 0 ? ` ${newAttributes.join(' ')}` : '';
			const children =
				node.children.length > 0
					? sourceCode
							.getText()
							.slice(
								node.openingElement.range[1],
								node.closingElement ? node.closingElement.range[0] : node.range[1],
							)
					: '';

			if (node.closingElement) {
				return `<Tag${attributesText}>${children}</Tag>`;
			} else {
				return `<Tag${attributesText} />`;
			}
		}

		return {
			ImportDeclaration(node) {
				const moduleSource = node.source.value;
				if (typeof moduleSource === 'string') {
					// Track Lozenge imports
					if (
						moduleSource === '@atlaskit/lozenge' ||
						moduleSource.startsWith('@atlaskit/lozenge')
					) {
						node.specifiers.forEach((spec) => {
							if (spec.type === 'ImportDefaultSpecifier') {
								lozengeImports[spec.local.name] = moduleSource;
							} else if (spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier') {
								if (spec.imported.name === 'Lozenge') {
									lozengeImports[spec.local.name] = moduleSource;
								}
							}
						});
					}
					// Track Badge imports
					if (moduleSource === '@atlaskit/badge' || moduleSource.startsWith('@atlaskit/badge')) {
						node.specifiers.forEach((spec) => {
							if (spec.type === 'ImportDefaultSpecifier') {
								badgeImports[spec.local.name] = moduleSource;
							} else if (spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier') {
								if (spec.imported.name === 'Badge' || spec.imported.name === 'default') {
									badgeImports[spec.local.name] = moduleSource;
								}
							}
						});
					}
				}
			},

			JSXElement(node: any) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}
				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				const elementName = node.openingElement.name.name;

				// Handle Badge components
				if (badgeImports[elementName]) {
					// Find the appearance prop
					const appearanceProp = node.openingElement.attributes.find(
						(attr: any) =>
							attr.type === 'JSXAttribute' &&
							attr.name.type === 'JSXIdentifier' &&
							attr.name.name === 'appearance',
					);

					if (!appearanceProp || appearanceProp.type !== 'JSXAttribute') {
						// No appearance prop or it's a spread attribute, nothing to migrate
						return;
					}

					// Check if it's a dynamic expression
					if (isDynamicExpression(appearanceProp.value)) {
						context.report({
							node: appearanceProp,
							messageId: 'dynamicBadgeAppearance',
						});
						return;
					}

					// Extract the string value
					const stringValue = extractStringValue(appearanceProp.value);
					if (stringValue && typeof stringValue === 'string') {
						const mappedValue = mapBadgeToNewAppearanceValue(stringValue);
						if (mappedValue !== stringValue) {
							context.report({
								node: appearanceProp,
								messageId: 'updateBadgeAppearance',
								data: {
									oldValue: stringValue,
									newValue: mappedValue,
								},
								fix: createAppearanceFixer(appearanceProp.value, mappedValue),
							});
						}
					}
					return;
				}

				// Only process if this is a Lozenge component we've imported
				if (!lozengeImports[elementName]) {
					return;
				}

				const attributesMap = getAttributesMap(node.openingElement.attributes);
				const appearanceProp = attributesMap.appearance;
				const isBoldProp = attributesMap.isBold;

				// Handle appearance prop value migration
				if (appearanceProp) {
					const shouldMigrateToTag = !isBoldProp || isLiteralFalse(isBoldProp.value);
					if (!shouldMigrateToTag) {
						// Only update appearance values for Lozenge components that stay as Lozenge
						const stringValue = extractStringValue(appearanceProp.value);
						if (stringValue && typeof stringValue === 'string') {
							const mappedValue = mapToNewAppearanceValue(stringValue);
							if (mappedValue !== stringValue) {
								context.report({
									node: appearanceProp,
									messageId: 'updateAppearance',
									fix: createAppearanceFixer(appearanceProp.value, mappedValue),
								});
							}
						}
					}
				}

				// Handle isBold prop and Tag migration
				if (isBoldProp) {
					if (isLiteralFalse(isBoldProp.value)) {
						// isBold={false} should migrate to Tag
						context.report({
							node: node,
							messageId: 'migrateTag',
							fix: (fixer) => {
								const replacement = generateTagReplacement(node);
								return fixer.replaceText(node, replacement);
							},
						});
					} else if (isDynamicExpression(isBoldProp.value)) {
						// Dynamic isBold requires manual review
						context.report({
							node: isBoldProp,
							messageId: 'manualReview',
						});
					}
					// isBold={true} or isBold (implicit true) - no action needed
				} else {
					// No isBold prop means implicit false, should migrate to Tag
					context.report({
						node: node,
						messageId: 'migrateTag',
						fix: (fixer) => {
							const replacement = generateTagReplacement(node);
							return fixer.replaceText(node, replacement);
						},
					});
				}
			},
		};
	},
});

export default rule;
