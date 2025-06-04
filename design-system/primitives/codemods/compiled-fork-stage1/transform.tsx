import type { API, FileInfo, JSXAttribute } from 'jscodeshift';

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

function transform(file: FileInfo, { jscodeshift: j }: API) {
	const root = j(file.source);
	let needsCssMapImport = false;

	// Check if any import from '@atlaskit/primitives' contains 'xcss'
	const hasDescopedImport = root
		.find(j.ImportDeclaration, { source: { value: '@atlaskit/primitives' } })
		.some((path) => {
			return path.node.specifiers!.some((specifier) => {
				if (!j.ImportSpecifier.check(specifier)) {
					return false;
				}

				return ['xcss', 'media', 'XCSS'].includes(specifier.imported.name);
			});
		});

	// If 'xcss' is imported, return the original source without transformations
	if (hasDescopedImport) {
		return file.source;
	}

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

	// Has @atlaskit/primitives import?
	const hasPrimitivesImport =
		root.find(j.ImportDeclaration, { source: { value: '@atlaskit/primitives' } }).length > 0;

	if (!hasPrimitivesImport) {
		return file.source;
	}

	// Find all import declarations from '@atlaskit/primitives'
	root.find(j.ImportDeclaration, { source: { value: '@atlaskit/primitives' } }).forEach((path) => {
		// Change the import to '@atlaskit/primitives/compiled'
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

	// Find JSX elements for Grid, Anchor and Pressable
	root.find(j.JSXElement).forEach((path) => {
		if (!j.JSXIdentifier.check(path.node.openingElement.name)) {
			return;
		}

		const elementName = path.node.openingElement.name.name;
		if (elementName !== 'Grid' && elementName !== 'Anchor' && elementName !== 'Pressable') {
			return;
		}

		const attributes = path.node.openingElement.attributes || [];
		const props = attributes.filter((attr) => j.JSXAttribute.check(attr)) as Array<JSXAttribute>;

		const xcssProps = elementName === 'Grid' ? GRID_XCSS_PROPS : ANCHOR_PRESSABLE_XCSS_PROPS;
		const propsToTransform = props.filter(
			(prop) => j.JSXIdentifier.check(prop.name) && xcssProps.includes(prop.name.name),
		);

		if (propsToTransform.length === 0) {
			return;
		}

		needsCssMapImport = true;

		// Create styles variable name
		const stylesName = `${elementName.toLowerCase()}Styles`;

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

		const importDeclaration = root.find(j.ImportDeclaration, {
			source: { value: '@atlaskit/primitives/compiled' },
		});

		if (importDeclaration.length > 0) {
			// insert after the last import declaration
			const imports = root.find(j.ImportDeclaration);
			const lastImport = imports.at(imports.length - 1);

			const cssMapDeclaration = root
				.find(j.VariableDeclaration)
				// @ts-expect-error
				.filter((path) => path.node.declarations[0].id.name === stylesName);

			if (lastImport && !cssMapDeclaration.length) {
				lastImport.insertAfter(cssMapDecl);
			}
		}

		// Remove transformed props and add xcss prop
		propsToTransform.forEach((prop) => {
			const index = attributes.indexOf(prop);
			attributes.splice(index, 1);
		});

		const existingXcss = props.find(
			(prop) => j.JSXIdentifier.check(prop.name) && prop.name.name === 'xcss',
		);

		const xcssValue = existingXcss
			? j.arrayExpression([
					j.memberExpression(j.identifier(stylesName), j.identifier('root')),
					// @ts-expect-error
					existingXcss.value.expression,
				])
			: j.memberExpression(j.identifier(stylesName), j.identifier('root'));

		if (existingXcss) {
			existingXcss.value = j.jsxExpressionContainer(xcssValue);
		} else {
			attributes.push(j.jsxAttribute(j.jsxIdentifier('xcss'), j.jsxExpressionContainer(xcssValue)));
		}
	});

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

	return root.toSource({ quote: 'single' });
}

export default transform;
