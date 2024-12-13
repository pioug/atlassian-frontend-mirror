import type {
	API,
	ASTPath,
	default as core,
	FileInfo,
	ImportDeclaration,
	ImportSpecifier,
	Options,
} from 'jscodeshift';

function getSpecifier(
	j: core.JSCodeshift,
	source: ReturnType<typeof j>,
	specifier: string,
	imported?: string,
) {
	let specifiers;
	if (imported) {
		specifiers = source
			.find(j.ImportDeclaration)
			.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === specifier)
			.find(j.ImportSpecifier)
			.filter((path: ASTPath<ImportSpecifier>) => path.value.imported.name === imported);
	} else {
		specifiers = source
			.find(j.ImportDeclaration)
			.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === specifier)
			.find(j.ImportDefaultSpecifier);
	}

	if (!specifiers.length) {
		return null;
	}

	return specifiers.nodes()[0]!.local!.name;
}

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

function updateSelectProps(j: core.JSCodeshift, source: ReturnType<typeof j>, variant?: string) {
	const specifier = getSpecifier(j, source, '@atlaskit/select', variant);

	if (!specifier) {
		return;
	}

	source.findJSXElements(specifier).forEach((element) => {
		const propsToRemove = [
			'aria-errormessage',
			'aria-live',
			'ariaLiveMessages',
			'captureMenuOnScroll',
			'delimiter',
			'isRTL',
			'menuShouldBlockScroll',
			'screenReaderStatus',
		];

		const propsToReplace = {
			'aria-invalid': 'isInvalid',
			'aria-label': 'label',
			'aria-labelledby': 'labelId',
			disabled: 'isDisabled',
		} as const;

		propsToRemove.forEach((propName) => getJSXAttributesByName(j, element, propName).remove());

		(Object.keys(propsToReplace) as Array<keyof typeof propsToReplace>).forEach((key) =>
			getJSXAttributesByName(j, element, key).forEach((attribute) => {
				j(attribute).find(j.JSXIdentifier).replaceWith(j.jsxIdentifier(propsToReplace[key]));
			}),
		);

		// This needs to switch error to true and remove if default/success are used
		getJSXAttributesByName(j, element, 'validationState').forEach((attribute) => {
			// If validationState is 'default' or 'success' just remove
			j(attribute)
				.filter((attr) => attr.node.value.value.match(/default|success/))
				.remove();

			// If validationState is 'error' replace with isInvalid
			j(attribute)
				.filter((attr) => attr.node.value && attr.node.value.value === 'error')
				.replaceWith(j.jsxAttribute(j.jsxIdentifier('isInvalid')));

			// TODO: In order to complete the deprecation of validationState, we need to clean up custom props name isInvalid
			// j(attribute)
			// 	.find(j.JSXExpressionContainer)
			// 	.filter((container) => {
			// 		return j(container).find(j.BooleanLiteral).length === 0;
			// 	})
			// 	.forEach((container) => {
			// 		j(container).replaceWith(
			// 			j.jsxExpressionContainer(
			// 				// Type 'JSXEmptyExpression' is not assignable to type 'ExpressionKind'.
			// 				// @ts-ignore TS2345
			// 				j.unaryExpression('!', container.node.expression),
			// 			),
			// 		);
			// 	});
		});

		// TODO: Probably need to wait until Select a11y improvements have shipped
		// getJSXAttributesByName(j, element, 'escapeClearsValue').remove();

		// TODO: Need to work out how isRequired is spread from Field
		// getJSXAttributesByName(j, element, 'aria-required').forEach((attribute) => {
		// 	j(attribute).find(j.JSXIdentifier).replaceWith(j.jsxIdentifier('isRequired'));
		// });

		// TODO: Need to work out how isRequired is spread from Field
		// getJSXAttributesByName(j, element, 'required').forEach((attribute) => {
		// 	j(attribute).find(j.JSXIdentifier).replaceWith(j.jsxIdentifier('isRequired'));
		// });
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

	if (hasImportDeclaration(j, source, '@atlaskit/select')) {
		updateSelectProps(j, source);
		[
			'AsyncSelect',
			'CheckboxSelect',
			'CountrySelect',
			'CreatableSelect',
			'PopupSelect',
			'RadioSelect',
		].forEach((variant) => updateSelectProps(j, source, variant));

		return source.toSource(options.printOptions || { quote: 'single' });
	}

	return fileInfo.source;
}
