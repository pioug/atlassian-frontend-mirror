/* eslint-disable @repo/internal/fs/filename-pattern-match */
import { type API, type ASTPath, type FileInfo, type JSXElement } from 'jscodeshift';

const LOZENGE_ENTRY_POINT = '@atlaskit/lozenge';
const TAG_ENTRY_POINT = '@atlaskit/tag';
const FG_ENTRY_POINT = '@atlassian/jira-feature-gating';
const FEATURE_GATE_NAME = 'platform-dst-lozenge-tag-badge-visual-uplifts';
const PRINT_SETTINGS = { quote: 'single' as const };

type LozengeElement = {
	path: ASTPath<JSXElement>;
	appearanceValue?: string;
	isBoldValue?: boolean | 'dynamic';
	shouldMigrate: boolean;
};

/**
 * Codemod to migrate Lozenge components with appearance='new' or 'discovery' to Tag behind feature gate.
 *
 * This codemod:
 * 1. Finds Lozenges with appearance="new" or appearance="discovery"
 * 2. Also includes discovery Lozenges with isBold={true} or isBold
 * 3. Wraps them in a feature gate: fg('platform-dst-lozenge-tag-badge-visual-uplifts')
 * 4. Converts to Tag with color="purple" when feature gate is off
 * 5. Adds necessary imports (Tag, fg)
 */
export default function transformer(file: FileInfo, api: API) {
	const j = api.jscodeshift;
	let source: any;

	// Try to parse the file
	try {
		source = j(file.source);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		return file.source;
	}

	// Check if Lozenge is imported from @atlaskit/lozenge
	const hasLozengeImport = source.find(j.ImportDeclaration).some((importPath: any) => {
		return importPath.value.source.value === LOZENGE_ENTRY_POINT;
	});

	if (!hasLozengeImport) {
		return file.source;
	}

	// Get all Lozenge component names (handles renamed imports)
	const lozengeNames = new Set<string>();

	source.find(j.ImportDeclaration).forEach((importPath: any) => {
		if (importPath.value.source.value === LOZENGE_ENTRY_POINT) {
			importPath.value.specifiers?.forEach((specifier: any) => {
				if (specifier.type === 'ImportDefaultSpecifier') {
					lozengeNames.add(specifier.local.name);
				} else if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'default') {
					lozengeNames.add(specifier.local.name);
				}
			});
		}
	});

	// Find all Lozenge elements that should be migrated
	const lozengeElements: LozengeElement[] = [];

	source.find(j.JSXElement).forEach((path: ASTPath<JSXElement>) => {
		const openingElement = path.value.openingElement;

		if (
			openingElement.name?.type === 'JSXIdentifier' &&
			lozengeNames.has(openingElement.name.name)
		) {
			const element: LozengeElement = {
				path,
				shouldMigrate: false,
			};

			// Check for appearance and isBold props
			openingElement.attributes?.forEach((attr: any) => {
				if (attr.type === 'JSXAttribute' && attr.name?.type === 'JSXIdentifier') {
					if (attr.name.name === 'appearance') {
						if (attr.value?.type === 'StringLiteral') {
							element.appearanceValue = attr.value.value;
						} else if (attr.value?.type === 'JSXExpressionContainer') {
							const expression = attr.value.expression;
							if (expression.type === 'StringLiteral') {
								element.appearanceValue = expression.value;
							}
						}
					} else if (attr.name.name === 'isBold') {
						if (attr.value === null) {
							element.isBoldValue = true;
						} else if (attr.value?.type === 'JSXExpressionContainer') {
							const expression = attr.value.expression;
							if (expression.type === 'BooleanLiteral') {
								element.isBoldValue = expression.value;
							} else if (expression.type === 'Literal' && typeof expression.value === 'boolean') {
								element.isBoldValue = expression.value;
							}
						}
					}
				}
			});

			// Determine if this Lozenge should be migrated
			// Migrate if: appearance="new" OR appearance="discovery" OR (appearance="discovery" AND isBold={true})
			if (
				element.appearanceValue === 'new' ||
				element.appearanceValue === 'discovery' ||
				(element.appearanceValue === 'discovery' && element.isBoldValue === true)
			) {
				element.shouldMigrate = true;
			}

			if (element.shouldMigrate) {
				lozengeElements.push(element);
			}
		}
	});

	// If no elements to migrate, return early
	if (lozengeElements.length === 0) {
		return file.source;
	}

	// Check if Tag import exists
	const hasTagImport = source
		.find(j.ImportDeclaration)
		.some((importPath: any) => importPath.value.source.value === TAG_ENTRY_POINT);

	// Check if fg is already imported from @atlassian/jira-feature-gating
	const hasFgImport = source.find(j.ImportDeclaration).some((importPath: any) => {
		if (importPath.value.source.value === FG_ENTRY_POINT) {
			// Check if 'fg' is in the specifiers
			return importPath.value.specifiers?.some((spec: any) => {
				return spec.type === 'ImportSpecifier' && spec.imported.name === 'fg';
			});
		}
		return false;
	});

	// Add imports after Lozenge import to avoid blank lines
	const lozengeImport = source
		.find(j.ImportDeclaration)
		.filter((path: any) => {
			return path.value.source.value === LOZENGE_ENTRY_POINT;
		})
		.at(0);

	if (lozengeImport.length > 0) {
		// Add imports in reverse order so they appear in the right order
		if (!hasFgImport) {
			lozengeImport.insertAfter(
				j.importDeclaration(
					[j.importSpecifier(j.identifier('fg'))],
					j.stringLiteral(FG_ENTRY_POINT),
				),
			);
		}
		if (!hasTagImport) {
			lozengeImport.insertAfter(
				j.importDeclaration(
					[j.importDefaultSpecifier(j.identifier('Tag'))],
					j.stringLiteral(TAG_ENTRY_POINT),
				),
			);
		}
	}

	// Transform each element
	lozengeElements.forEach((element) => {
		const { path } = element;
		const openingElement = path.value.openingElement;

		// Extract text content or JSX expression from children
		const children = path.value.children;
		let textAttribute: any = null;

		if (children && children.length > 0) {
			// Check if there's a single JSX expression child (e.g., {formatMessage(...)})
			if (children.length === 1 && children[0].type === 'JSXExpressionContainer') {
				const expression = children[0].expression;
				// Use the expression as the text value
				textAttribute = j.jsxAttribute(
					j.jsxIdentifier('text'),
					j.jsxExpressionContainer(expression),
				);
			} else {
				// Extract plain text content from JSXText nodes
				const textContent = children
					.filter((child: any) => child.type === 'JSXText')
					.map((child: any) => child.value.trim())
					.filter((text: string) => text.length > 0)
					.join(' ');

				if (textContent) {
					textAttribute = j.jsxAttribute(j.jsxIdentifier('text'), j.stringLiteral(textContent));
				}
			}
		}

		// Create the Tag element
		const tagAttributes = [j.jsxAttribute(j.jsxIdentifier('color'), j.stringLiteral('purple'))];

		if (textAttribute) {
			tagAttributes.unshift(textAttribute);
		}

		// Copy other props from Lozenge to Tag (except appearance and isBold)
		openingElement.attributes?.forEach((attr: any) => {
			if (attr.type === 'JSXAttribute' && attr.name?.type === 'JSXIdentifier') {
				if (attr.name.name !== 'appearance' && attr.name.name !== 'isBold') {
					tagAttributes.push(attr);
				}
			}
		});

		const tagElement = j.jsxElement(
			j.jsxOpeningElement(j.jsxIdentifier('Tag'), tagAttributes, true),
			null,
			[],
		);

		// Keep the original Lozenge element (just the element, without wrapping)
		const lozengeElement = path.value;

		// Create the conditional expression: fg(FEATURE_GATE_NAME) ? <Tag .../> : <Lozenge .../>
		// When feature gate is ON, show Tag (new behavior)
		// When feature gate is OFF, show Lozenge (old behavior)
		const conditionalExpression = j.conditionalExpression(
			j.callExpression(j.identifier('fg'), [j.stringLiteral(FEATURE_GATE_NAME)]),
			tagElement,
			lozengeElement,
		);

		// Check if the parent is a JSXElement (means we're inside JSX, need curly braces)
		// Otherwise, it's a regular expression (like in a return statement)
		const parent = path.parent;
		const needsJSXWrapper =
			parent &&
			(parent.value.type === 'JSXElement' || parent.value.type === 'JSXExpressionContainer');

		if (needsJSXWrapper) {
			// Inside JSX, wrap in expression container
			j(path).replaceWith(j.jsxExpressionContainer(conditionalExpression));
		} else {
			// In regular JS context (like return statement), just use the conditional
			j(path).replaceWith(conditionalExpression);
		}
	});

	return source.toSource(PRINT_SETTINGS);
}
