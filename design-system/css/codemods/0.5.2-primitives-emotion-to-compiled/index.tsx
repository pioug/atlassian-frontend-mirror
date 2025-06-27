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

	replaceXcssWithCssMap(j, base, xcssSpecifier);

	updateImports(j, base);

	addJsxPragma(j, base);

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
	let firstXcssPath: ASTPath<core.CallExpression> | null = null;
	let firstUsagePath: ASTPath<core.Node> | null = null;
	const styleVariables = new Set<string>();
	const variableDependencies = new Map<string, Set<string>>();
	const inlineXcssUsages: Array<{
		path: ASTPath<core.CallExpression>;
		keyName: string;
		jsxAttribute: ASTPath<core.JSXAttribute>;
		componentName: string;
		variableName: string;
	}> = [];

	// First pass: collect all xcss variable declarations
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
						styleVariables.add(variableName);

						// find dependencies in the xcss object
						const dependencies = new Set<string>();
						if (args[0].type === 'ObjectExpression') {
							args[0].properties.forEach((prop) => {
								if (prop.type === 'ObjectProperty' && prop.value.type === 'TemplateLiteral') {
									prop.value.expressions.forEach((expr) => {
										if (expr.type === 'Identifier') {
											dependencies.add(expr.name);
										}
									});
								}
							});
						}
						if (dependencies.size > 0) {
							variableDependencies.set(variableName, dependencies);
						}
					}
				} else {
					// This is an inline xcss call - check if it's inside a JSX attribute
					let current = path.parentPath;
					let jsxElement: ASTPath<core.JSXElement> | null = null;

					while (current) {
						if (
							current.node.type === 'JSXAttribute' &&
							current.node.name.type === 'JSXIdentifier' &&
							current.node.name.name === 'xcss'
						) {
							// Found inline xcss usage - now find the JSX element
							let elementCurrent = current.parentPath;
							while (elementCurrent) {
								if (elementCurrent.node.type === 'JSXElement') {
									jsxElement = elementCurrent as ASTPath<core.JSXElement>;
									break;
								}
								elementCurrent = elementCurrent.parentPath;
							}

							if (jsxElement && jsxElement.node.openingElement.name.type === 'JSXIdentifier') {
								const componentName = jsxElement.node.openingElement.name.name;
								const variableName = `${componentName.toLowerCase()}Styles`;
								const keyName = 'root';

								inlineXcssUsages.push({
									path,
									keyName,
									jsxAttribute: current as ASTPath<core.JSXAttribute>,
									componentName,
									variableName,
								});
							}
							break;
						}
						current = current.parentPath;
					}
				}
			}
		});

	// find the first usage of any style variable or inline xcss
	source.find(j.Identifier).forEach((path) => {
		if (
			styleVariables.has(path.node.name) &&
			(!firstUsagePath ||
				(path.node.loc?.start &&
					firstUsagePath.node.loc?.start &&
					(path.node.loc.start.line < firstUsagePath.node.loc.start.line ||
						(path.node.loc.start.line === firstUsagePath.node.loc.start.line &&
							path.node.loc.start.column < firstUsagePath.node.loc.start.column))))
		) {
			firstUsagePath = path;
		}
	});

	// Check for inline xcss usage as well for first usage
	if (
		inlineXcssUsages.length > 0 &&
		(!firstUsagePath || inlineXcssUsages[0].path.node.loc?.start)
	) {
		firstUsagePath = inlineXcssUsages[0].path;
	}

	// Process variable xcss declarations
	source
		.find(j.CallExpression, {
			callee: {
				type: 'Identifier',
				name: specifier,
			},
		})
		.forEach((path) => {
			const args = path.node.arguments;
			// only process xcss calls that have a single object argument
			if (args.length === 1 && args[0].type === 'ObjectExpression') {
				// get the parent variable declaration that contains this xcss call
				// e.g. const buttonStyles = xcss({...})
				const parentVariableDeclaration = path.parentPath?.parentPath?.parentPath?.node;
				if (parentVariableDeclaration && parentVariableDeclaration.type === 'VariableDeclaration') {
					// find the variable declarator that initialises with this xcss call
					// e.g. const buttonStyles = xcss({ color: 'red' });
					const variableDeclarator = parentVariableDeclaration.declarations.find(
						(declaration: core.VariableDeclarator) => declaration.init === path.node,
					);

					if (variableDeclarator && variableDeclarator.type === 'VariableDeclarator') {
						// convert the variable name to a cssMap key (e.g. myStyles -> root)
						const variableName = variableDeclarator.id.name;
						const key = getCssMapKey(variableName);

						// create a new cssMap property with the key and the processed styles
						const cssMapObject = j.objectProperty(
							j.identifier(key),
							ensureSelectorAmpersand(j, args[0]),
						);
						cssMapProperties.push(cssMapObject);

						// track the first xcss call
						if (!firstXcssPath) {
							firstXcssPath = path;
						}

						// remove the original xcss variable declaration since we'll replace it with cssMap
						j(path.parentPath.parentPath.parentPath).remove();
					}
				}
			}
		});

	// Process inline xcss usages - create separate cssMap for each
	const cssMapDeclarations: core.VariableDeclaration[] = [];

	inlineXcssUsages.forEach(({ path, keyName, jsxAttribute, componentName, variableName }) => {
		const args = path.node.arguments;
		if (args.length === 1 && args[0].type === 'ObjectExpression') {
			// Create separate cssMap declaration for each inline xcss
			const cssMapObject = j.objectProperty(
				j.identifier(keyName),
				ensureSelectorAmpersand(j, args[0]),
			);

			const cssMapVariableDeclaration = j.variableDeclaration('const', [
				j.variableDeclarator(
					j.identifier(variableName),
					j.callExpression(j.identifier('cssMap'), [j.objectExpression([cssMapObject])]),
				),
			]);

			cssMapDeclarations.push(cssMapVariableDeclaration);

			// Update the JSX attribute to use the cssMap reference
			jsxAttribute.node.value = j.jsxExpressionContainer(
				j.memberExpression(j.identifier(variableName), j.identifier(keyName)),
			);

			// Track first xcss call if not already set
			if (!firstXcssPath) {
				firstXcssPath = path;
			}
		}
	});

	// create new cssMap with the combined xcss object properties (for variable declarations)
	if (cssMapProperties.length > 0) {
		const cssMapObject = j.objectExpression(cssMapProperties);
		const cssMapVariableDeclaration = j.variableDeclaration('const', [
			j.variableDeclarator(
				j.identifier('styles'),
				j.callExpression(j.identifier('cssMap'), [cssMapObject]),
			),
		]);

		cssMapDeclarations.unshift(cssMapVariableDeclaration);
	}

	// Insert all cssMap declarations
	if (cssMapDeclarations.length > 0 && firstUsagePath) {
		const programBody = source.get().node.program.body;
		let insertIndex = 0;

		// find the last variable declaration that any style depends on
		let lastDependencyIndex = -1;
		for (let i = 0; i < programBody.length; i++) {
			const node = programBody[i];
			if (node.type === 'VariableDeclaration') {
				const varName = node.declarations[0]?.id.name;
				if (varName) {
					// check if this variable is a dependency of any style
					for (const [, deps] of variableDependencies.entries()) {
						if (deps.has(varName)) {
							lastDependencyIndex = i;
							break;
						}
					}
				}
			}
		}

		// insert after the last dependency
		if (lastDependencyIndex !== -1) {
			insertIndex = lastDependencyIndex + 1;
		} else {
			// if no dependencies, find the first non-import/type declaration
			insertIndex = programBody.findIndex(
				(node: { type: string }) =>
					node.type !== 'ImportDeclaration' &&
					node.type !== 'TypeAlias' &&
					node.type !== 'InterfaceDeclaration',
			);
		}

		programBody.splice(insertIndex, 0, ...cssMapDeclarations);
	}

	// First handle backgroundColor transformation for Box components
	source
		.find(j.JSXAttribute, {
			name: {
				type: 'JSXIdentifier',
				name: 'xcss',
			},
		})
		.forEach((path) => {
			const value = path.node.value;
			if (value && value.type === 'JSXExpressionContainer') {
				const expression = value.expression;
				const parentElement = path.parentPath?.node;
				const isBoxComponent = parentElement?.name?.name === 'Box';

				if (isBoxComponent) {
					if (expression.type === 'Identifier') {
						const styleKey = getCssMapKey(expression.name);
						const styleObject = cssMapProperties.find(
							(prop) => prop.key.type === 'Identifier' && prop.key.name === styleKey,
						)?.value;
						if (styleObject?.type === 'ObjectExpression') {
							const backgroundColorProp = styleObject.properties.find(
								(prop) =>
									prop.type === 'ObjectProperty' &&
									prop.key.type === 'Identifier' &&
									prop.key.name === 'backgroundColor',
							);
							if (
								backgroundColorProp?.type === 'ObjectProperty' &&
								backgroundColorProp.value.type === 'StringLiteral'
							) {
								// add backgroundColor prop to Box component
								parentElement.attributes.push(
									j.jsxAttribute(
										j.jsxIdentifier('backgroundColor'),
										j.stringLiteral(backgroundColorProp.value.value),
									),
								);
								// remove backgroundColor from cssMap
								styleObject.properties = styleObject.properties.filter(
									(prop) =>
										!(
											prop.type === 'ObjectProperty' &&
											prop.key.type === 'Identifier' &&
											prop.key.name === 'backgroundColor'
										),
								);
							}
						}
					} else if (expression.type === 'ArrayExpression') {
						// handle array of styles
						const backgroundColorValues: string[] = [];
						expression.elements.forEach((element) => {
							if (element?.type === 'Identifier') {
								const styleKey = getCssMapKey(element.name);
								const styleObject = cssMapProperties.find(
									(prop) => prop.key.type === 'Identifier' && prop.key.name === styleKey,
								)?.value;
								if (styleObject?.type === 'ObjectExpression') {
									const backgroundColorProp = styleObject.properties.find(
										(prop) =>
											prop.type === 'ObjectProperty' &&
											prop.key.type === 'Identifier' &&
											prop.key.name === 'backgroundColor',
									);
									if (
										backgroundColorProp?.type === 'ObjectProperty' &&
										backgroundColorProp.value.type === 'StringLiteral'
									) {
										backgroundColorValues.push(backgroundColorProp.value.value);
										// remove backgroundColor from cssMap
										styleObject.properties = styleObject.properties.filter(
											(prop) =>
												!(
													prop.type === 'ObjectProperty' &&
													prop.key.type === 'Identifier' &&
													prop.key.name === 'backgroundColor'
												),
										);
									}
								}
							}
						});

						// if we found backgroundColor values, add to Box component
						if (backgroundColorValues.length > 0) {
							if (backgroundColorValues.length === 1) {
								// single backgroundColor value
								parentElement.attributes.push(
									j.jsxAttribute(
										j.jsxIdentifier('backgroundColor'),
										j.stringLiteral(backgroundColorValues[0]),
									),
								);
							} else {
								// multiple backgroundColor values - use ternary for conditional
								const conditions = expression.elements
									.map((element, index) => {
										if (
											element?.type === 'LogicalExpression' &&
											element.left.type === 'Identifier'
										) {
											return `${element.left.name} ? "${backgroundColorValues[index]}" :`;
										}
										return `"${backgroundColorValues[index]}"`;
									})
									.join(' ');
								parentElement.attributes.push(
									j.jsxAttribute(
										j.jsxIdentifier('backgroundColor'),
										j.jsxExpressionContainer(j.identifier(conditions)),
									),
								);
							}
						}
					}
				}
			}
		});

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
					if (styleVariables.has(expression.name)) {
						// <Box xcss={buttonStyles} /> => <Box xcss={styles.button} />
						path.node.value = j.jsxExpressionContainer(
							j.memberExpression(
								j.identifier('styles'),
								j.identifier(getCssMapKey(expression.name)),
							),
						);
					}
				} else if (expression.type === 'ArrayExpression') {
					// <Box xcss={[baseStyles, otherStyles]} /> => <Box xcss={[styles.base, styles.other]} />
					expression.elements.forEach((element) => {
						if (element?.type === 'Identifier' && styleVariables.has(element.name)) {
							const memberExpression = j.memberExpression(
								j.identifier('styles'),
								j.identifier(getCssMapKey(element.name)),
							);
							// Replace the identifier with the member expression
							Object.assign(element, memberExpression);
						} else if (
							// <Box xcss={condition && styles} /> => <Box xcss={condition && styles.root} />
							element?.type === 'LogicalExpression' &&
							element.right.type === 'Identifier' &&
							styleVariables.has(element.right.name)
						) {
							element.right = j.memberExpression(
								j.identifier('styles'),
								j.identifier(getCssMapKey(element.right.name)),
							);
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
	// remove xcss import and collect primitives to import
	const primitivesToImport = new Set<string>();
	source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => {
			const importSource = path.node.source.value as string;
			return (
				importSource === '@atlaskit/primitives' || importSource.startsWith('@atlaskit/primitives/')
			);
		})
		.forEach((path) => {
			if (path.node.specifiers) {
				path.node.specifiers.forEach((specifier) => {
					if (specifier.type === 'ImportSpecifier' && specifier.imported) {
						const importedName = specifier.imported.name;
						if (importedName !== 'xcss') {
							primitivesToImport.add(importedName);
						}
					} else if (specifier.type === 'ImportDefaultSpecifier') {
						// handle deep imports like `import Anchor from '@atlaskit/primitives/anchor'`
						if (specifier.local) {
							primitivesToImport.add(specifier.local.name);
						}
					}
				});
			}
			// remove the import declaration
			j(path).remove();
		});

	const importsNeeded = {
		cssMap: false,
		jsx: false,
		token: false,
	};

	// check existing imports
	source.find(j.ImportDeclaration).forEach((path) => {
		const importSource = path.node.source.value as string;
		switch (importSource) {
			case '@atlaskit/css':
				path.node.specifiers?.forEach((specifier) => {
					if (specifier.local?.name === 'cssMap') {
						importsNeeded.cssMap = true;
					}
					if (specifier.local?.name === 'jsx') {
						importsNeeded.jsx = true;
					}
				});
				break;
			case '@atlaskit/tokens':
				importsNeeded.token = true;
				break;
			case '@emotion/react':
				// remove the jsx import from @emotion/react
				path.node.specifiers = path.node.specifiers?.filter(
					(specifier) => !(j.ImportSpecifier.check(specifier) && specifier.imported.name === 'jsx'),
				);
				if (path.node.specifiers?.length === 0) {
					j(path).remove();
				}
				break;
			case 'react':
				// remove default import React from 'react' if not needed
				path.node.specifiers = path.node.specifiers?.filter(
					(specifier) =>
						!(specifier.type === 'ImportDefaultSpecifier' && specifier.local?.name === 'React'),
				);
				if (path.node.specifiers?.length === 0) {
					j(path).remove();
				}
				break;
		}
	});

	const newImports: ImportDeclaration[] = [];

	// add grouped import for primitives
	// e.g. import { Anchor, Box } from '@atlaskit/primitives/compiled';
	if (primitivesToImport.size > 0) {
		const primitivesImport = j.importDeclaration(
			Array.from(primitivesToImport)
				.sort()
				.map((name) => j.importSpecifier(j.identifier(name))),
			j.literal('@atlaskit/primitives/compiled'),
		);
		newImports.push(primitivesImport);
	}

	// add cssMap and jsx import if needed
	if (!importsNeeded.cssMap || !importsNeeded.jsx) {
		const existingCssImports = source
			.find(j.ImportDeclaration)
			.filter((path) => path.node.source.value === '@atlaskit/css');

		const newSpecifiers: core.ImportSpecifier[] = [];

		if (!importsNeeded.cssMap) {
			newSpecifiers.push(j.importSpecifier(j.identifier('cssMap')));
		}
		if (!importsNeeded.jsx) {
			newSpecifiers.push(j.importSpecifier(j.identifier('jsx')));
		}

		if (existingCssImports.size() > 0) {
			// existing import from '@atlaskit/css'
			const existingCssImport = existingCssImports.at(0).get();

			if (existingCssImport && existingCssImport.node.specifiers) {
				existingCssImport.node.specifiers.push(...newSpecifiers);
			}
		} else {
			const cssMapImport = j.importDeclaration(newSpecifiers, j.literal('@atlaskit/css'));
			newImports.push(cssMapImport);
		}
	}

	// add token import
	if (!importsNeeded.token) {
		let tokenUsed = false;
		// check if token is used in the transformed code
		source
			.find(j.CallExpression, {
				callee: {
					type: 'Identifier',
					name: 'token',
				},
			})
			.forEach(() => {
				tokenUsed = true;
			});

		if (tokenUsed) {
			const tokenImport = j.importDeclaration(
				[j.importSpecifier(j.identifier('token'))],
				j.literal('@atlaskit/tokens'),
			);
			newImports.push(tokenImport);
		}
	}

	// add new imports after any existing comments
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
