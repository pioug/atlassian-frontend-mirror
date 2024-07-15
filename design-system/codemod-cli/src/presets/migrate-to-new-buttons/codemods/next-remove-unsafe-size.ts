import { type API, type FileInfo } from 'jscodeshift';
import { getImportDeclaration, hasJSXAttributes } from '@hypermod/utils';

import { PRINT_SETTINGS, NEW_BUTTON_ENTRY_POINT, UNSAFE_SIZE_PROPS_MAP } from '../utils/constants';

function transformer(file: FileInfo, api: API) {
	const j = api.jscodeshift;
	const source = j(file.source);

	// Find all new button imports
	const newButtonImportDeclarations = getImportDeclaration(j, source, NEW_BUTTON_ENTRY_POINT);

	// No imports for new button found, exit early
	if (!newButtonImportDeclarations.length) {
		return source.toSource();
	}

	// Get all the specifyier names
	// eg ['Button', 'IconButton', 'LinkButton', 'LinkIconButton']
	const newButtonSpecifiers: string[] = [];
	newButtonImportDeclarations.forEach((newButtonImport) => {
		if (!newButtonImport.value.specifiers) {
			return;
		}
		newButtonImport.value.specifiers.map((specifier) => {
			if (specifier.local && specifier.local.name) {
				newButtonSpecifiers.push(specifier.local.name);
			}
		});
	});

	// Find all new button JSX elements with an UNSAFE size prop
	const newButtonJXSElements = source
		.find(j.JSXElement)
		// is a new button?
		.filter(
			(path) =>
				path.value.openingElement.name.type === 'JSXIdentifier' &&
				newButtonSpecifiers.includes(path.value.openingElement.name.name),
		)
		// has an usafe size prop?
		.filter((path) =>
			Object.keys(UNSAFE_SIZE_PROPS_MAP).some((unsafeSizeProp) =>
				hasJSXAttributes(j, path, unsafeSizeProp),
			),
		);

	newButtonJXSElements.forEach((newButtonJXSElement) => {
		for (const unsafeSizeProp in UNSAFE_SIZE_PROPS_MAP) {
			const iconProp = UNSAFE_SIZE_PROPS_MAP[unsafeSizeProp];

			// Get all icon attributes
			// eg. ['iconBefore', 'iconAfter', 'icon']
			const iconAttributes = newButtonJXSElement.value.openingElement.attributes?.filter(
				(attribute) => attribute.type === 'JSXAttribute' && attribute.name.name === iconProp,
			);

			if (!iconAttributes) {
				return;
			}

			// Check if render prop or bounded API
			iconAttributes.forEach((iconAttribute) => {
				const unsafeSizeAttribute = newButtonJXSElement.value.openingElement.attributes?.find(
					(attribute) =>
						attribute.type === 'JSXAttribute' && attribute.name.name === unsafeSizeProp,
				);

				if (
					iconAttribute.type !== 'JSXAttribute' ||
					iconAttribute.value?.type !== 'JSXExpressionContainer' ||
					!unsafeSizeAttribute ||
					unsafeSizeAttribute.type !== 'JSXAttribute'
				) {
					return;
				}

				const safeSizeAttribute = j.jsxAttribute.from({
					name: j.jsxIdentifier('size'),
					value: unsafeSizeAttribute.value,
				});

				switch (iconAttribute.value.expression.type) {
					// We have a render prop, move the UNSAFE prop to the render prop
					case 'ArrowFunctionExpression':
						// Prefer existing size on icon over UNSAFE size on button
						if (
							iconAttribute.value.expression.body.type === 'JSXElement' &&
							!iconAttribute.value.expression.body.openingElement.attributes?.some(
								(attribute) => attribute.type === 'JSXAttribute' && attribute.name.name === 'size',
							)
						) {
							iconAttribute.value.expression.body.openingElement.attributes?.push(
								safeSizeAttribute,
							);
						}
						break;

					// We have a bounded API, move to render prop
					case 'Identifier':
						const iconName = iconAttribute.value.expression.name;

						// Create new arrow function (renderProp)
						iconAttribute.value = j.jsxExpressionContainer(
							j.arrowFunctionExpression.from({
								params: [j.identifier('iconProps')],
								body: j.jsxElement.from({
									openingElement: j.jsxOpeningElement.from({
										name: j.jsxIdentifier(iconName),
										selfClosing: true,
										attributes: [
											j.jsxSpreadAttribute.from({
												argument: j.identifier('iconProps'),
											}),
											safeSizeAttribute,
										],
									}),
								}),
							}),
						);
						break;
				}

				// Remove the UNSAFE icon attribute
				j(newButtonJXSElement.value.openingElement)
					.find(j.JSXAttribute)
					.filter((attribute) => attribute.value.name.name === unsafeSizeProp)
					.remove();
			});
		}
	});

	return source.toSource(PRINT_SETTINGS);
}

export default transformer;
