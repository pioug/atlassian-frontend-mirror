import { getImportDeclaration } from '@hypermod/utils';
import { type API, type ASTPath, type FileInfo, type JSXElement } from 'jscodeshift';

import { addCommentBefore } from '@atlaskit/codemod-utils';

const BADGE_ENTRY_POINT = '@atlaskit/badge';
const PRINT_SETTINGS = { quote: 'single' as const };

// Old appearance values that map to new semantic appearance values
const OLD_TO_NEW_APPEARANCE_MAP: Record<string, string> = {
	added: 'success',
	removed: 'danger',
	default: 'neutral',
	primary: 'information',
	primaryInverted: 'inverse',
	important: 'danger',
};

type BadgeElement = {
	path: ASTPath<JSXElement>;
	hasAppearanceProp: boolean;
	appearanceValue?: string;
};

/**
 * Codemod to migrate Badge component appearance semantic values.
 *
 * This codemod:
 * 1. Updates `appearance` prop values to new semantic values
 * 2. Maps old semantic values to new semantic values (e.g. added → success, removed → danger, primary → information)
 * 3. Adds comments for dynamic values that need manual verification
 */
export default function transformer(file: FileInfo, api: API) {
	const j = api.jscodeshift;
	const source = j(file.source);

	// Find all Badge imports
	const badgeImports = getImportDeclaration(j, source, BADGE_ENTRY_POINT);

	// If no Badge imports, exit early
	if (!badgeImports.length) {
		return file.source;
	}

	// Get all imported Badge identifiers (could be renamed)
	const badgeIdentifiers = new Set<string>();

	badgeImports.forEach((importPath) => {
		importPath.value.specifiers?.forEach((specifier) => {
			if (specifier.type === 'ImportDefaultSpecifier') {
				// Handle: import Badge from '@atlaskit/badge'
				badgeIdentifiers.add(specifier.local?.name || 'Badge');
			} else if (
				specifier.type === 'ImportSpecifier' &&
				specifier.imported?.type === 'Identifier' &&
				specifier.imported.name === 'default'
			) {
				// Handle: import { default as MyBadge } from '@atlaskit/badge'
				badgeIdentifiers.add(specifier.local?.name || 'Badge');
			}
		});
	});

	// If no Badge identifiers found, exit early
	if (badgeIdentifiers.size === 0) {
		return file.source;
	}

	// Find all Badge JSX elements
	const badgeElements: BadgeElement[] = [];

	source.find(j.JSXElement).forEach((path) => {
		const openingElement = path.value.openingElement;
		if (
			openingElement.name?.type === 'JSXIdentifier' &&
			badgeIdentifiers.has(openingElement.name.name)
		) {
			const element: BadgeElement = {
				path,
				hasAppearanceProp: false,
			};

			// Check for appearance prop
			openingElement.attributes?.forEach((attr) => {
				if (attr.type === 'JSXAttribute' && attr.name?.type === 'JSXIdentifier') {
					if (attr.name.name === 'appearance') {
						element.hasAppearanceProp = true;
						if (attr.value?.type === 'StringLiteral') {
							element.appearanceValue = attr.value.value;
						} else if (attr.value?.type === 'JSXExpressionContainer') {
							// Handle dynamic values
							const expression = attr.value.expression;
							if (expression.type === 'StringLiteral') {
								element.appearanceValue = expression.value;
							} else {
								element.appearanceValue = 'dynamic';
							}
						}
					}
				}
			});

			badgeElements.push(element);
		}
	});

	// Process each Badge element
	badgeElements.forEach((element) => {
		const { path, hasAppearanceProp, appearanceValue } = element;
		const openingElement = path.value.openingElement;

		// Update appearance prop values to new semantic values
		if (hasAppearanceProp) {
			openingElement.attributes?.forEach((attr) => {
				if (
					attr.type === 'JSXAttribute' &&
					attr.name?.type === 'JSXIdentifier' &&
					attr.name.name === 'appearance'
				) {
					// Handle different types of appearance values
					if (appearanceValue === 'dynamic') {
						// For dynamic values, add a comment
						addCommentBefore(
							j,
							j(path),
							`FIXME: This Badge component uses a dynamic \`appearance\` prop with updated semantic values.
Please verify that the values being passed use the new semantic values: neutral, information, inverse, danger, success.
Old values mapping: default→neutral, primary→information, primaryInverted→inverse, added→success, removed→danger, important→danger.`,
						);
					} else if (appearanceValue === 'primaryInverted') {
						// For primaryInverted, we need to add a comment since it maps to inverse
						addCommentBefore(
							j,
							j(path),
							`FIXME: This Badge component used \`appearance="primaryInverted"\` which has been migrated to \`appearance="inverse"\`.
Please verify the visual appearance matches your expectations.`,
						);
						// Update the value
						if (attr.value?.type === 'StringLiteral') {
							attr.value.value = OLD_TO_NEW_APPEARANCE_MAP[appearanceValue];
						}
					} else if (appearanceValue && !OLD_TO_NEW_APPEARANCE_MAP[appearanceValue]) {
						// For invalid string values, add a warning comment
						addCommentBefore(
							j,
							j(path),
							`FIXME: This Badge component uses an unknown \`appearance\` value "${appearanceValue}".
Valid new semantic appearance values are: ${Object.values(OLD_TO_NEW_APPEARANCE_MAP)
								.filter((v, i, arr) => arr.indexOf(v) === i)
								.join(', ')}.
Please update this value to a valid semantic appearance value.`,
						);
					} else if (appearanceValue && OLD_TO_NEW_APPEARANCE_MAP[appearanceValue]) {
						// For valid string values, update the value to the new semantic value
						if (attr.value?.type === 'StringLiteral') {
							attr.value.value = OLD_TO_NEW_APPEARANCE_MAP[appearanceValue];
						}
					}
				}
			});
		}
	});

	return source.toSource(PRINT_SETTINGS);
}
