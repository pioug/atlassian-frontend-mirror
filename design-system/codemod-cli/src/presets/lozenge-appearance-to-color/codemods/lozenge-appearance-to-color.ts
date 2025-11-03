import { getImportDeclaration } from '@hypermod/utils';
import { type API, type ASTPath, type FileInfo, type JSXElement } from 'jscodeshift';

import { addCommentBefore } from '@atlaskit/codemod-utils';

const LOZENGE_ENTRY_POINT = '@atlaskit/lozenge';
const PRINT_SETTINGS = { quote: 'single' as const };

// Semantic appearance values that map directly to color values
const APPEARANCE_TO_COLOR_MAP: Record<string, string> = {
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
 * Codemod to migrate Lozenge component from `appearance` prop to `color` prop.
 *
 * This codemod:
 * 1. Renames `appearance` prop to `color` for semantic values
 * 2. Maps existing semantic values directly (e.g. success → success)
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

		// Transform appearance prop to color prop
		if (hasAppearanceProp) {
			openingElement.attributes?.forEach((attr) => {
				if (
					attr.type === 'JSXAttribute' &&
					attr.name?.type === 'JSXIdentifier' &&
					attr.name.name === 'appearance'
				) {
					// Rename appearance to color
					attr.name.name = 'color';

					// Handle different types of appearance values
					if (appearanceValue === 'dynamic') {
						// For dynamic values, add a comment
						addCommentBefore(
							j,
							j(path),
							`FIXME: This Lozenge component uses a dynamic \`appearance\` prop that has been renamed to \`color\`.
Please verify that the values being passed are valid color values (semantic: default, inprogress, moved, new, removed, success).`,
						);
					} else if (appearanceValue && !APPEARANCE_TO_COLOR_MAP[appearanceValue]) {
						// For invalid string values, add a warning comment
						addCommentBefore(
							j,
							j(path),
							`FIXME: This Lozenge component uses an invalid \`appearance\` value "${appearanceValue}" that has been renamed to \`color\`.
Valid semantic color values are: ${Object.keys(APPEARANCE_TO_COLOR_MAP).join(', ')}.
Please update this value to a valid semantic color or use a custom color value.`,
						);
					} else if (appearanceValue && APPEARANCE_TO_COLOR_MAP[appearanceValue]) {
						// For valid string values, update the value to the mapped color
						if (attr.value?.type === 'StringLiteral') {
							attr.value.value = APPEARANCE_TO_COLOR_MAP[appearanceValue];
						}
					}
				}
			});
		}
	});

	return source.toSource(PRINT_SETTINGS);
}
