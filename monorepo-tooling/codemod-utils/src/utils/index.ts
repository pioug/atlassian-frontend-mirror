import type {
	API,
	ASTPath,
	Collection,
	default as core,
	FileInfo,
	ImportDeclaration,
	ImportDefaultSpecifier,
	ImportSpecifier,
	JSXElement,
	ObjectExpression,
	Options,
} from 'jscodeshift';

import {
	addCommentToStartOfFile,
	addToImport,
	getDefaultSpecifier,
	getJSXAttributesByName,
	getNamedSpecifier,
	getSafeImportName,
	tryCreateImport,
} from './support';

const createRemoveFuncFor =
	(
		component: string,
		importName: string,
		prop: string,
		predicate: (j: core.JSCodeshift, element: ASTPath<any>) => boolean = () => true,
		comment?: string,
	) =>
	(j: core.JSCodeshift, source: Collection<Node>): void => {
		const specifier = getNamedSpecifier(j, source, component, importName);

		if (!specifier) {
			return;
		}

		source.findJSXElements(specifier).forEach((element) => {
			if (predicate(j, element) && comment) {
				addCommentToStartOfFile({ j, base: source, message: comment });
			} else {
				getJSXAttributesByName(j, element, prop).forEach((attribute: any) => {
					j(attribute).remove();
				});
			}
		});
	};

const createRenameFuncFor =
	(component: string, from: string, to: string) =>
	(j: core.JSCodeshift, source: Collection<Node>): void => {
		const defaultSpecifier = getDefaultSpecifier(j, source, component);

		if (!defaultSpecifier) {
			return;
		}

		source.findJSXElements(defaultSpecifier).forEach((element: ASTPath<JSXElement>) => {
			getJSXAttributesByName(j, element, from).forEach((attribute: any) => {
				j(attribute).replaceWith(j.jsxAttribute(j.jsxIdentifier(to), attribute.node.value));
			});
		});
	};

const createConvertFuncFor =
	(component: string, from: string, to: string, predicate?: (value: any) => boolean) =>
	(j: core.JSCodeshift, source: Collection<Node>): void => {
		const defaultSpecifier = getDefaultSpecifier(j, source, component);

		if (!defaultSpecifier) {
			return;
		}

		source.findJSXElements(defaultSpecifier).forEach((element: ASTPath<JSXElement>) => {
			getJSXAttributesByName(j, element, from).forEach((attribute: any) => {
				const shouldConvert = (predicate && predicate(attribute.node.value)) || false;
				const node = j.jsxAttribute(j.jsxIdentifier(to));
				if (shouldConvert) {
					j(attribute).insertBefore(node);
				}
			});
		});
	};

const replaceImportStatementFor =
	(pkg: string, convertMap: any) =>
	(j: core.JSCodeshift, root: Collection<Node>): void => {
		root
			.find(j.ImportDeclaration)
			.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === pkg)
			.forEach((path: ASTPath<ImportDeclaration>) => {
				const defaultSpecifier = (path.value.specifiers || []).filter(
					(specifier) => specifier.type === 'ImportDefaultSpecifier',
				);

				const defaultDeclarations = defaultSpecifier.map((s) => {
					return j.importDeclaration([s], j.literal(convertMap['default']));
				});

				const otherSpecifier = (path.value.specifiers || []).filter(
					(specifier) => specifier.type === 'ImportSpecifier',
				);

				j(path).replaceWith(defaultDeclarations);

				const otherDeclarations = otherSpecifier.map((s) => {
					const localName = s.local!.name;
					if (convertMap[localName]) {
						return j.importDeclaration(
							[j.importDefaultSpecifier(j.identifier(localName))],
							j.literal(convertMap[localName]),
						);
					} else {
						return j.importDeclaration(
							[j.importDefaultSpecifier(j.identifier(localName))],
							j.literal(convertMap['*']),
						);
					}
				});

				j(path).insertAfter(otherDeclarations);
			});
	};

const createRenameImportFor =
	(component: string, _: string, to: string) =>
	(j: core.JSCodeshift, source: Collection<Node>): void => {
		source
			.find(j.ImportDeclaration)
			.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === component)
			.forEach((path: ASTPath<ImportDeclaration>) => {
				j(path).replaceWith(j.importDeclaration(path.value.specifiers, j.literal(to)));
			});
	};

const createTransformer =
	(
		migrates: { (j: core.JSCodeshift, source: Collection<Node>): void }[],
		shouldApplyTransform?: (j: core.JSCodeshift, source: Collection<Node>) => boolean,
	) =>
	(fileInfo: FileInfo, { jscodeshift: j }: API, options: Options): string => {
		const source = j(fileInfo.source);

		// If shouldApplyTransform not provided then perform old behaviour
		if (!shouldApplyTransform || shouldApplyTransform(j, source)) {
			migrates.forEach((tf) => tf(j, source));

			return source.toSource(options.printOptions);
		}

		return fileInfo.source;
	};

const elevateComponentToNewEntryPoint =
	(pkg: string, toPkg: string, innerElementName: string) =>
	(j: core.JSCodeshift, root: any): void => {
		const importDeclarations = root
			.find(j.ImportDeclaration)
			.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === pkg);

		const defaultSpecifier = importDeclarations.find(j.ImportDefaultSpecifier).nodes();
		const otherSpecifier = importDeclarations.find(j.ImportSpecifier).nodes();

		const newDefaultSpecifier = defaultSpecifier.map((s: ImportDefaultSpecifier) => {
			return j.importDeclaration([j.importDefaultSpecifier(s.local)], j.literal(pkg));
		});

		const newOtherSpecifiers = otherSpecifier.map((s: ImportSpecifier) => {
			if (s.imported.name === innerElementName) {
				return j.importDeclaration([j.importDefaultSpecifier(s.local)], j.literal(toPkg));
			} else {
				return j.importDeclaration([s], j.literal(pkg));
			}
		});

		importDeclarations.forEach((path: ASTPath<ImportDeclaration>) => {
			j(path).replaceWith(newDefaultSpecifier);
			j(path).insertBefore(newOtherSpecifiers);
		});
	};

const flattenCertainChildPropsAsProp =
	(component: string, propName: string, childProps: string[]) =>
	(j: core.JSCodeshift, source: Collection<Node>): void => {
		const defaultSpecifier = getDefaultSpecifier(j, source, component);
		if (!defaultSpecifier) {
			return;
		}
		source.findJSXElements(defaultSpecifier).forEach((element) => {
			getJSXAttributesByName(j, element, propName).forEach((attribute) => {
				j(attribute)
					.find(j.JSXExpressionContainer)
					.find(j.ObjectExpression)
					.forEach((objectExpression) => {
						objectExpression.node.properties.forEach((property) => {
							childProps.forEach((childProp) => {
								if (
									(property.type === 'Property' || property.type === 'ObjectProperty') &&
									property.key.type === 'Identifier' &&
									property.key.name === childProp
								) {
									element.node.openingElement.attributes?.push(
										j.jsxAttribute(
											j.jsxIdentifier(childProp),
											j.jsxExpressionContainer(property.value as ObjectExpression),
										),
									);
								}
							});
						});
					});
			});
		});
	};

const createRenameJSXFunc =
	(packagePath: string, from: string, to: string, fallback: string | undefined = undefined) =>
	(j: core.JSCodeshift, source: any): void => {
		const namedSpecifier = getNamedSpecifier(j, source, packagePath, from);

		const toName = fallback
			? getSafeImportName({
					j,
					base: source,
					currentDefaultSpecifierName: namedSpecifier,
					desiredName: to,
					fallbackName: fallback,
				})
			: to;

		const existingAlias: Nullable<string> =
			source
				.find(j.ImportDeclaration)
				.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === packagePath)
				.find(j.ImportSpecifier)
				.nodes()
				.map((specifier: ImportSpecifier): Nullable<string> => {
					if (from !== specifier.imported.name) {
						return null;
					}
					// If aliased: return the alias
					if (specifier.local && from !== specifier.local.name) {
						return specifier.local.name;
					}

					return null;
				})
				.filter(Boolean)[0] || null;

		source
			.find(j.ImportDeclaration)
			.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === packagePath)
			.find(j.ImportSpecifier)
			.filter((importSpecifier: ImportSpecifier) => {
				const identifier = j(importSpecifier).find(j.Identifier).get();
				if (from === identifier.value.name || existingAlias === identifier.value.name) {
					return true;
				}
				return false;
			})
			.replaceWith(
				[
					j.importSpecifier(
						j.identifier(toName),
						existingAlias ? j.identifier(existingAlias) : null,
					),
				],
				j.literal(packagePath),
			);
	};

const createRemoveFuncAddCommentFor =
	(component: string, prop: string, comment?: string) =>
	(j: core.JSCodeshift, source: Collection<Node>): void => {
		const defaultSpecifier = getDefaultSpecifier(j, source, component);

		if (!defaultSpecifier) {
			return;
		}

		source.findJSXElements(defaultSpecifier).forEach((element) => {
			getJSXAttributesByName(j, element, prop).forEach((attribute) => {
				j(attribute).remove();
				if (comment) {
					addCommentToStartOfFile({ j, base: source, message: comment });
				}
			});
		});
	};

const renameNamedImportWithAliasName =
	(component: string, from: string, to: string) =>
	(j: core.JSCodeshift, source: Collection<Node>): void => {
		source
			.find(j.ImportDeclaration)
			.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === component)
			.find(j.ImportSpecifier)
			.filter((path: ASTPath<ImportSpecifier>) => path.node.imported.name === from)
			.forEach((path: ASTPath<ImportSpecifier>) => {
				const localName = path.node.local!.name;
				j(path).replaceWith(j.importSpecifier(j.identifier(to), j.identifier(localName)));
			});
	};

const changeImportEntryPoint =
	(
		oldPackageName: string,
		importToConvert: string,
		newPackageName: string,
		shouldBeTypeImport?: boolean,
	) =>
	(j: core.JSCodeshift, root: Collection<Node>): void => {
		root
			.find(j.ImportDeclaration, {
				source: {
					value: oldPackageName,
				},
			})
			.forEach((path) => {
				const currentImportSpecifier = (path.value.specifiers || []).find((specifier) => {
					if (specifier.type === 'ImportSpecifier') {
						return specifier.imported.name === importToConvert;
					}
					return false;
				}) as ImportSpecifier | undefined;
				if (!currentImportSpecifier) {
					return;
				}
				const importedSpecifierName = currentImportSpecifier.imported.name;
				const localSpecifierName = currentImportSpecifier.local?.name;
				const newIdentifier = j.importSpecifier(
					j.identifier(importedSpecifierName),
					localSpecifierName ? j.identifier(localSpecifierName) : undefined,
				);

				// check if new import exists, if not create it
				tryCreateImport(j, root, oldPackageName, newPackageName, shouldBeTypeImport);

				// remove the old import specifier, but NOT the whole package
				root
					.find(j.ImportDeclaration, {
						source: {
							value: oldPackageName,
						},
					})
					.find(j.ImportSpecifier)
					.filter((path) => path.value.imported.name === importToConvert)
					.remove();

				// adds import specifier to new import
				addToImport(j, root, newIdentifier, newPackageName);

				// if there are any imports with no specifiers, remove the whole import
				root
					.find(j.ImportDeclaration, {
						source: {
							value: oldPackageName,
						},
					})
					.filter((path) => !path.value.specifiers?.length)
					.remove();
			});
	};

export {
	createRenameFuncFor,
	createConvertFuncFor,
	createRenameImportFor,
	createRemoveFuncFor,
	replaceImportStatementFor,
	elevateComponentToNewEntryPoint,
	createTransformer,
	renameNamedImportWithAliasName,
	flattenCertainChildPropsAsProp,
	createRenameJSXFunc,
	createRemoveFuncAddCommentFor,
	changeImportEntryPoint,
};
