import type { API, FileInfo, JSXAttribute } from 'jscodeshift';

import { addCommentBefore } from '@atlaskit/codemod-utils';

/**
 * Maps old Lozenge appearance values to the new semantic appearance values.
 * The new Lozenge API uses semantic color names that align with the labelling system.
 */
const appearanceToSemanticMap: Record<string, string> = {
	default: 'neutral',
	inprogress: 'information',
	moved: 'warning',
	removed: 'danger',
	new: 'discovery',
	// success maps to itself — no change needed
};

const transformer = (file: FileInfo, api: API): string | undefined => {
	const j = api.jscodeshift;
	const source = j(file.source);

	// Check if file has Lozenge imports
	const lozengeImports = source
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === '@atlaskit/lozenge');

	if (lozengeImports.length === 0) {
		return file.source;
	}

	// Get the import name for Lozenge (could be renamed)
	let lozengeImportName = 'Lozenge';
	lozengeImports.forEach((importPath) => {
		importPath.node.specifiers?.forEach((specifier) => {
			if (j.ImportDefaultSpecifier.check(specifier)) {
				lozengeImportName = specifier.local?.name || 'Lozenge';
			} else if (j.ImportSpecifier.check(specifier)) {
				if (j.Identifier.check(specifier.imported) && specifier.imported.name === 'default') {
					lozengeImportName = specifier.local?.name || 'Lozenge';
				}
			}
		});
	});

	let hasTransformed = false;

	// Find and transform Lozenge elements
	source.find(j.JSXElement).forEach((elementPath) => {
		const element = elementPath.node;

		if (!j.JSXIdentifier.check(element.openingElement.name)) {
			return;
		}

		if (element.openingElement.name.name !== lozengeImportName) {
			return;
		}

		const newAttributes: JSXAttribute[] = [];
		const warnings: string[] = [];
		let elementChanged = false;

		element.openingElement.attributes?.forEach((attr) => {
			if (!j.JSXAttribute.check(attr) || !j.JSXIdentifier.check(attr.name)) {
				// Keep spread attributes unchanged
				newAttributes.push(attr as JSXAttribute);
				return;
			}

			const attrName = attr.name.name;

			if (attrName === 'isBold') {
				// Keep isBold — users may still need it while the feature flag
				// platform-dst-lozenge-tag-badge-visual-uplifts is OFF (subtle variant still rendered).
				newAttributes.push(attr);
				return;
			}

			if (attrName === 'appearance') {
				if (j.StringLiteral.check(attr.value)) {
					const oldValue = attr.value.value;
					const newValue = appearanceToSemanticMap[oldValue];
					if (newValue) {
						// Replace with new semantic value
						newAttributes.push(
							j.jsxAttribute(j.jsxIdentifier('appearance'), j.stringLiteral(newValue)),
						);
						elementChanged = true;
						return;
					}
					// Already a valid value (e.g. 'success', accent colors) — keep as-is
				} else if (j.JSXExpressionContainer.check(attr.value)) {
					// Dynamic appearance — keep but add a FIXME comment
					warnings.push(
						'FIXME: This Lozenge uses a dynamic `appearance` prop. Please verify the values are updated to new semantic values: neutral, information, warning, danger, discovery, success.',
					);
				}
				newAttributes.push(attr);
				return;
			}

			// Keep all other attributes unchanged
			newAttributes.push(attr);
		});

		if (!elementChanged && warnings.length === 0) {
			return;
		}

		// Rebuild the opening element with the updated attributes
		const newOpeningElement = j.jsxOpeningElement(
			element.openingElement.name,
			newAttributes,
			element.openingElement.selfClosing,
		);

		const newElement = j.jsxElement(newOpeningElement, element.closingElement, element.children);

		elementPath.replace(newElement);

		if (warnings.length > 0) {
			addCommentBefore(j, j(elementPath), warnings.join('\n'));
		}

		hasTransformed = true;
	});

	if (hasTransformed) {
		return source.toSource();
	}

	return source.toSource();
};

export default transformer;
