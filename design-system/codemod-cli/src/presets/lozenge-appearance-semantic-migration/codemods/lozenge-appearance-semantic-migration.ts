import { getImportDeclaration } from '@hypermod/utils';
import { type API, type ASTPath, type FileInfo, type JSXElement } from 'jscodeshift';

import { addCommentBefore } from '@atlaskit/codemod-utils';

const LOZENGE_ENTRY_POINT = '@atlaskit/lozenge';
const PRINT_SETTINGS = { quote: 'single' as const };

// Old appearance values that map to new semantic appearance values
const OLD_TO_NEW_APPEARANCE_MAP: Record<string, string> = {
	default: 'neutral',
	inprogress: 'information',
	moved: 'warning',
	new: 'discovery',
	removed: 'danger',
	success: 'success',
};

type LozengeElement = {
	path: ASTPath<JSXElement>;
	hasAppearanceProp: boolean;
	appearanceValue?: string;
};

/**
 * Codemod to migrate Lozenge component appearance semantic values.
 *
 * This codemod:
 * 1. Updates `appearance` prop values to new semantic values
 * 2. Maps old semantic values to new semantic values (e.g. default → neutral, inprogress → information)
 * 3. Adds comments for dynamic values that need manual verification
 */
export default function transformer(file: FileInfo, api: API) {
	const j = api.jscodeshift;
	const source = j(file.source);

	// Find all Lozenge imports
	const lozengeImports = getImportDeclaration(j, source, LOZENGE_ENTRY_POINT);

	// If no Lozenge imports, exit early
	if (!lozengeImports.length) {
		return file.source;
	}

	// Get all imported Lozenge identifiers (could be renamed)
	const lozengeIdentifiers = new Set<string>();

	lozengeImports.forEach((importPath) => {
		importPath.value.specifiers?.forEach((specifier) => {
			if (specifier.type === 'ImportDefaultSpecifier') {
				// Handle: import Lozenge from '@atlaskit/lozenge'
				lozengeIdentifiers.add(specifier.local?.name || 'Lozenge');
			} else if (
				specifier.type === 'ImportSpecifier' &&
				specifier.imported?.type === 'Identifier' &&
				specifier.imported.name === 'default'
			) {
				// Handle: import { default as Badge } from '@atlaskit/lozenge'
				lozengeIdentifiers.add(specifier.local?.name || 'Lozenge');
			}
		});
	});

	// If no Lozenge identifiers found, exit early
	if (lozengeIdentifiers.size === 0) {
		return file.source;
	}

	// Find all Lozenge JSX elements
	const lozengeElements: LozengeElement[] = [];

	source.find(j.JSXElement).forEach((path) => {
		const openingElement = path.value.openingElement;
		if (
			openingElement.name?.type === 'JSXIdentifier' &&
			lozengeIdentifiers.has(openingElement.name.name)
		) {
			const element: LozengeElement = {
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

			lozengeElements.push(element);
		}
	});

	// Process each Lozenge element
	lozengeElements.forEach((element) => {
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
							`FIXME: This Lozenge component uses a dynamic \`appearance\` prop with updated semantic values.
Please verify that the values being passed use the new semantic values: neutral, information, warning, discovery, danger, success.
Old values mapping: default→neutral, inprogress→information, moved→warning, new→discovery, removed→danger, success→success.`,
						);
					} else if (appearanceValue && !OLD_TO_NEW_APPEARANCE_MAP[appearanceValue]) {
						// For invalid string values, add a warning comment
						addCommentBefore(
							j,
							j(path),
							`FIXME: This Lozenge component uses an unknown \`appearance\` value "${appearanceValue}".
Valid new semantic appearance values are: ${Object.values(OLD_TO_NEW_APPEARANCE_MAP).join(', ')}.
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
