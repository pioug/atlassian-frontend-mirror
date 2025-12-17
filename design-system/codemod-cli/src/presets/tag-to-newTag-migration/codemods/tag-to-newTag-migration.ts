import { getImportDeclaration } from '@hypermod/utils';
import {
	type API,
	type ASTPath,
	type FileInfo,
	type JSXAttribute,
	type JSXElement,
} from 'jscodeshift';

const TAG_ENTRY_POINT = '@atlaskit/tag';
const TAG_REMOVABLE_ENTRY_POINT = '@atlaskit/tag/removable-tag';
const TAG_SIMPLE_ENTRY_POINT = '@atlaskit/tag/simple-tag';
const AVATAR_ENTRY_POINT = '@atlaskit/avatar';
const PRINT_SETTINGS = { quote: 'single' as const };

// Color mapping from Light versions to non-light versions
const COLOR_MAP: Record<string, string> = {
	limeLight: 'lime',
	orangeLight: 'orange',
	magentaLight: 'magenta',
	greenLight: 'green',
	blueLight: 'blue',
	redLight: 'red',
	purpleLight: 'purple',
	greyLight: 'gray', // Note: grey -> gray spelling change
	tealLight: 'teal',
	yellowLight: 'yellow',
	grey: 'gray', // Also handle non-light grey -> gray
};

// Valid target color values that don't need migration
const VALID_COLORS = new Set([
	'lime',
	'orange',
	'magenta',
	'green',
	'blue',
	'red',
	'purple',
	'gray',
	'teal',
	'yellow',
	'standard',
]);

type TagInfo = {
	localName: string; // The name used in the code (e.g., "Tag", "MyTag", etc.)
	isSimpleTag: boolean; // Whether this was imported as SimpleTag
};

/**
 * Check if a JSX expression is an Avatar component from '@atlaskit/avatar'
 */
function isAvatarComponent(expression: any): boolean {
	// Handle <Avatar ... />
	if (expression.type === 'JSXElement') {
		const openingElement = expression.openingElement;
		if (openingElement.name?.type === 'JSXIdentifier') {
			return openingElement.name.name === 'Avatar';
		}
	}
	return false;
}

/**
 * Check if elemBefore contains only an Avatar component (directly or via render props)
 */
function hasOnlyAvatarInElemBefore(attr: JSXAttribute): { isAvatar: boolean; avatarJSX?: any } {
	if (attr.value?.type === 'JSXExpressionContainer') {
		const expression = attr.value.expression;

		// Direct Avatar: elemBefore={<Avatar />}
		if (isAvatarComponent(expression)) {
			return { isAvatar: true, avatarJSX: expression };
		}

		// Render props: elemBefore={(props) => <Avatar {...props} />}
		if (
			(expression.type === 'ArrowFunctionExpression' || expression.type === 'FunctionExpression') &&
			expression.body
		) {
			// Check if the function body is an Avatar component
			const body = expression.body;
			if (isAvatarComponent(body)) {
				return { isAvatar: true, avatarJSX: body };
			}
		}
	}
	return { isAvatar: false };
}

/**
 * Extract string value from a JSX attribute value
 */
function extractStringValue(attrValue: any): string | null {
	if (!attrValue) {
		return null;
	}
	if (attrValue.type === 'StringLiteral') {
		return attrValue.value;
	}
	if (attrValue.type === 'JSXExpressionContainer') {
		const expression = attrValue.expression;
		if (expression.type === 'StringLiteral') {
			return expression.value;
		}
	}
	return null;
}

/**
 * Find an attribute by name in the attributes array
 */
function findAttribute(attributes: any[], attrName: string): any {
	return attributes?.find(
		(attr) =>
			attr.type === 'JSXAttribute' &&
			attr.name?.type === 'JSXIdentifier' &&
			attr.name.name === attrName,
	);
}

/**
 * Codemod to migrate Tag components to new Tag/AvatarTag API.
 *
 * This codemod:
 * 1. Identifies all Tag imports from various entry points
 * 2. For tags with elemBefore containing only Avatar:
 *    - Migrates to AvatarTag from '@atlaskit/tag'
 *    - Renames elemBefore to avatar
 *    - Converts avatar to render props function
 *    - Removes color prop
 *    - Adds isRemovable={false} if original was SimpleTag
 * 3. For other tags:
 *    - Migrates to default import from '@atlaskit/tag'
 *    - Removes appearance prop
 *    - Migrates color values using COLOR_MAP
 *    - Adds isRemovable={false} if original was SimpleTag
 *    - Adds comment for manual migration if color can't be mapped
 */
export default function transformer(file: FileInfo, api: API) {
	const j = api.jscodeshift;
	const source = j(file.source);

	// Track all Tag identifiers and whether they were SimpleTag
	const tagIdentifiers = new Map<string, TagInfo>();

	// Find all Tag imports from main entry point
	const mainTagImports = getImportDeclaration(j, source, TAG_ENTRY_POINT);
	mainTagImports.forEach((importPath) => {
		importPath.value.specifiers?.forEach((specifier) => {
			if (specifier.type === 'ImportDefaultSpecifier') {
				// import Tag from '@atlaskit/tag' -> RemovableTag (default)
				tagIdentifiers.set(specifier.local?.name || 'Tag', {
					localName: specifier.local?.name || 'Tag',
					isSimpleTag: false,
				});
			} else if (
				specifier.type === 'ImportSpecifier' &&
				specifier.imported?.type === 'Identifier'
			) {
				const localName = specifier.local?.name || specifier.imported.name;
				if (specifier.imported.name === 'SimpleTag') {
					// import { SimpleTag } from '@atlaskit/tag'
					tagIdentifiers.set(localName, {
						localName,
						isSimpleTag: true,
					});
				} else if (specifier.imported.name === 'RemovableTag') {
					// import { RemovableTag } from '@atlaskit/tag'
					tagIdentifiers.set(localName, {
						localName,
						isSimpleTag: false,
					});
				}
			}
		});
	});

	// Find imports from removable-tag entry point
	const removableTagImports = getImportDeclaration(j, source, TAG_REMOVABLE_ENTRY_POINT);
	removableTagImports.forEach((importPath) => {
		importPath.value.specifiers?.forEach((specifier) => {
			if (specifier.type === 'ImportDefaultSpecifier') {
				// import RemovableTag from '@atlaskit/tag/removable-tag'
				tagIdentifiers.set(specifier.local?.name || 'RemovableTag', {
					localName: specifier.local?.name || 'RemovableTag',
					isSimpleTag: false,
				});
			}
		});
	});

	// Find imports from simple-tag entry point
	const simpleTagImports = getImportDeclaration(j, source, TAG_SIMPLE_ENTRY_POINT);
	simpleTagImports.forEach((importPath) => {
		importPath.value.specifiers?.forEach((specifier) => {
			if (specifier.type === 'ImportDefaultSpecifier') {
				// import SimpleTag from '@atlaskit/tag/simple-tag'
				tagIdentifiers.set(specifier.local?.name || 'SimpleTag', {
					localName: specifier.local?.name || 'SimpleTag',
					isSimpleTag: true,
				});
			}
		});
	});

	// If no Tag imports found, exit early
	if (tagIdentifiers.size === 0) {
		return file.source;
	}

	// Check if Avatar is imported
	const avatarImports = getImportDeclaration(j, source, AVATAR_ENTRY_POINT);
	const hasAvatarImport = avatarImports.length > 0;

	// Track which tags need AvatarTag vs regular Tag
	const tagsToMigrateToAvatarTag = new Set<string>();
	const tagsNeedingManualMigration = new Set<ASTPath<JSXElement>>();
	let hasRegularTagUsage = false; // Track if any tag remains as regular Tag

	// Find and process all Tag JSX elements
	source.find(j.JSXElement).forEach((path) => {
		const openingElement = path.value.openingElement;
		if (
			openingElement.name?.type === 'JSXIdentifier' &&
			tagIdentifiers.has(openingElement.name.name)
		) {
			const componentName = openingElement.name.name;
			const tagInfo = tagIdentifiers.get(componentName)!;
			const attributes = openingElement.attributes || [];

			// Check for elemBefore with Avatar
			const elemBeforeAttr = findAttribute(attributes, 'elemBefore');
			const colorAttr = findAttribute(attributes, 'color');

			let shouldMigrateToAvatarTag = false;

			if (elemBeforeAttr && hasAvatarImport) {
				const { isAvatar, avatarJSX } = hasOnlyAvatarInElemBefore(elemBeforeAttr);
				if (isAvatar && avatarJSX) {
					shouldMigrateToAvatarTag = true;
					tagsToMigrateToAvatarTag.add(componentName);

					// Rename component to AvatarTag
					openingElement.name.name = 'AvatarTag';
					if (path.value.closingElement?.name?.type === 'JSXIdentifier') {
						path.value.closingElement.name.name = 'AvatarTag';
					}

					// Rename elemBefore to avatar
					if (elemBeforeAttr.name?.type === 'JSXIdentifier') {
						elemBeforeAttr.name.name = 'avatar';
					}

					// Convert avatar to render props function if not already
					if (elemBeforeAttr.value?.type === 'JSXExpressionContainer') {
						const expression = elemBeforeAttr.value.expression;

						// If it's a direct Avatar component, convert to render props
						if (isAvatarComponent(expression)) {
							// Create: (avatarProps) => <Avatar {...avatarProps} originalProps... />
							const avatarElement = expression;
							const avatarAttributes = avatarElement.openingElement.attributes || [];

							// Build new attributes with spread first, then existing props
							const newAttributes = [
								j.jsxSpreadAttribute(j.identifier('avatarProps')),
								...avatarAttributes,
							];

							avatarElement.openingElement.attributes = newAttributes;

							// Wrap in arrow function
							const renderPropsFunc = j.arrowFunctionExpression(
								[j.identifier('avatarProps')],
								avatarElement,
							);

							elemBeforeAttr.value.expression = renderPropsFunc;
						}
						// If it's already a function, leave it as is
					}

					// Remove color prop
					openingElement.attributes = (openingElement.attributes || []).filter((attr) => {
						if (attr.type === 'JSXAttribute' && attr.name?.type === 'JSXIdentifier') {
							return attr.name.name !== 'color';
						}
						return true;
					});
				}
			}

			if (!shouldMigrateToAvatarTag) {
				// Keep as regular Tag, rename to "Tag" if needed
				hasRegularTagUsage = true;
				openingElement.name.name = 'Tag';
				if (path.value.closingElement?.name?.type === 'JSXIdentifier') {
					path.value.closingElement.name.name = 'Tag';
				}

				// Migrate color if present
				if (colorAttr) {
					const colorValue = extractStringValue(colorAttr.value);
					if (colorValue && COLOR_MAP[colorValue]) {
						// Update the color value
						if (colorAttr.value?.type === 'StringLiteral') {
							colorAttr.value.value = COLOR_MAP[colorValue];
						} else if (colorAttr.value?.type === 'JSXExpressionContainer') {
							const expression = colorAttr.value.expression;
							if (expression.type === 'StringLiteral') {
								expression.value = COLOR_MAP[colorValue];
							}
						}
					} else if (colorValue && !COLOR_MAP[colorValue] && !VALID_COLORS.has(colorValue)) {
						// Color value is unknown/custom - mark for manual migration
						tagsNeedingManualMigration.add(path);
					}
				}
			}

			// Remove appearance prop (for both AvatarTag and Tag)
			openingElement.attributes = (openingElement.attributes || []).filter((attr) => {
				if (attr.type === 'JSXAttribute' && attr.name?.type === 'JSXIdentifier') {
					return attr.name.name !== 'appearance';
				}
				return true;
			});

			// Add isRemovable={false} if original was SimpleTag and prop doesn't exist
			if (tagInfo.isSimpleTag && !findAttribute(openingElement.attributes || [], 'isRemovable')) {
				openingElement.attributes = openingElement.attributes || [];
				openingElement.attributes.push(
					j.jsxAttribute(
						j.jsxIdentifier('isRemovable'),
						j.jsxExpressionContainer(j.booleanLiteral(false)),
					),
				);
			}
		}
	});

	// Add comments for manual migration
	tagsNeedingManualMigration.forEach((path) => {
		const comment =
			' TODO: Manual migration needed - color prop value could not be automatically migrated ';
		j(path).forEach((p) => {
			const node = p.value;
			node.comments = node.comments || [];
			node.comments.push(j.commentBlock(comment));
		});
	});

	// Update imports
	const needsAvatarTagImport = tagsToMigrateToAvatarTag.size > 0;
	// We need default Tag import if there are any regular tag usages
	const needsDefaultTagImport = hasRegularTagUsage;

	// Create new imports
	const newImports: any[] = [];

	if (needsDefaultTagImport) {
		newImports.push(
			j.importDeclaration(
				[j.importDefaultSpecifier(j.identifier('Tag'))],
				j.literal(TAG_ENTRY_POINT),
			),
		);
	}

	if (needsAvatarTagImport) {
		newImports.push(
			j.importDeclaration(
				[j.importSpecifier(j.identifier('AvatarTag'))],
				j.literal(TAG_ENTRY_POINT),
			),
		);
	}

	// Remove old Tag imports first
	mainTagImports.forEach((importPath) => j(importPath).remove());
	removableTagImports.forEach((importPath) => j(importPath).remove());
	simpleTagImports.forEach((importPath) => j(importPath).remove());

	// Insert new imports after Avatar import (if exists) or at the beginning
	if (newImports.length > 0) {
		const program = source.find(j.Program);
		if (program.length > 0) {
			const body = program.at(0).get('body').value;

			if (avatarImports.length > 0) {
				// Find the Avatar import in the body
				const avatarImportNode = avatarImports.at(0).get().value;
				const avatarIndex = body.findIndex((node: any) => node === avatarImportNode);

				if (avatarIndex !== -1) {
					// Insert all new imports right after Avatar import
					body.splice(avatarIndex + 1, 0, ...newImports);
				} else {
					// Fallback: add at beginning
					body.unshift(...newImports.reverse());
				}
			} else {
				// No Avatar import, add at beginning
				body.unshift(...newImports.reverse());
			}
		}
	}

	return source.toSource(PRINT_SETTINGS);
}
