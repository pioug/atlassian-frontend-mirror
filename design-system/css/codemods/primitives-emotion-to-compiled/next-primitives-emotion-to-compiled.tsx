import type {
	API,
	ASTPath,
	default as core,
	FileInfo,
	ImportDeclaration,
	Options,
} from 'jscodeshift';

import {
	backgroundColorMap,
	borderColorMap,
	borderRadiusMap,
	borderWidthMap,
	dimensionMap,
	fillMap,
	fontFamilyMap,
	fontMap,
	fontWeightMap,
	layerMap,
	negativeSpaceMap,
	opacityMap,
	positiveSpaceMap,
	shadowMap,
	surfaceColorMap,
	textColorMap,
	textWeightMap,
} from './style-maps.partial';

const styleMaps = {
	...backgroundColorMap,
	...borderColorMap,
	...borderRadiusMap,
	...borderWidthMap,
	...dimensionMap,
	...fillMap,
	...fontFamilyMap,
	...fontMap,
	...fontWeightMap,
	...layerMap,
	...negativeSpaceMap,
	...opacityMap,
	...positiveSpaceMap,
	...shadowMap,
	...surfaceColorMap,
	...textColorMap,
	...textWeightMap,
};

export default function transformer(fileInfo: FileInfo, { jscodeshift: j }: API, options: Options) {
	const base = j(fileInfo.source);

	// replace xcss with cssMap
	const xcssSpecifier = getImportSpecifier(j, base, 'xcss');
	if (!xcssSpecifier) {
		return;
	}

	addJsxPragma(j, base);

	replaceXcssWithCssMap(j, base, xcssSpecifier);

	updateImports(j, base);

	return base.toSource();
}

function addJsxPragma(j: core.JSCodeshift, source: ReturnType<typeof j>) {
	const jsxPragma = [j.commentBlock('*\n * @jsxRuntime classic\n * @jsx jsx\n ', true, false)];

	const rootNode = source.get().node;
	const existingComments = rootNode.comments || [];

	const hasJsxPragma = existingComments.some(
		(comment: core.Comment) =>
			comment.value.includes('@jsxRuntime classic') && comment.value.includes('@jsx jsx'),
	);

	if (!hasJsxPragma) {
		rootNode.comments = [...existingComments, ...jsxPragma];
	}
}

function replaceXcssWithCssMap(
	j: core.JSCodeshift,
	source: ReturnType<typeof j>,
	specifier: string,
) {
	const cssMapProperties: core.ObjectProperty[] = [];

	source
		.find(j.CallExpression, {
			// get all xcss calls
			callee: {
				type: 'Identifier',
				name: specifier,
			},
		})
		.forEach((path) => {
			const args = path.node.arguments;
			if (args.length === 1 && args[0].type === 'ObjectExpression') {
				// get the parent variable declaration
				// e.g. const buttonStyles = xcss({ color: 'red' });
				const parentVariableDeclaration = path.parentPath?.parentPath?.parentPath?.node;
				if (parentVariableDeclaration && parentVariableDeclaration.type === 'VariableDeclaration') {
					const variableDeclarator = parentVariableDeclaration.declarations.find(
						(declaration: core.VariableDeclarator) => declaration.init === path.node,
					);

					if (variableDeclarator && variableDeclarator.type === 'VariableDeclarator') {
						const variableName = variableDeclarator.id.name; // e.g. buttonStyles
						const key = getCssMapKey(variableName); // buttonStyles -> button to put in cssMap as the key e.g. styles = cssMap({ button: { color: 'red' } });

						const cssMapObject = j.objectProperty(
							j.identifier(key),
							ensureSelectorAmpersand(j, args[0]),
						);
						cssMapProperties.push(cssMapObject);

						j(path.parentPath.parentPath.parentPath).remove(); // remove original xcss object
					}
				}
			}
		});

	// create new cssMap with the combined xcss object properties
	if (cssMapProperties.length > 0) {
		const cssMapObject = j.objectExpression(cssMapProperties);
		const cssMapVariableDeclaration = j.variableDeclaration('const', [
			j.variableDeclarator(
				j.identifier('styles'),
				j.callExpression(j.identifier('cssMap'), [cssMapObject]),
			),
		]);
		source.get().node.program.body.unshift(cssMapVariableDeclaration);
	}

	// update the xcss prop references to use the new cssMap object
	source
		.find(j.JSXAttribute, {
			name: {
				type: 'JSXIdentifier',
				name: 'xcss',
			},
		})
		.forEach((path) => {
			const value = path.node.value;
			// e.g. <Box xcss={buttonStyles} />
			if (value && value.type === 'JSXExpressionContainer') {
				const expression = value.expression;
				if (expression.type === 'Identifier') {
					// <Box xcss={buttonStyles} /> -> <Box xcss={styles.button} />
					expression.name = `styles.${getCssMapKey(expression.name)}`;
					// <Box xcss={[baseStyles, otherStyles]} /> -> <Box xcss={[styles.base, styles.otherStyles]} />
				} else if (expression.type === 'ArrayExpression') {
					expression.elements.forEach((element) => {
						if (element?.type === 'Identifier') {
							element.name = `styles.${getCssMapKey(element.name)}`;
							// <Box xcss={condition && styles} /> -> <Box xcss={condition && styles.root} />
						} else if (
							element?.type === 'LogicalExpression' &&
							element.right.type === 'Identifier'
						) {
							element.right.name = `styles.${getCssMapKey(element.right.name)}`;
						}
					});
				}
			}
		});

	// replace style keys with their corresponding values from the map
	source.find(j.ObjectProperty).forEach((path) => {
		const key = path.node.key;
		const value = path.node.value;

		if (key.type === 'Identifier' && value.type === 'StringLiteral') {
			const styleKey = value.value as keyof typeof styleMaps;
			if (styleMaps[styleKey]) {
				const mapValue = styleMaps[styleKey];
				if (typeof mapValue === 'string' && mapValue.startsWith('var(')) {
					// token call
					j(path).replaceWith(
						j.objectProperty(
							key,
							j.callExpression(j.identifier('token'), [j.stringLiteral(styleKey)]),
						),
					);
				} else {
					// non-token call, just use the value
					j(path).replaceWith(j.objectProperty(key, j.literal(mapValue)));
				}
			} else {
				// copy the original object property and value when not in styleMaps
				// e.g. color: 'red'
				j(path).replaceWith(j.objectProperty(key, value));
			}
		}
	});
}

// this only accounts for if the selector starts with a colon
// e.g. { ':hover': { ... } } -> { '&:hover': { ... } }
function ensureSelectorAmpersand(j: core.JSCodeshift, objectExpression: core.ObjectExpression) {
	objectExpression.properties.forEach((property) => {
		if (property.type === 'ObjectProperty' && property.key.type === 'StringLiteral') {
			const key = property.key.value;
			if (key.startsWith(':')) {
				property.key = j.stringLiteral(`&${key}`);
			}
		}
	});
	return objectExpression;
}

function updateImports(j: core.JSCodeshift, source: ReturnType<typeof j>) {
	// remove xcss import
	source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === '@atlaskit/primitives')
		.forEach((path) => {
			if (path.node.specifiers) {
				path.node.specifiers = path.node.specifiers.filter(
					(specifier) => specifier.local?.name !== 'xcss',
				);
			}
		});

	const existingImports = source.find(j.ImportDeclaration);

	const hasCssMapImport = existingImports.some(
		(path) => path.node.source.value === '@atlaskit/css',
	);
	if (!hasCssMapImport) {
		const cssMapImport = j.importDeclaration(
			[j.importSpecifier(j.identifier('cssMap'))],
			j.literal('@atlaskit/css'),
		);
		source.get().node.program.body.unshift(cssMapImport);
	}

	const hasTokenImport = existingImports.some(
		(path) => path.node.source.value === '@atlaskit/tokens',
	);
	if (!hasTokenImport) {
		const tokenImport = j.importDeclaration(
			[j.importSpecifier(j.identifier('token'))],
			j.literal('@atlaskit/tokens'),
		);
		source.get().node.program.body.unshift(tokenImport);
	}

	// update existing @atlaskit/primitives imports to @atlaskit/primitives/compiled
	// e.g. import { Box } from '@atlaskit/primitives' -> import { Box } from '@atlaskit/primitives/compiled'
	source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === '@atlaskit/primitives')
		.forEach((path) => {
			path.node.source.value = '@atlaskit/primitives/compiled';
		});

	const hasJsxImport = existingImports.some((path) => path.node.source.value === '@compiled/react');
	if (!hasJsxImport) {
		// check if there is `import { jsx } from '@emotion/react'`
		// this should be replaced with `import { jsx } from '@compiled/react'`
		const existingEmotionImport = source
			.find(j.ImportDeclaration)
			.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === '@emotion/react')
			.find(j.ImportSpecifier)
			.filter((path) => path.node.imported.name === 'jsx');

		const jsxImport = j.importDeclaration(
			[j.importSpecifier(j.identifier('jsx'))],
			j.literal('@compiled/react'),
		);

		if (existingEmotionImport.size() > 0) {
			// replace jsx import from `@emotion/react` with `@compiled/react`
			existingEmotionImport.closest(j.ImportDeclaration).replaceWith(jsxImport);
		} else {
			// add the new import at the top of the file
			source.get().node.program.body.unshift(jsxImport);
		}
	}

	// sort import declarations alphabetically
	// probably not necessary as we can rely on prettier on save
	const allImports = source.find(j.ImportDeclaration).nodes();
	allImports.sort((a, b) => {
		if (
			typeof a.source.value === 'undefined' ||
			typeof b.source.value === 'undefined' ||
			a.source.value === null ||
			b.source.value === null
		) {
			return 0;
		}

		return a.source.value > b.source.value ? 1 : -1;
	});
	source.get().node.program.body = [
		...allImports,
		...source
			.get()
			.node.program.body.filter((node: core.Node) => node.type !== 'ImportDeclaration'),
	];
}

// look for xcss import
function getImportSpecifier(j: core.JSCodeshift, source: any, specifier: string) {
	const specifiers = source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === '@atlaskit/primitives')
		.find(j.ImportSpecifier)
		.filter((path: any) => path.node.imported.name === specifier);

	if (!specifiers.length) {
		return null;
	}
	return specifiers.nodes()[0]!.local!.name;
}

/*
 * Logic to determine the key for the cssMap object
 * e.g. styles -> root, buttonStyles -> button
 * We might want nicer logic in the future with some smarts/context
 * about the element it's being applied to
 * e.g. if the element just has one style, we should just use the key 'root'
 */
function getCssMapKey(variableName: string): string {
	if (variableName.toLowerCase() === 'styles') {
		return 'root';
	}
	return variableName.replace(/Styles$/i, '');
}
