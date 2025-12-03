import type { API, FileInfo, JSXAttribute, JSXExpressionContainer } from 'jscodeshift';

import { addCommentBefore } from '@atlaskit/codemod-utils';

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
				// Handle { default as Badge } syntax
				if (j.Identifier.check(specifier.imported) && specifier.imported.name === 'default') {
					lozengeImportName = specifier.local?.name || 'Lozenge';
				}
			}
		});
	});

	// Appearance to color mapping
	const appearanceToColorMap: Record<string, string> = {
		success: 'lime',
		default: 'standard',
		removed: 'red',
		inprogress: 'blue',
		new: 'purple',
		moved: 'orange',
	};

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

		// Check isBold attribute
		const isBoldAttr = element.openingElement.attributes?.find(
			(attr) =>
				j.JSXAttribute.check(attr) &&
				j.JSXIdentifier.check(attr.name) &&
				attr.name.name === 'isBold',
		) as JSXAttribute | undefined;

		// Don't transform if isBold is true or boolean prop without value
		if (isBoldAttr) {
			if (j.JSXExpressionContainer.check(isBoldAttr.value)) {
				const expression = isBoldAttr.value.expression;

				// If it's a boolean literal true, don't transform
				if (j.BooleanLiteral.check(expression) && expression.value === true) {
					return;
				}

				// If it's a boolean literal false, we can transform
				if (j.BooleanLiteral.check(expression) && expression.value === false) {
					// Continue with transformation
				} else {
					// If it's not a boolean literal (dynamic value), add warning and don't transform
					addCommentBefore(
						j,
						j(elementPath),
						`FIXME: This Lozenge component uses a dynamic \`isBold\` prop. Please manually review if this should be migrated to Tag component.
If isBold is typically false, consider migrating to <Tag /> from '@atlaskit/tag'.`,
					);
					return;
				}
			} else if (!isBoldAttr.value) {
				// isBold prop without value (boolean shorthand) means true, don't transform
				return;
			}
		}

		// Create new Tag element
		const newAttributes: JSXAttribute[] = [];
		const otherAttributes: JSXAttribute[] = [];
		let colorAttribute: JSXAttribute | null = null;
		let textContent = '';
		let hasComplexChildren = false;
		let hasStyleProp = false;
		let hasMaxWidthProp = false;
		let hasUnknownAppearance = false;
		let dynamicAppearance = false;
		let unknownAppearanceValue = '';

		// Process children to extract text
		let hasVariableChild = false;
		let variableChildExpression: any = null;

		if (element.children && element.children.length > 0) {
			if (element.children.length === 1) {
				const child = element.children[0];

				if (j.JSXText.check(child)) {
					const text = child.value.trim();
					if (text) {
						textContent = text;
					}
				} else if (
					j.JSXExpressionContainer.check(child) &&
					j.StringLiteral.check(child.expression)
				) {
					textContent = child.expression.value;
				} else if (j.JSXExpressionContainer.check(child)) {
					// Check if it's a simple identifier (variable) or member expression
					if (j.Identifier.check(child.expression)) {
						hasVariableChild = true;
						variableChildExpression = child.expression;
					} else if (j.MemberExpression.check(child.expression)) {
						// Handle member expressions like obj.prop
						hasVariableChild = true;
						variableChildExpression = child.expression;
					} else {
						// Complex expression or JSX element
						hasComplexChildren = true;
					}
				} else {
					// JSX elements or other complex children
					hasComplexChildren = true;
				}
			} else {
				// Multiple children or complex structure
				hasComplexChildren = true;
			}
		}

		// Process attributes
		element.openingElement.attributes?.forEach((attr) => {
			if (!j.JSXAttribute.check(attr) || !j.JSXIdentifier.check(attr.name)) {
				return;
			}

			const attrName = attr.name.name;

			switch (attrName) {
				case 'appearance':
					let colorValue: string | JSXExpressionContainer = 'standard';

					if (j.StringLiteral.check(attr.value)) {
						const appearanceValue = attr.value.value;
						colorValue = appearanceToColorMap[appearanceValue] || appearanceValue;

						if (!appearanceToColorMap[appearanceValue]) {
							hasUnknownAppearance = true;
							unknownAppearanceValue = appearanceValue;
						}
					} else if (j.JSXExpressionContainer.check(attr.value)) {
						// Dynamic appearance
						dynamicAppearance = true;
						colorValue = attr.value;
					}

					colorAttribute = j.jsxAttribute(
						j.jsxIdentifier('color'),
						typeof colorValue === 'string' ? j.stringLiteral(colorValue) : colorValue,
					);
					break;

				case 'isBold':
					// Skip isBold, already handled above
					break;

				case 'maxWidth':
					hasMaxWidthProp = true;
					break;

				case 'style':
					hasStyleProp = true;
					otherAttributes.push(attr);
					break;

				default:
					// Keep other attributes (testId, etc.)
					otherAttributes.push(attr);
					break;
			}
		});

		// Assemble attributes in correct order: text, other props, color
		if (textContent && !hasComplexChildren && !hasVariableChild) {
			newAttributes.push(j.jsxAttribute(j.jsxIdentifier('text'), j.stringLiteral(textContent)));
		} else if (hasVariableChild && variableChildExpression) {
			// Use the variable expression as the text prop
			newAttributes.push(
				j.jsxAttribute(j.jsxIdentifier('text'), j.jsxExpressionContainer(variableChildExpression)),
			);
		}

		// Add other attributes
		newAttributes.push(...otherAttributes);

		// Add color attribute last (default to 'standard' if no appearance was found)
		if (colorAttribute) {
			newAttributes.push(colorAttribute);
		} else {
			// Default color when no appearance is specified
			newAttributes.push(j.jsxAttribute(j.jsxIdentifier('color'), j.stringLiteral('standard')));
		}

		// Create new Tag element
		const newElement = j.jsxElement(
			j.jsxOpeningElement(j.jsxIdentifier('Tag'), newAttributes, true),
			null,
			[],
		);

		// Add warning comments as needed
		const warnings: string[] = [];

		if (hasComplexChildren) {
			warnings.push(
				"FIXME: This Tag component has complex children that couldn't be automatically migrated to the text prop.\nTag component only supports simple text via the text prop. Please manually convert the children content.",
			);
		}

		if (hasVariableChild) {
			warnings.push(
				'FIXME: This Tag component uses a variable as the text prop. Please verify that the variable contains a string value.',
			);
		}

		if (hasMaxWidthProp) {
			warnings.push(
				'FIXME: maxWidth prop was removed during migration from Lozenge to Tag.\nTag component does not support maxWidth. Please review if width constraints are needed.',
			);
		}

		if (hasStyleProp) {
			warnings.push(
				'FIXME: This Tag component has a style prop that was kept during migration.\nTag component has limited style support. Please review if custom styles are compatible.',
			);
		}

		if (hasUnknownAppearance) {
			warnings.push(
				`FIXME: This Tag component uses an unknown appearance value "${unknownAppearanceValue}".\nPlease update to a valid Tag color: standard, green, lime, blue, red, purple, magenta, grey, teal, orange, yellow.`,
			);
		}

		if (dynamicAppearance) {
			warnings.push(
				'FIXME: This Tag component uses a dynamic `appearance` prop that has been renamed to `color`.\nPlease verify that the values being passed are valid color values (semantic: default, inprogress, moved, new, removed, success).',
			);
		}

		// Replace the element first
		elementPath.replace(newElement);

		// Add warning comments using addCommentBefore if needed
		if (warnings.length > 0) {
			const commentText = warnings.join('\n');
			addCommentBefore(j, j(elementPath), commentText);
		}

		hasTransformed = true;
	});

	// Add Tag import if we transformed any elements
	if (hasTransformed) {
		// Check if Tag import already exists
		const tagImports = source
			.find(j.ImportDeclaration)
			.filter((path) => path.node.source.value === '@atlaskit/tag');

		if (tagImports.length === 0) {
			// Add Tag import after Lozenge import
			const lozengeImportPath = lozengeImports.at(0);
			const tagImport = j.importDeclaration(
				[j.importDefaultSpecifier(j.identifier('Tag'))],
				j.stringLiteral('@atlaskit/tag'),
			);

			lozengeImportPath.insertAfter(tagImport);
		}

		// Check if there are any remaining Lozenge usages
		const remainingLozengeUsages = source.find(j.JSXElement).filter((elementPath) => {
			const element = elementPath.node;
			if (!j.JSXIdentifier.check(element.openingElement.name)) {
				return false;
			}
			return element.openingElement.name.name === lozengeImportName;
		});

		// Also check for other usages like function calls, type references, etc.
		const remainingLozengeReferences = source.find(j.Identifier).filter((identifierPath) => {
			// Skip JSX element names as they're already checked above
			if (
				j.JSXElement.check(identifierPath.parent.node) ||
				j.JSXOpeningElement.check(identifierPath.parent.node) ||
				j.JSXClosingElement.check(identifierPath.parent.node)
			) {
				return false;
			}

			// Skip import declaration identifiers
			if (
				j.ImportDeclaration.check(identifierPath.parent.node) ||
				j.ImportDefaultSpecifier.check(identifierPath.parent.node) ||
				j.ImportSpecifier.check(identifierPath.parent.node)
			) {
				return false;
			}

			return identifierPath.node.name === lozengeImportName;
		});

		// If no remaining usages, remove the Lozenge import
		if (remainingLozengeUsages.length === 0 && remainingLozengeReferences.length === 0) {
			lozengeImports.remove();
		}

		return source.toSource();
	}

	return source.toSource();
};

export default transformer;
