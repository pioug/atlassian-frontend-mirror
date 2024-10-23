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

	addJsxPragma(j, base);

	// replace xcss with cssMap
	const xcssSpecifier = getImportSpecifier(j, base, 'xcss');
	if (!xcssSpecifier) {
		return;
	}

	replaceXcssWithCssMap(j, base, xcssSpecifier);

	updateImports(j, base);

	return base.toSource();
}

function addJsxPragma(j: core.JSCodeshift, source: ReturnType<typeof j>) {
	const jsxPragma = '*\n * @jsxRuntime classic\n * @jsx jsx\n ';
	// extract all comments, not just root node
	const allComments = source.find(j.Comment).nodes();

	const hasJsxPragma = allComments.some((comment) => {
		const value = comment.value;
		return /@jsxRuntime\s+classic/.test(value) && /@jsx\s+jsx/.test(value);
	});
	if (!hasJsxPragma) {
		// create new comment block for the jsx pragma
		const pragmaComment = j.commentBlock(jsxPragma, true, false);
		// insert at the top of the file
		const rootNode = source.get().node;
		if (!rootNode.comments) {
			rootNode.comments = [];
		}
		rootNode.comments.unshift(pragmaComment);
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

		// insert the cssMap var after all imports
		const lastImportIndex = source.find(j.ImportDeclaration).size();
		source.get().node.program.body.splice(lastImportIndex, 0, cssMapVariableDeclaration);
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
				} else if (expression.type === 'ArrayExpression') {
					// <Box xcss={[baseStyles, otherStyles]} /> -> <Box xcss={[styles.base, styles.otherStyles]} />
					expression.elements.forEach((element) => {
						if (element?.type === 'Identifier') {
							element.name = `styles.${getCssMapKey(element.name)}`;
						} else if (
							// <Box xcss={condition && styles} /> -> <Box xcss={condition && styles.root} />
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
				if (path.node.specifiers.length === 0) {
					// if no specifiers remain, remove the import
					j(path).remove();
				}
			}
		});

	const importsNeeded = {
		cssMap: false,
		jsx: false,
		token: false,
	};

	// check existing imports
	source.find(j.ImportDeclaration).forEach((path) => {
		switch (path.node.source.value) {
			case '@atlaskit/css':
				if (path.node.specifiers) {
					path.node.specifiers.forEach((specifier) => {
						if (specifier.local?.name === 'cssMap') {
							importsNeeded.cssMap = true;
						}
						if (specifier.local?.name === 'jsx') {
							importsNeeded.jsx = true;
						}
					});
				}
				break;
			case '@atlaskit/tokens':
				importsNeeded.token = true;
				break;
			case '@emotion/react':
				// remove the jsx import from @emotion/react
				path.node.specifiers = path.node.specifiers?.filter(
					(specifier) => j.ImportSpecifier.check(specifier) && specifier.imported.name !== 'jsx',
				);
				if (path.node.specifiers?.length === 0) {
					j(path).remove();
				}
				break;
		}
	});

	const newImports: ImportDeclaration[] = [];

	if (!importsNeeded.cssMap || !importsNeeded.jsx) {
		// add cssMap and jsx together if either is missing
		const cssMapImport = j.importDeclaration(
			[j.importSpecifier(j.identifier('cssMap')), j.importSpecifier(j.identifier('jsx'))],
			j.literal('@atlaskit/css'),
		);
		newImports.push(cssMapImport);
	}

	if (!importsNeeded.token) {
		const tokenImport = j.importDeclaration(
			[j.importSpecifier(j.identifier('token'))],
			j.literal('@atlaskit/tokens'),
		);
		newImports.push(tokenImport);
	}

	// remove default import React from 'react' if not needed
	source.find(j.ImportDeclaration, { source: { value: 'react' } }).forEach((path) => {
		path.node.specifiers = path.node.specifiers?.filter(
			(specifier) =>
				!(specifier.type === 'ImportDefaultSpecifier' && specifier.local?.name === 'React'),
		);
		if (path.node.specifiers?.length === 0) {
			j(path).remove();
		}
	});

	// update @atlaskit/primitives imports to @atlaskit/primitives/compiled
	source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === '@atlaskit/primitives')
		.forEach((path) => {
			path.node.source.value = '@atlaskit/primitives/compiled';
		});

	// add new imports after any existing comments to ensure they're below the jsx pragma
	const rootNode = source.get().node;
	const firstNonCommentIndex = rootNode.program.body.findIndex(
		(node: core.Node) =>
			node.type !== 'ImportDeclaration' &&
			node.type !== 'CommentBlock' &&
			node.type !== 'CommentLine',
	);

	rootNode.program.body.splice(firstNonCommentIndex, 0, ...newImports);
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
