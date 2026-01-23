import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const rule = createLintRule({
	meta: {
		name: 'lozenge-badge-tag-labelling-system-migration',
		fixable: 'code',
		type: 'suggestion',
		docs: {
			description:
				'Helps migrate Lozenge isBold prop, Badge appearance values, and SimpleTag/RemovableTag components as part of the Labelling System Phase 1 migration.',
			recommended: false,
			severity: 'warn',
		},
		messages: {
			updateAppearance: 'Update appearance value to new semantic value.',
			migrateTag:
				'Non-bold <Lozenge> variants should migrate to <Tag> component. For safe, staged rollout, use the `migration_fallback="lozenge"` prop which renders as Lozenge when the feature flag is off.',
			manualReview: "Dynamic 'isBold' props require manual review before migration.",
			dynamicLozengeAppearance:
				"Dynamic 'appearance' prop values require manual review before migrating to Tag. Please verify the appearance value and manually convert it to the appropriate color prop value.",
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
		 * Contains a map of imported Tag components (SimpleTag, RemovableTag, or default Tag imports).
		 * Maps local name to { type: 'SimpleTag' | 'RemovableTag' | 'Tag', source: string, node: ImportNode }
		 */
		const tagImports: Record<string, { type: string; source: string; node?: any }> = {};

		/**
		 * Tracks which tag imports need to migrate to Tag (default) or AvatarTag (named)
		 * Maps local name to migration target: 'Tag' | 'AvatarTag'
		 */
		const tagMigrationTargets: Record<string, 'Tag' | 'AvatarTag'> = {};

		/**
		 * Tracks import declaration nodes that need to be updated
		 */
		const importDeclarationsToUpdate: Set<any> = new Set();

		/**
		 * Contains a map of imported Avatar components from @atlaskit/avatar.
		 * Maps local name to import source
		 */
		const avatarImports: Record<string, string> = {};

		/**
		 * Contains a map of imported Tag and AvatarTag components from @atlaskit/tag.
		 * These are the new components that should not be migrated.
		 * Maps local name to import source
		 */
		const newTagImports: Record<string, string> = {};

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
			return mapping[oldValue] || oldValue;
		}

		/**
		 * Map Lozenge appearance values to Tag color values
		 * Used when migrating Lozenge to Tag component
		 */
		function mapLozengeAppearanceToTagColor(appearanceValue: string): string {
			const mapping: Record<string, string> = {
				success: 'lime',
				default: 'gray',
				removed: 'red',
				inprogress: 'blue',
				new: 'purple',
				moved: 'yellow',
			};
			return mapping[appearanceValue] || appearanceValue;
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
		 * Map Tag color light variants to semantic color values
		 */
		function mapTagColorValue(oldValue: string): string {
			const mapping: Record<string, string> = {
				limeLight: 'lime',
				orangeLight: 'orange',
				magentaLight: 'magenta',
				greenLight: 'green',
				blueLight: 'blue',
				redLight: 'red',
				purpleLight: 'purple',
				greyLight: 'gray',
				tealLight: 'teal',
				yellowLight: 'yellow',
				grey: 'gray',
			};
			return mapping[oldValue] || oldValue;
		}

		/**
		 * Check if elemBefore prop contains only an Avatar component from @atlaskit/avatar
		 * Returns the Avatar component name if it's from the avatar package, null otherwise
		 */
		function getAvatarComponentName(elemBeforeProp: any): string | null {
			if (!elemBeforeProp || !elemBeforeProp.value) {
				return null;
			}

			const value = elemBeforeProp.value;

			// Check for JSX element: <Avatar ... />
			if (value.type === 'JSXElement' && value.openingElement.name.name === 'Avatar') {
				const avatarName = value.openingElement.name.name;
				if (avatarImports[avatarName]) {
					return avatarName;
				}
			}

			// Check for JSX expression container: {<Avatar ... />}
			if (value.type === 'JSXExpressionContainer' && value.expression) {
				// Direct JSX element: {<Avatar ... />}
				if (
					value.expression.type === 'JSXElement' &&
					value.expression.openingElement.name.name === 'Avatar'
				) {
					const avatarName = value.expression.openingElement.name.name;
					if (avatarImports[avatarName]) {
						return avatarName;
					}
				}

				// Arrow function: {() => <Avatar ... />}
				if (value.expression.type === 'ArrowFunctionExpression') {
					const body = value.expression.body;
					if (body.type === 'JSXElement' && body.openingElement.name.name === 'Avatar') {
						const avatarName = body.openingElement.name.name;
						if (avatarImports[avatarName]) {
							return avatarName;
						}
					}
				}
			}

			return null;
		}

		/**
		 * Check if color prop value needs mapping
		 */
		function colorNeedsMapping(colorProp: any): boolean {
			if (!colorProp?.value) {
				return false;
			}
			const stringValue = extractStringValue(colorProp.value);
			return (
				stringValue !== null &&
				typeof stringValue === 'string' &&
				mapTagColorValue(stringValue) !== stringValue
			);
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
		 * Generate the replacement JSX element text for Tag migration
		 * Handles both regular Tag and avatarTag migrations
		 */
		function generateTagReplacement(
			node: any,
			options: {
				isAvatarTag?: boolean;
				isSimpleTag?: boolean;
				isLozengeMigration?: boolean;
				preserveComponentName?: boolean;
			} = {},
		): string {
			const sourceCode = context.getSourceCode();
			const attributes = node.openingElement.attributes;

			// Build new attributes array
			const newAttributes: string[] = [];

			attributes.forEach((attr: any) => {
				if (attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier') {
					const attrName = attr.name.name;

					if (attrName === 'isBold') {
						// Skip isBold attribute
						return;
					}

					if (attrName === 'appearance') {
						// For Lozenge migrations, convert appearance to color prop
						// For SimpleTag/RemovableTag migrations, delete appearance prop
						if (options.isLozengeMigration) {
							// Map Lozenge appearance value to Tag color value and change prop name from appearance to color
							const stringValue = extractStringValue(attr.value);
							if (stringValue && typeof stringValue === 'string') {
								const mappedColor = mapLozengeAppearanceToTagColor(stringValue);
								newAttributes.push(`color="${mappedColor}"`);
							}
							// If we can't extract the string value (dynamic expression), skip it
							// Dynamic expressions should be caught earlier and require manual review
							// This code path shouldn't be reached, but we skip to be safe
						}
						// For SimpleTag/RemovableTag migrations, skip appearance prop (delete it)
						return;
					}

					if (attrName === 'color') {
						// For avatar tag, skip color prop; for regular tag, map color value
						// Note: Lozenge doesn't have a color prop, but Tag/SimpleTag/RemovableTag do
						if (options.isAvatarTag) {
							return;
						}
						const stringValue = extractStringValue(attr.value);
						if (stringValue && typeof stringValue === 'string') {
							const mappedColor = mapTagColorValue(stringValue);
							newAttributes.push(`color="${mappedColor}"`);
						} else {
							// If we can't extract the string value, keep as-is
							const value = attr.value ? sourceCode.getText(attr.value) : '';
							newAttributes.push(`color${value ? `=${value}` : ''}`);
						}
						return;
					}

					if (attrName === 'elemBefore') {
						// For avatar tag, rename elemBefore to avatar and use render props
						if (options.isAvatarTag) {
							const elemBeforeValue = attr.value;
							let avatarElement: any = null;

							// Extract Avatar element from various formats
							if (elemBeforeValue.type === 'JSXElement') {
								avatarElement = elemBeforeValue;
							} else if (elemBeforeValue.type === 'JSXExpressionContainer') {
								const expr = elemBeforeValue.expression;
								// Direct JSX element: {<Avatar ... />}
								if (expr.type === 'JSXElement') {
									avatarElement = expr;
								}
								// Arrow function: {() => <Avatar ... />}
								else if (
									expr.type === 'ArrowFunctionExpression' &&
									expr.body.type === 'JSXElement'
								) {
									avatarElement = expr.body;
								}
							}

							if (avatarElement) {
								// Generate render props: avatar={(props) => <Avatar {...props} ... />}
								const avatarElementText = sourceCode.getText(avatarElement);
								// Add {...props} spread to the Avatar element attributes
								const avatarWithProps = avatarElementText.replace(
									/<Avatar\s/,
									'<Avatar {...props} ',
								);
								newAttributes.push(`avatar={(props) => ${avatarWithProps}}`);
							}
							return;
						}
						// For regular tag, keep elemBefore as-is
						newAttributes.push(sourceCode.getText(attr));
						return;
					}

					// Keep all other attributes
					newAttributes.push(sourceCode.getText(attr));
				} else if (attr.type === 'JSXSpreadAttribute') {
					// Keep spread attributes
					newAttributes.push(sourceCode.getText(attr));
				}
			});

			// Add isRemovable={false} for SimpleTag migrations and Lozenge migrations
			if (options.isSimpleTag || options.isLozengeMigration) {
				newAttributes.push('isRemovable={false}');
			}

			// Add migration_fallback="lozenge" for Lozenge migrations to enable safe staged rollout
			if (options.isLozengeMigration) {
				newAttributes.push('migration_fallback="lozenge"');
			}

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

			const componentName = options.preserveComponentName
				? node.openingElement.name.name
				: options.isAvatarTag
					? 'AvatarTag'
					: 'Tag';

			if (node.closingElement) {
				return `<${componentName}${attributesText}>${children}</${componentName}>`;
			} else {
				return `<${componentName}${attributesText} />`;
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
					// Track Tag imports (SimpleTag, RemovableTag only - not the new Tag component)
					if (moduleSource === '@atlaskit/tag' || moduleSource.startsWith('@atlaskit/tag')) {
						node.specifiers.forEach((spec) => {
							if (spec.type === 'ImportDefaultSpecifier') {
								// Check for default imports from subpaths and main package
								if (moduleSource === '@atlaskit/tag/simple-tag') {
									// Default import from @atlaskit/tag/simple-tag is a SimpleTag
									tagImports[spec.local.name] = {
										type: 'SimpleTag',
										source: moduleSource,
										node: { ...spec, parent: node },
									};
									importDeclarationsToUpdate.add(node);
								} else if (
									moduleSource === '@atlaskit/tag/removable-tag' ||
									moduleSource === '@atlaskit/tag'
								) {
									// Default import from @atlaskit/tag/removable-tag or @atlaskit/tag is a RemovableTag
									tagImports[spec.local.name] = {
										type: 'RemovableTag',
										source: moduleSource,
										node: { ...spec, parent: node },
									};
									importDeclarationsToUpdate.add(node);
								}
							} else if (spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier') {
								const importName = spec.imported.name;
								if (importName === 'SimpleTag' || importName === 'RemovableTag') {
									tagImports[spec.local.name] = {
										type: importName,
										source: moduleSource,
										node: { ...spec, parent: node },
									};
									// Mark this import declaration for potential updates
									importDeclarationsToUpdate.add(node);
								} else if (importName === 'AvatarTag') {
									// Track new AvatarTag component - it should not be migrated
									newTagImports[spec.local.name] = moduleSource;
								}
								// Note: Tag from named imports is not skipped - it may still need migration
								// (e.g., if it has appearance prop or other old props)
							}
						});
					}
					// Track Avatar imports
					if (moduleSource === '@atlaskit/avatar' || moduleSource.startsWith('@atlaskit/avatar')) {
						node.specifiers.forEach((spec) => {
							if (spec.type === 'ImportDefaultSpecifier') {
								avatarImports[spec.local.name] = moduleSource;
							} else if (spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier') {
								if (spec.imported.name === 'Avatar') {
									avatarImports[spec.local.name] = moduleSource;
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

				// Skip new AvatarTag component - it should not be migrated
				if (newTagImports[elementName]) {
					return;
				}

				// Handle SimpleTag, RemovableTag, and Tag migrations
				if (tagImports[elementName]) {
					const tagImportInfo = tagImports[elementName];
					const attributesMap = getAttributesMap(node.openingElement.attributes);
					const {
						elemBefore: elemBeforeProp,
						avatar: avatarProp,
						appearance: appearanceProp,
						color: colorProp,
					} = attributesMap;

					// For default import from @atlaskit/tag, check if it's already the new Tag
					if (tagImportInfo.type === 'RemovableTag' && tagImportInfo.source === '@atlaskit/tag') {
						// If using avatar prop, it's already the new Tag
						if (avatarProp) {
							return;
						}

						// Check if component name is already correct and nothing needs migration
						if (elementName === 'Tag' || elementName === 'AvatarTag') {
							const needsNameChange = false;
							const needsMigration =
								needsNameChange || appearanceProp || colorNeedsMapping(colorProp);
							if (!needsMigration) {
								// Still need to check elemBefore for Avatar
								if (elemBeforeProp) {
									const hasAvatarInElemBefore = getAvatarComponentName(elemBeforeProp) !== null;
									if (hasAvatarInElemBefore) {
										// Has Avatar in elemBefore, needs migration to AvatarTag
									} else {
										// No Avatar, nothing to migrate
										return;
									}
								} else {
									// No elemBefore, nothing to migrate
									return;
								}
							}
							// If we get here, something needs migration
						}
					}

					// Determine migration target based on elemBefore containing Avatar
					const hasAvatarInElemBefore = elemBeforeProp
						? getAvatarComponentName(elemBeforeProp) !== null
						: false;
					const migrationTarget = hasAvatarInElemBefore ? 'AvatarTag' : 'Tag';

					// Record the migration target for this import
					tagMigrationTargets[elementName] = migrationTarget;

					// Migrate the JSX element
					context.report({
						node: node,
						messageId: 'migrateTag',
						fix: (fixer: any) => {
							const fixes = [];

							// Fix the JSX element
							const replacement = generateTagReplacement(node, {
								isAvatarTag: hasAvatarInElemBefore,
								isSimpleTag: !hasAvatarInElemBefore && tagImportInfo.type === 'SimpleTag',
							});
							fixes.push(fixer.replaceText(node, replacement));

							// Fix the import statement for named imports, subpath default imports, and main package default imports
							const isSubpathImport =
								tagImportInfo.node?.parent?.source?.value === '@atlaskit/tag/simple-tag' ||
								tagImportInfo.node?.parent?.source?.value === '@atlaskit/tag/removable-tag';
							const isMainPackageDefaultImport =
								tagImportInfo.node?.parent?.source?.value === '@atlaskit/tag' &&
								tagImportInfo.node?.type === 'ImportDefaultSpecifier';

							if (
								isSubpathImport ||
								isMainPackageDefaultImport ||
								(tagImportInfo.node?.parent?.source?.value === '@atlaskit/tag' &&
									tagImportInfo.node?.type === 'ImportSpecifier')
							) {
								const importNode = tagImportInfo.node?.parent;
								if (importNode) {
									const sourceCode = context.getSourceCode();
									const mainModuleSource = '@atlaskit/tag';

									// Get all other specifiers that are not SimpleTag or RemovableTag
									// For subpath imports and main package default imports, exclude the default specifier itself
									const otherSpecifiers = importNode.specifiers
										.filter((spec: any) => {
											// Skip default specifiers from subpath imports and main package - they're being replaced
											if (
												spec.type === 'ImportDefaultSpecifier' &&
												(isSubpathImport || isMainPackageDefaultImport)
											) {
												return false;
											}
											if (spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier') {
												const importName = spec.imported.name;
												return importName !== 'SimpleTag' && importName !== 'RemovableTag';
											}
											return false;
										})
										.map((spec: any) => sourceCode.getText(spec));

									let newImportText = '';

									if (migrationTarget === 'Tag') {
										if (otherSpecifiers.length > 0) {
											newImportText = `import Tag, { ${otherSpecifiers.join(', ')} } from '${mainModuleSource}';`;
										} else {
											newImportText = `import Tag from '${mainModuleSource}';`;
										}
									} else if (migrationTarget === 'AvatarTag') {
										if (otherSpecifiers.length > 0) {
											newImportText = `import { AvatarTag, ${otherSpecifiers.join(', ')} } from '${mainModuleSource}';`;
										} else {
											newImportText = `import { AvatarTag } from '${mainModuleSource}';`;
										}
									}

									if (newImportText) {
										fixes.push(fixer.replaceText(importNode, newImportText));
									}
								}
							}

							return fixes.length === 1 ? fixes[0] : fixes;
						},
					});
					return;
				}

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
						// Check if appearance is dynamic - if so, require manual review
						if (appearanceProp && isDynamicExpression(appearanceProp.value)) {
							context.report({
								node: appearanceProp,
								messageId: 'dynamicLozengeAppearance',
							});
							return;
						}
						context.report({
							node: node,
							messageId: 'migrateTag',
							fix: (fixer) => {
								const replacement = generateTagReplacement(node, { isLozengeMigration: true });
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
					// Check if appearance is dynamic - if so, require manual review
					if (appearanceProp && isDynamicExpression(appearanceProp.value)) {
						context.report({
							node: appearanceProp,
							messageId: 'dynamicLozengeAppearance',
						});
						return;
					}
					context.report({
						node: node,
						messageId: 'migrateTag',
						fix: (fixer) => {
							const replacement = generateTagReplacement(node, { isLozengeMigration: true });
							return fixer.replaceText(node, replacement);
						},
					});
				}
			},
		};
	},
});

export default rule;
