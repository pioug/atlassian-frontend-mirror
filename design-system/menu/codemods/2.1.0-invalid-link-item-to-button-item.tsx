import type {
	API,
	ASTPath,
	default as core,
	FileInfo,
	ImportDeclaration,
	ImportSpecifier,
	Options,
} from 'jscodeshift';

const invalidHrefValues = ['', '#'];
const pkg = '@atlaskit/menu';

function getJSXAttributesByName(j: core.JSCodeshift, element: ASTPath<any>, attributeName: string) {
	return j(element)
		.find(j.JSXOpeningElement)
		.find(j.JSXAttribute)
		.filter((attribute) => {
			const matches = j(attribute)
				.find(j.JSXIdentifier)
				.filter((identifier) => identifier.value.name === attributeName);
			return Boolean(matches.length);
		});
}

function getImportSpecifier(
	j: core.JSCodeshift,
	source: ReturnType<typeof j>,
	specifier: string,
	imported: string,
) {
	const specifiers = source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === specifier)
		.find(j.ImportSpecifier)
		.filter((path: ASTPath<ImportSpecifier>) => path.value.imported.name === imported);

	if (!specifiers.length) {
		return null;
	}

	return specifiers.nodes()[0]!.local!.name;
}

function convertInvalidLinkItemsToButtonItems(
	j: core.JSCodeshift,
	source: ReturnType<typeof j>,
	specifier: string,
) {
	// For each instance of LinkItem
	source.findJSXElements(specifier).forEach((element) => {
		const hrefPropCollection = getJSXAttributesByName(j, element, 'href');

		// base case: no `href` prop exists, it is invalid
		let validHref = false;

		// if `href` exists
		if (hrefPropCollection.length > 0) {
			const hrefProp = hrefPropCollection.get();

			const hrefStringLiteral = j(hrefProp).find(j.StringLiteral);
			const hrefExpressionContainer = j(hrefProp).find(j.JSXExpressionContainer).find(j.Expression);

			// This is tin foil hattery. Can something be neither a string literal
			// nor an expression container? Don't know but gonna cover that
			if (hrefStringLiteral.length === 0 && hrefExpressionContainer.length === 0) {
				return;
			}

			if (hrefStringLiteral.length > 0) {
				const hrefValue = hrefStringLiteral.get().value.value;
				if (invalidHrefValues.includes(hrefValue)) {
					j(hrefProp).forEach((el) => j(el).remove());
				} else {
					validHref = true;
				}
			} else {
				// It seems foolish to try and resolve variables, so we will assume it
				// is valid
				validHref = true;
			}
		}

		if (!validHref) {
			const pkgImport = source
				.find(j.ImportDeclaration)
				.filter((path) => path.node.source.value === pkg);
			const buttonItemIsImported =
				pkgImport
					.find(j.ImportSpecifier)
					.nodes()
					.filter((node) => node.imported.name === 'ButtonItem').length > 0;
			if (!buttonItemIsImported) {
				// Add ButtonItem to imports
				const newSpecifier = j.importSpecifier(j.identifier('ButtonItem'));
				pkgImport.forEach((moduleImport) => {
					const specifiers = moduleImport.node.specifiers ? [...moduleImport.node.specifiers] : [];
					j(moduleImport).replaceWith(
						j.importDeclaration(specifiers.concat([newSpecifier]), moduleImport.node.source),
					);
				});
			}

			// Replace existing LinkItem with ButtonItem, while maintaining the same props
			if (element.value.openingElement.name.type === 'JSXIdentifier') {
				element.value.openingElement.name.name = 'ButtonItem';
				if (
					element.value.closingElement &&
					element.value.closingElement.name.type === 'JSXIdentifier'
				) {
					element.value.closingElement.name.name = 'ButtonItem';
				}
			}
		}
	});
}

function hasImportDeclaration(
	j: core.JSCodeshift,
	source: ReturnType<typeof j>,
	importPath: string,
) {
	return !!source.find(j.ImportDeclaration).filter((path) => path.node.source.value === importPath)
		.length;
}

export default function transformer(fileInfo: FileInfo, { jscodeshift: j }: API, options: Options) {
	const source = j(fileInfo.source);

	if (hasImportDeclaration(j, source, pkg)) {
		const importSpecifier = getImportSpecifier(j, source, pkg, 'LinkItem');

		if (importSpecifier != null) {
			convertInvalidLinkItemsToButtonItems(j, source, importSpecifier);
		}

		return source.toSource(
			options.printOptions || {
				quote: 'single',
				trailingComma: true,
			},
		);
	}

	return fileInfo.source;
}
