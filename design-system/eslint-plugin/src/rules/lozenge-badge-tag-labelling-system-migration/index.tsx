import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';
import { isImportFromPackage } from '../utils/is-import-from-package';

const LOZENGE_IMPORT_SOURCES = new Set(['@atlaskit/lozenge', '@atlaskit/lozenge/lozenge']);
const BADGE_IMPORT_SOURCES = new Set(['@atlaskit/badge', '@atlaskit/badge/badge']);
const SIMPLE_TAG_IMPORT_SOURCES = new Set(['@atlaskit/tag/simple-tag']);
const REMOVABLE_TAG_IMPORT_SOURCES = new Set(['@atlaskit/tag', '@atlaskit/tag/removable-tag']);
const AVATAR_IMPORT_SOURCES = new Set([
	'@atlaskit/avatar',
	'@atlaskit/avatar/avatar',
	'@atlaskit/avatar/Avatar',
]);

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'lozenge-badge-tag-labelling-system-migration',
		fixable: 'code',
		type: 'suggestion',
		docs: {
			description:
				'Migrates legacy Lozenge and Badge appearance values and guides SimpleTag/RemovableTag migrations to the supported Tag APIs.',
			recommended: false,
			severity: 'warn',
		},
		messages: {
			updateAppearance:
				'Replace Lozenge appearance="{{oldValue}}" with appearance="{{newValue}}"; apply the autofix.',
			migrateTag:
				'{{remedy}} {{reason}} See the lozenge-badge-tag-labelling-system-migration README in @atlaskit/eslint-plugin-design-system for examples.',
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
		 * Map old Lozenge appearance values to new semantic appearance values.
		 * The new Lozenge no longer uses legacy values — it uses semantic color names
		 * that align with the new labelling system.
		 */
		function mapToNewAppearanceValue(oldValue: string): string {
			const mapping: Record<string, string> = {
				default: 'neutral',
				inprogress: 'information',
				moved: 'warning',
				removed: 'danger',
				new: 'discovery',
				success: 'success',
			};
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
			const getJsxIdentifierName = (node: any): string | null => {
				return node?.type === 'JSXIdentifier' ? node.name : null;
			};

			if (!elemBeforeProp || !elemBeforeProp.value) {
				return null;
			}

			const value = elemBeforeProp.value;

			// Check for JSX element: <Avatar ... />
			if (value.type === 'JSXElement') {
				const avatarName = getJsxIdentifierName(value.openingElement.name);
				if (!avatarName) {
					return null;
				}

				if (avatarImports[avatarName]) {
					return avatarName;
				}
			}

			// Check for JSX expression container: {<Avatar ... />}
			if (value.type === 'JSXExpressionContainer' && value.expression) {
				// Direct JSX element: {<Avatar ... />}
				if (
					value.expression.type === 'JSXElement' &&
					getJsxIdentifierName(value.expression.openingElement.name)
				) {
					const avatarName = getJsxIdentifierName(value.expression.openingElement.name);
					if (!avatarName) {
						return null;
					}

					if (avatarImports[avatarName]) {
						return avatarName;
					}
				}

				// Arrow function: {() => <Avatar ... />}
				if (value.expression.type === 'ArrowFunctionExpression') {
					const body = value.expression.body;
					if (body.type === 'JSXElement') {
						const avatarName = getJsxIdentifierName(body.openingElement.name);
						if (!avatarName) {
							return null;
						}

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

		// Only rewrite an isolated, statically understood plain Tag. Other uses retain
		// diagnostics so the migration can account for their bindings and behavior.
		function getPlainTagFix(
			node: any,
			info: any,
		): { reason: string; name?: string; text?: string; hasTextProp?: boolean } {
			// @ts-ignore - Jira's ESLint v10 types expose sourceCode, platform still checks with ESLint v9.
			const sourceCode = context.sourceCode ?? context.getSourceCode();
			const declaration = info.node?.parent;
			if (!declaration || declaration.specifiers.length !== 1) {
				return { reason: 'Migrate the mixed import manually, preserving every remaining binding.' };
			}
			if (sourceCode.getCommentsInside(node).length > 0) {
				return { reason: 'Preserve component comments while migrating manually.' };
			}
			if (sourceCode.getCommentsInside(declaration).length > 0) {
				return { reason: 'Preserve the import comments while migrating manually.' };
			}
			if (
				sourceCode.ast.body.some(
					(statement: any) =>
						statement.type === 'ImportDeclaration' &&
						statement.source.value === '@atlaskit/tag/tag-new',
				)
			) {
				return { reason: 'Reuse the existing tag-new import after checking its local binding.' };
			}
			const attrs = node.openingElement.attributes;
			const supported = new Set([
				'text',
				'color',
				'elemBefore',
				'testId',
				'href',
				'removeButtonLabel',
				'isRemovable',
			]);
			const seen = new Set<string>();
			let text: string | undefined;
			for (const attr of attrs) {
				if (
					attr.type !== 'JSXAttribute' ||
					attr.name.type !== 'JSXIdentifier' ||
					!supported.has(attr.name.name) ||
					seen.has(attr.name.name)
				) {
					return {
						reason:
							'Review spread, duplicate, and unsupported props against TagNewProps before migrating.',
					};
				}
				seen.add(attr.name.name);
				const value = extractStringValue(attr.value);
				if (attr.name.name === 'elemBefore') {
					const elemBefore =
						attr.value?.type === 'JSXExpressionContainer' ? attr.value.expression : attr.value;
					if (
						elemBefore?.type !== 'JSXElement' &&
						elemBefore?.type !== 'JSXFragment' &&
						!(elemBefore?.type === 'Literal' && typeof elemBefore.value === 'string')
					) {
						return {
							reason:
								'Pass through only a static ReactNode elemBefore; review callbacks and dynamic values manually.',
						};
					}
				}
				if (attr.name.name === 'text' && typeof value === 'string') {
					text = value;
				}
				if (attr.name.name === 'isRemovable') {
					const expression =
						attr.value?.type === 'JSXExpressionContainer' ? attr.value.expression : attr.value;
					if (
						info.type === 'SimpleTag' ||
						(attr.value &&
							!(expression?.type === 'Literal' && typeof expression.value === 'boolean'))
					) {
						return {
							reason: 'Set removability explicitly after reviewing the legacy component behavior.',
						};
					}
				} else if (attr.name.name !== 'elemBefore' && typeof value !== 'string') {
					return { reason: 'Check dynamic prop values against TagNewProps before migrating.' };
				}
				if (
					attr.name.name === 'color' &&
					!new Set([
						'gray',
						'blue',
						'red',
						'yellow',
						'green',
						'teal',
						'purple',
						'lime',
						'orange',
						'magenta',
					]).has(mapTagColorValue(value as string))
				) {
					return { reason: 'Choose a supported NewTagColor before migrating.' };
				}
			}
			if (node.children.length > 0) {
				if (seen.has('text')) {
					return { reason: 'Compare the text prop with its children before migrating.' };
				}
				const [child] = node.children;
				if (
					node.children.length !== 1 ||
					child.type !== 'JSXText' ||
					typeof child.value !== 'string' ||
					child.value.length === 0 ||
					child.value.trim() !== child.value
				) {
					return {
						reason:
							'Review children manually; only one plain text child can be copied to the new Tag text prop safely.',
					};
				}
				text = child.value;
			} else if (!seen.has('text')) {
				return { reason: 'Supply the required text prop before migrating.' };
			}

			const names = new Set<string>();
			let otherUse = false;
			const visit = (current: any) => {
				if (current.type === 'Identifier' || current.type === 'JSXIdentifier') {
					names.add(current.name);
					if (
						current.name === node.openingElement.name.name &&
						!(
							current.range[0] >= declaration.range[0] && current.range[1] <= declaration.range[1]
						) &&
						current !== node.openingElement.name &&
						current !== node.closingElement?.name
					) {
						otherUse = true;
					}
				}
				for (const key of sourceCode.visitorKeys[current.type] ?? []) {
					const child = current[key];
					if (Array.isArray(child)) {
						child.forEach((item) => item && visit(item));
					} else if (child) {
						visit(child);
					}
				}
			};
			visit(sourceCode.ast);
			if (otherUse) {
				return {
					reason:
						'Migrate every use of this binding together; a single-site fix would break other references.',
				};
			}
			names.delete(node.openingElement.name.name);
			let name = 'Tag';
			let suffix = 1;
			while (names.has(name)) {
				name = suffix === 1 ? 'MigratedTag' : `MigratedTag${suffix}`;
				suffix++;
			}
			return {
				reason: 'Apply the autofix for this isolated plain Tag.',
				name,
				text,
				hasTextProp: seen.has('text'),
			};
		}

		return {
			ImportDeclaration(node) {
				const moduleSource = node.source.value;
				if (typeof moduleSource === 'string') {
					// Track Lozenge imports
					if (LOZENGE_IMPORT_SOURCES.has(moduleSource)) {
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
					if (BADGE_IMPORT_SOURCES.has(moduleSource)) {
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
					// Track legacy Tag imports. The root default remains RemovableTag.
					if (isImportFromPackage(moduleSource, '@atlaskit/tag')) {
						node.specifiers.forEach((spec) => {
							if (spec.type === 'ImportDefaultSpecifier') {
								// Check for default imports from subpaths and main package
								if (SIMPLE_TAG_IMPORT_SOURCES.has(moduleSource)) {
									// Default import from @atlaskit/tag/simple-tag is a SimpleTag
									tagImports[spec.local.name] = {
										type: 'SimpleTag',
										source: moduleSource,
										node: { ...spec, parent: node },
									};
								} else if (REMOVABLE_TAG_IMPORT_SOURCES.has(moduleSource)) {
									// Default import from @atlaskit/tag/removable-tag or @atlaskit/tag is a RemovableTag
									tagImports[spec.local.name] = {
										type: 'RemovableTag',
										source: moduleSource,
										node: { ...spec, parent: node },
									};
								}
							} else if (spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier') {
								const importName = spec.imported.name;
								if (importName === 'SimpleTag' || importName === 'RemovableTag') {
									tagImports[spec.local.name] = {
										type: importName,
										source: moduleSource,
										node: { ...spec, parent: node },
									};
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
					if (AVATAR_IMPORT_SOURCES.has(moduleSource)) {
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

					// Preserve the existing detection scope for root default imports.
					if (tagImportInfo.type === 'RemovableTag' && tagImportInfo.source === '@atlaskit/tag') {
						// Root avatar-prop consumers are outside this rule's existing migration scope.
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
					const migration = hasAvatarInElemBefore
						? {
								reason:
									'Choose type="user", "other", or "agent" from the represented entity; automatic inference is unsafe.',
							}
						: getPlainTagFix(node, tagImportInfo);
					context.report({
						node,
						messageId: 'migrateTag',
						data: {
							remedy: hasAvatarInElemBefore
								? "Import AvatarTag from '@atlaskit/tag/avatar-tag'; pass text, type, and avatar={(props) => <Avatar {...props} />}. Preserve non-removability for SimpleTag."
								: "Import Tag from '@atlaskit/tag/tag-new'; pass text (string or string[]) and use isRemovable={false} for SimpleTag.",
							reason: migration.reason,
						},
						fix:
							'name' in migration && migration.name
								? (fixer: any) => {
										// @ts-ignore - Jira's ESLint v10 types expose sourceCode, platform still checks with ESLint v9.
										const sourceCode = context.sourceCode ?? context.getSourceCode();
										const attributes = node.openingElement.attributes.map((attr: any) =>
											attr.name.name === 'color'
												? `color="${mapTagColorValue(extractStringValue(attr.value) as string)}"`
												: sourceCode.getText(attr),
										);
										if (tagImportInfo.type === 'SimpleTag') {
											attributes.push('isRemovable={false}');
										}
										if (!migration.hasTextProp && migration.text !== undefined) {
											attributes.push(`text=${JSON.stringify(migration.text)}`);
										}
										return [
											fixer.replaceText(
												tagImportInfo.node.parent,
												`import ${migration.name} from '@atlaskit/tag/tag-new';`,
											),
											fixer.replaceText(node, `<${migration.name} ${attributes.join(' ')} />`),
										];
									}
								: undefined,
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

				// Handle appearance prop value migration — always update to new semantic values.
				// isBold cleanup is outside this rule; check the installed Lozenge API separately.
				if (appearanceProp) {
					const stringValue = extractStringValue(appearanceProp.value);
					if (stringValue && typeof stringValue === 'string') {
						const mappedValue = mapToNewAppearanceValue(stringValue);
						if (mappedValue !== stringValue) {
							context.report({
								node: appearanceProp,
								messageId: 'updateAppearance',
								data: { oldValue: stringValue, newValue: mappedValue },
								fix: createAppearanceFixer(appearanceProp.value, mappedValue),
							});
						}
					}
				}
			},
		};
	},
});

export default rule;
