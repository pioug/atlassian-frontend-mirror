import type {
	API,
	FileInfo,
	ImportSpecifier,
	JSXAttribute,
	VariableDeclaration,
} from 'jscodeshift';

const ANCHOR_PRESSABLE_XCSS_PROPS = [
	'backgroundColor',
	'padding',
	'paddingBlock',
	'paddingBlockStart',
	'paddingBlockEnd',
	'paddingInline',
	'paddingInlineStart',
	'paddingInlineEnd',
];

const GRID_XCSS_PROPS = ['templateRows', 'templateColumns', 'templateAreas'];

const PRIMITIVES_IMPORT_SOURCES = ['@atlaskit/primitives', '@atlaskit/primitives/compiled'];

function transform(file: FileInfo, { jscodeshift: j }: API) {
	const root = j(file.source);
	let needsCssMapImport = false;

	// If Box primitive is used with spread props, return the original source without transformations
	const hasBoxPrimitiveWithSpreadProps = root
		.find(j.JSXElement, { openingElement: { name: { name: 'Box' } } })
		.some(
			(path) =>
				path.node.openingElement.attributes?.some((attr) => j.JSXSpreadAttribute.check(attr)) ??
				false,
		);

	if (hasBoxPrimitiveWithSpreadProps) {
		return file.source;
	}

	// Check if xcss is imported
	const hasXcssImport = root
		.find(j.ImportDeclaration, { source: { value: '@atlaskit/primitives' } })
		.some(
			(path) =>
				path.node.specifiers?.some(
					(specifier) => j.ImportSpecifier.check(specifier) && specifier.imported.name === 'xcss',
				) ?? false,
		);

	// Check if media is imported
	const hasMediaImport = root
		.find(j.ImportDeclaration, { source: { value: '@atlaskit/primitives' } })
		.some(
			(path) =>
				path.node.specifiers?.some(
					(specifier) => j.ImportSpecifier.check(specifier) && specifier.imported.name === 'media',
				) ?? false,
		);

	// If media is imported, return the original source without transformations
	if (hasMediaImport) {
		return file.source;
	}

	// If xcss is imported, check if there's only one other primitive component
	if (hasXcssImport) {
		const primitiveImports =
			root
				.find(j.ImportDeclaration, { source: { value: '@atlaskit/primitives' } })
				.get()
				.node.specifiers?.filter(
					(specifier: ImportSpecifier) =>
						j.ImportSpecifier.check(specifier) && specifier.imported.name !== 'xcss',
				) ?? [];

		// If there's only one other primitive component, skip the file
		if (primitiveImports.length === 1) {
			return file.source;
		}

		// Otherwise, split the imports but keep components that use xcss
		root
			.find(j.ImportDeclaration, { source: { value: '@atlaskit/primitives' } })
			.forEach((path) => {
				// Skip type imports
				if (path.node.importKind === 'type') {
					return;
				}

				const xcssSpecifiers =
					path.node.specifiers?.filter(
						(specifier) => j.ImportSpecifier.check(specifier) && specifier.imported.name === 'xcss',
					) ?? [];
				const otherSpecifiers =
					path.node.specifiers?.filter(
						(specifier) => j.ImportSpecifier.check(specifier) && specifier.imported.name !== 'xcss',
					) ?? [];

				// Find components that use xcss
				const componentsUsingXcss = new Set<string>();
				root.find(j.JSXElement).forEach((jsxPath) => {
					if (!j.JSXIdentifier.check(jsxPath.node.openingElement.name)) {
						return;
					}

					const elementName = jsxPath.node.openingElement.name.name;
					const attributes = jsxPath.node.openingElement.attributes || [];
					const hasXcssProp = attributes.some(
						(attr) =>
							j.JSXAttribute.check(attr) &&
							j.JSXIdentifier.check(attr.name) &&
							attr.name.name === 'xcss',
					);

					if (hasXcssProp) {
						componentsUsingXcss.add(elementName);
					}
				});

				// Split specifiers based on xcss usage
				const specifiersToKeep = otherSpecifiers.filter(
					(specifier) =>
						j.ImportSpecifier.check(specifier) && componentsUsingXcss.has(specifier.imported.name),
				);
				const specifiersToMove = otherSpecifiers.filter(
					(specifier) =>
						j.ImportSpecifier.check(specifier) && !componentsUsingXcss.has(specifier.imported.name),
				);

				if (specifiersToMove.length > 0) {
					// Add new import for components that don't use xcss
					path.insertAfter(
						j.importDeclaration(specifiersToMove, j.literal('@atlaskit/primitives/compiled')),
					);
				}

				// Update original import to include xcss and components that use it
				path.node.specifiers = [...xcssSpecifiers, ...specifiersToKeep];
			});

		return root.toSource({ quote: 'single' });
	}

	// Check if any component uses xcss
	const hasXcssUsage = root.find(j.JSXElement).some((path) => {
		if (!j.JSXIdentifier.check(path.node.openingElement.name)) {
			return false;
		}

		const elementName = path.node.openingElement.name.name;
		const isPrimitiveComponent = PRIMITIVES_IMPORT_SOURCES.some((importSource) =>
			root.find(j.ImportDeclaration, { source: { value: importSource } }).some((importPath) => {
				return importPath.node.specifiers!.some((specifier) => {
					if (!j.ImportSpecifier.check(specifier)) {
						return false;
					}
					return specifier.local?.name === elementName;
				});
			}),
		);

		if (!isPrimitiveComponent) {
			return false;
		}

		const attributes = path.node.openingElement.attributes || [];
		return attributes.some(
			(attr) =>
				j.JSXAttribute.check(attr) && j.JSXIdentifier.check(attr.name) && attr.name.name === 'xcss',
		);
	});

	// If any component uses xcss, return the original source without transformations
	if (hasXcssUsage) {
		return file.source;
	}

	// Has @atlaskit/primitives import?
	const hasPrimitivesImport =
		root.find(j.ImportDeclaration, { source: { value: '@atlaskit/primitives' } }).length > 0;

	if (!hasPrimitivesImport) {
		return file.source;
	}

	// Check if any component has mixed xcss usage by looking at JSX elements directly
	const componentXcssUsage = new Map<string, boolean>();
	const hasMixedXcssUsage = root.find(j.JSXElement).some((path) => {
		if (!j.JSXIdentifier.check(path.node.openingElement.name)) {
			return false;
		}

		const elementName = path.node.openingElement.name.name;
		const isPrimitiveComponent = PRIMITIVES_IMPORT_SOURCES.some((importSource) =>
			root.find(j.ImportDeclaration, { source: { value: importSource } }).some((importPath) => {
				return importPath.node.specifiers!.some((specifier) => {
					if (!j.ImportSpecifier.check(specifier)) {
						return false;
					}
					return specifier.local?.name === elementName;
				});
			}),
		);

		if (!isPrimitiveComponent) {
			return false;
		}

		const attributes = path.node.openingElement.attributes || [];
		const props = attributes.filter((attr) => j.JSXAttribute.check(attr)) as Array<JSXAttribute>;
		const hasXcssProp = props.some(
			(prop) => j.JSXIdentifier.check(prop.name) && prop.name.name === 'xcss',
		);

		// Track xcss usage for this component type
		if (!componentXcssUsage.has(elementName)) {
			componentXcssUsage.set(elementName, hasXcssProp);
		} else if (componentXcssUsage.get(elementName) !== hasXcssProp) {
			// If we've seen this component before and the xcss usage is different, we have mixed usage
			return true;
		}

		return false;
	});

	// If there's mixed xcss usage, don't transform anything
	if (hasMixedXcssUsage) {
		return file.source;
	}

	// Find all import declarations from '@atlaskit/primitives'
	root.find(j.ImportDeclaration, { source: { value: '@atlaskit/primitives' } }).forEach((path) => {
		// Skip type imports
		if (path.node.importKind === 'type') {
			return;
		}
		path.node.source = j.literal('@atlaskit/primitives/compiled');
	});

	// Find existing cssMap import or alias
	let cssMapName = 'cssMap';
	const cssMapImport = root.find(j.ImportDeclaration, {
		source: { value: '@atlaskit/css' },
	});

	if (cssMapImport.length > 0) {
		const cssMapSpecifier = cssMapImport.find(j.ImportSpecifier, {
			imported: { name: 'cssMap' },
		});
		if (cssMapSpecifier.length > 0) {
			cssMapName = cssMapSpecifier.get(0).node.local?.name || 'cssMap';
		}
	}

	// Find all existing cssMap declarations
	const existingCssMapDeclarations = new Map<string, string>();
	root.find(j.VariableDeclaration).forEach((path) => {
		const declaration = path.node.declarations[0];
		if (
			j.VariableDeclarator.check(declaration) &&
			j.Identifier.check(declaration.id) &&
			j.CallExpression.check(declaration.init) &&
			j.Identifier.check(declaration.init.callee) &&
			declaration.init.callee.name === cssMapName
		) {
			existingCssMapDeclarations.set(declaration.id.name, declaration.id.name);
		}
	});

	// Find all JSX elements
	const jsxElements = root.find(j.JSXElement).paths();
	const processedComponentTypes = new Map<
		string,
		{ name: string; declaration: VariableDeclaration }
	>();

	// Add token import if needed
	let needsTokenImport = false;

	jsxElements.forEach((path) => {
		if (!j.JSXIdentifier.check(path.node.openingElement.name)) {
			return;
		}

		const elementName = path.node.openingElement.name.name;

		// Find if this component is imported from @atlaskit/primitives or @atlaskit/primitives/compiled
		const isPrimitiveComponent = PRIMITIVES_IMPORT_SOURCES.some((importSource) =>
			root.find(j.ImportDeclaration, { source: { value: importSource } }).some((importPath) => {
				return importPath.node.specifiers!.some((specifier) => {
					if (!j.ImportSpecifier.check(specifier)) {
						return false;
					}
					return specifier.local?.name === elementName;
				});
			}),
		);

		if (!isPrimitiveComponent) {
			return;
		}

		const attributes = path.node.openingElement.attributes || [];
		const props = attributes.filter((attr) => j.JSXAttribute.check(attr)) as Array<JSXAttribute>;

		// Skip if component already has xcss prop
		const hasXcss = props.some(
			(prop) => j.JSXIdentifier.check(prop.name) && prop.name.name === 'xcss',
		);

		if (hasXcss) {
			return;
		}

		const xcssProps =
			elementName === 'Grid'
				? [...GRID_XCSS_PROPS, ...ANCHOR_PRESSABLE_XCSS_PROPS]
				: ANCHOR_PRESSABLE_XCSS_PROPS;
		const propsToTransform = props.filter(
			(prop) => j.JSXIdentifier.check(prop.name) && xcssProps.includes(prop.name.name),
		);

		if (propsToTransform.length === 0) {
			return;
		}

		needsCssMapImport = true;

		// Create styles variable name
		const stylesName = `${elementName.toLowerCase()}Styles`;

		// Skip if we've already processed this component type
		if (processedComponentTypes.has(elementName)) {
			// Use existing styles
			const existingStyles = processedComponentTypes.get(elementName)!;
			// Remove transformed props and add xcss prop
			propsToTransform.forEach((prop) => {
				const index = attributes.indexOf(prop);
				attributes.splice(index, 1);
			});
			attributes.push(
				j.jsxAttribute(
					j.jsxIdentifier('xcss'),
					j.jsxExpressionContainer(
						j.memberExpression(j.identifier(existingStyles.name), j.identifier('root')),
					),
				),
			);
			return;
		}

		// Skip if we already have a cssMap declaration for this component type
		if (existingCssMapDeclarations.has(stylesName)) {
			// Remove transformed props and add xcss prop
			propsToTransform.forEach((prop) => {
				const index = attributes.indexOf(prop);
				attributes.splice(index, 1);
			});

			attributes.push(
				j.jsxAttribute(
					j.jsxIdentifier('xcss'),
					j.jsxExpressionContainer(
						j.memberExpression(j.identifier(stylesName), j.identifier('root')),
					),
				),
			);
			return;
		}

		// Create cssMap declaration
		const styleObj = j.objectExpression(
			propsToTransform.map((prop) => {
				if (!j.JSXIdentifier.check(prop.name)) {
					return j.objectProperty(j.identifier(''), j.literal(''));
				}
				const propName = prop.name.name;
				const cssPropName = propName.startsWith('template')
					? `grid${propName.charAt(0).toUpperCase()}${propName.slice(1)}`
					: propName;

				if (!prop.value) {
					return j.objectProperty(j.identifier(cssPropName), j.literal(''));
				}

				if (j.JSXExpressionContainer.check(prop.value)) {
					if (j.JSXEmptyExpression.check(prop.value.expression)) {
						return j.objectProperty(j.identifier(cssPropName), j.literal(''));
					}
					return j.objectProperty(j.identifier(cssPropName), prop.value.expression);
				}

				// Only wrap string values in token() if they're not grid props
				if (j.StringLiteral.check(prop.value) && !propName.startsWith('template')) {
					needsTokenImport = true;
					return j.objectProperty(
						j.identifier(cssPropName),
						j.callExpression(j.identifier('token'), [prop.value]),
					);
				}

				return j.objectProperty(j.identifier(cssPropName), prop.value);
			}),
		);

		const cssMapDecl = j.variableDeclaration('const', [
			j.variableDeclarator(
				j.identifier(stylesName),
				j.callExpression(j.identifier(cssMapName), [
					j.objectExpression([j.objectProperty(j.identifier('root'), styleObj)]),
				]),
			),
		]);

		processedComponentTypes.set(elementName, { name: stylesName, declaration: cssMapDecl });

		// Remove all props and add xcss prop
		propsToTransform.forEach((prop) => {
			const index = attributes.indexOf(prop);
			attributes.splice(index, 1);
		});

		attributes.push(
			j.jsxAttribute(
				j.jsxIdentifier('xcss'),
				j.jsxExpressionContainer(
					j.memberExpression(j.identifier(stylesName), j.identifier('root')),
				),
			),
		);
	});

	// Insert cssMap declarations after the last import declaration
	const imports = root.find(j.ImportDeclaration);
	const lastImport = imports.at(imports.length - 1);

	if (lastImport) {
		// Insert declarations in the order they were first encountered
		Array.from(processedComponentTypes.values()).forEach(({ declaration }) => {
			lastImport.insertAfter(declaration);
		});
	}

	// Add cssMap import if needed
	if (needsCssMapImport && cssMapImport.length === 0) {
		root
			.get()
			.node.program.body.unshift(
				j.importDeclaration(
					[j.importSpecifier(j.identifier('cssMap'))],
					j.literal('@atlaskit/css'),
				),
			);
	}

	// Add token import if needed
	if (needsTokenImport) {
		root
			.get()
			.node.program.body.unshift(
				j.importDeclaration(
					[j.importSpecifier(j.identifier('token'))],
					j.literal('@atlaskit/tokens'),
				),
			);
	}

	return root.toSource({ quote: 'single' });
}

export default transform;
