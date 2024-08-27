import { type API, type FileInfo, type JSCodeshift, type Options } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import {
	addJSXAttributeToJSXElement,
	getImportDeclarationCollection,
	getImportSpecifierCollection,
	getImportSpecifierName,
	getJSXAttributeByName,
	getJSXAttributesByName,
	hasImportDeclaration,
	removeJSXAttributeByName,
	removeJSXAttributeObjectPropertyByName,
} from './utils/helpers';

type ToPickerFormula = {
	oldPropName: string;
	destination: string[];
};

type FromPickerFormula = {
	source: string[];
	newPropName: string;
};

const importPath = '@atlaskit/datetime-picker';

const dateTimePickerImportName = 'DateTimePicker';
export const datePickerImportName = 'DatePicker';
export const timePickerImportName = 'TimePicker';

const pickerAndSelectPropNames = [
	['datePickerSelectProps', 'datePickerProps'],
	['timePickerSelectProps', 'timePickerProps'],
];

export const dtpPropsToMoveIntoPickerProps: ToPickerFormula[] = [
	{
		oldPropName: 'dateFormat',
		destination: ['datePickerProps', 'dateFormat'],
	},
	{
		oldPropName: 'times',
		destination: ['timePickerProps', 'times'],
	},
	{
		oldPropName: 'timeFormat',
		destination: ['timePickerProps', 'timeFormat'],
	},
	{
		oldPropName: 'timeIsEditable',
		destination: ['timePickerProps', 'timeIsEditable'],
	},
];

// For the pickers, not for DTP
export const selectPropsToMoveIntoProps: FromPickerFormula[] = [
	{
		source: ['selectProps', 'aria-describedby'],
		newPropName: 'aria-describedby',
	},
	{
		source: ['selectProps', 'aria-label'],
		newPropName: 'label',
	},
	{
		source: ['selectProps', 'inputId'],
		newPropName: 'id',
	},
	{
		source: ['selectProps', 'placeholder'],
		newPropName: 'placeholder',
	},
];

/**
 * Move *pickerSelectProps into their respectice *pickerProps as a property
 * named `selectProps`.
 */
function moveDateTimePickerSelectProps(j: JSCodeshift, collection: Collection<any>) {
	const importDeclarationCollection = getImportDeclarationCollection(j, collection, importPath);
	const importSpecifierCollection = getImportSpecifierCollection(
		j,
		importDeclarationCollection,
		dateTimePickerImportName,
	);
	const importSpecifierName = getImportSpecifierName(importSpecifierCollection);

	// If our component is not present, quit early
	if (importSpecifierName === null) {
		return;
	}

	collection.findJSXElements(dateTimePickerImportName).forEach((jsxElementPath) => {
		// For each picker,
		pickerAndSelectPropNames.forEach((migration) => {
			const [selectPropsName, pickerPropsName] = migration;

			const datePickerPropsAttr = getJSXAttributeByName(j, jsxElementPath, pickerPropsName);
			const datePickerSelectPropsAttr = getJSXAttributeByName(j, jsxElementPath, selectPropsName);

			// If there are both the *selectProps and the *pickerProps,
			if (datePickerPropsAttr && datePickerSelectPropsAttr) {
				// Get the select props value
				// @ts-ignore -- Property 'expression' does not exist on type 'LiteralKind | JSXElement | JSXExpressionContainer | JSXFragment'. Property 'expression' does not exist on type 'Literal'.
				let datePickerSelectPropsExpression = datePickerSelectPropsAttr?.value?.expression;
				let datePickerSelectProps;

				if (datePickerSelectPropsExpression?.properties) {
					datePickerSelectProps = j.objectExpression(datePickerSelectPropsExpression.properties);
				} else if (datePickerSelectPropsExpression) {
					datePickerSelectProps = datePickerSelectPropsExpression;
				} else {
					// This is nothing we can use, so skip
					return;
				}

				// This property definitely exists! Just can't figure out how to type properly. Please forgive me.
				// @ts-ignore -- Property 'expression' does not exist on type 'LiteralKind | JSXElement | JSXExpressionContainer | JSXFragment'. Property 'expression' does not exist on type 'Literal'.
				const datePickerProps = datePickerPropsAttr.value?.expression.properties;
				// Make a new selectProps property that will go inside the *pickerProps
				const selectPropsProperty = j.property(
					'init',
					j.identifier('selectProps'),
					datePickerSelectProps,
				);

				// Add this to the component
				datePickerProps.push(selectPropsProperty);
				// If there is not a *pickerProps prop
			} else if (datePickerSelectPropsAttr) {
				// Create one and put the selectProps inside of it
				const newAttr = j.jsxAttribute(
					j.jsxIdentifier(pickerPropsName),
					j.jsxExpressionContainer(
						j.objectExpression([
							j.property(
								'init',
								j.identifier('selectProps'),
								// @ts-ignore -- Property 'expression' does not exist on type 'LiteralKind | JSXElement | JSXExpressionContainer | JSXFragment'. Property 'expression' does not exist on type 'Literal'.
								datePickerSelectPropsAttr.value.expression,
							),
						]),
					),
				);
				addJSXAttributeToJSXElement(j, jsxElementPath, newAttr);
			}

			// Remove the *selectProps attribute
			removeJSXAttributeByName(j, jsxElementPath, selectPropsName);
		});
	});
}

/**
 * Move props out of the *pickerProps into their respective top-level props.
 */
function moveDateTimePickerSelectPropsToPickerProps(
	j: JSCodeshift,
	collection: Collection<any>,
	formulas: FromPickerFormula[],
) {
	const importDeclarationCollection = getImportDeclarationCollection(j, collection, importPath);
	const importSpecifierCollection = getImportSpecifierCollection(
		j,
		importDeclarationCollection,
		dateTimePickerImportName,
	);
	const importSpecifierName = getImportSpecifierName(importSpecifierCollection);

	// If we can't find our import specifier, exit early
	if (importSpecifierName === null) {
		return;
	}

	// For each component,
	collection.findJSXElements(dateTimePickerImportName).forEach((jsxElementPath) => {
		pickerAndSelectPropNames.forEach((migration) => {
			const pickerPropsName = migration[1];
			// For each picker prop to move into the top level,
			formulas.forEach((formula) => {
				const { source, newPropName: newPropertyName } = formula;
				const [selectPropsName, oldPropertyName] = source;

				// Get the relevant *picker props where the source prop is found
				const pickerPropsAttr = getJSXAttributeByName(j, jsxElementPath, pickerPropsName);

				// If no *picker props, return early since there's nothing to do
				if (!pickerPropsAttr) {
					return;
				}

				// @ts-ignore -- Property 'expression' does not exist on type 'LiteralKind | JSXElement | JSXExpressionContainer | JSXFragment'. Property 'expression' does not exist on type 'Literal'.
				const pickerPropsProperties = pickerPropsAttr.value?.expression.properties;
				const existingNewProperty = pickerPropsProperties.find(
					(property: any) => (property.key?.name || property.key?.value) === newPropertyName,
				);

				// If the new property we're migrating to exists, leave it alone so that
				// manual remediation can be done. Both shouldn't exist, anyway.
				if (existingNewProperty) {
					return;
				}

				// Get the selectProps property
				const selectPropsProperty = pickerPropsProperties.find(
					(property: any) => (property.key?.name || property.key?.value) === selectPropsName,
				);

				// If no *picker.selectProps, return early since there's nothing to do
				if (!selectPropsProperty) {
					return;
				}

				const selectPropsProperties = selectPropsProperty.value?.properties;

				// If selectProps has no properties, quit early
				if (!selectPropsProperties) {
					return;
				}

				// Get old property's node
				const oldProp = selectPropsProperties.find((prop: any) => {
					return prop.key && (prop.key.name || prop.key.value) === oldPropertyName;
				});

				// If the old property does not exist within the *pickerProps, return early
				if (!oldProp) {
					return;
				}

				// Add the new attribute to the component
				const newProp = j.objectProperty(j.jsxIdentifier(`"${newPropertyName}"`), oldProp.value);
				pickerPropsProperties.push(newProp);

				// Remove the old object property
				selectPropsProperties.splice(selectPropsProperties.indexOf(oldProp), 1);

				if (selectPropsProperties.length === 0) {
					pickerPropsProperties.splice(pickerPropsProperties.indexOf(selectPropsProperty), 1);
				}
			});
		});
	});
}

/**
 * Move props out of the *pickerProps into their respective top-level props.
 */
function moveSelectPropsToTop(
	j: JSCodeshift,
	collection: Collection<any>,
	formulas: FromPickerFormula[],
) {
	const importDeclarationCollection = getImportDeclarationCollection(j, collection, importPath);
	[datePickerImportName, timePickerImportName].forEach((pickerImportName) => {
		const importSpecifierCollection = getImportSpecifierCollection(
			j,
			importDeclarationCollection,
			pickerImportName,
		);
		const importSpecifierName = getImportSpecifierName(importSpecifierCollection);

		// If we can't find our import specifier, exit early
		if (importSpecifierName === null) {
			return;
		}

		// For each component,
		collection.findJSXElements(pickerImportName).forEach((jsxElementPath) => {
			// For each picker prop to move into the top level,
			formulas.forEach((formula) => {
				const { source, newPropName } = formula;
				const [selectPropsName, oldPropertyName] = source;

				// Get the relevant *picker props where the source prop is found
				const selectProps = getJSXAttributeByName(j, jsxElementPath, selectPropsName);

				// If no date picker props, return early since there's nothing to do
				if (!selectProps) {
					return;
				}

				// If the new prop we're migrating to exists, leave it alone so that
				// manual remediation can be done. Both shouldn't exist, anyway.
				const existingNewPropAttr = getJSXAttributeByName(j, jsxElementPath, newPropName);
				if (existingNewPropAttr) {
					return;
				}

				// @ts-ignore -- Property 'expression' does not exist on type 'LiteralKind | JSXElement | JSXExpressionContainer | JSXFragment'. Property 'expression' does not exist on type 'Literal'.
				let selectPropProperties = selectProps.value?.expression.properties;

				// If the new prop does not yet exist and we have *pickerProps,
				if (selectPropProperties) {
					// Get old property's node
					const oldProp = selectPropProperties.find((prop: any) => {
						return prop.key && (prop.key.name || prop.key.value) === oldPropertyName;
					});

					// If the old property does exist within the *pickerProps,
					if (oldProp) {
						const newValue = oldProp.value.value
							? j.literal(oldProp.value.value)
							: j.jsxExpressionContainer(oldProp.value);
						// Add the new attribute to the component
						const newProp = j.jsxAttribute(j.jsxIdentifier(newPropName), newValue);
						addJSXAttributeToJSXElement(j, jsxElementPath, newProp);
					}
				}

				// Remove the old object property
				removeJSXAttributeObjectPropertyByName(j, jsxElementPath, selectPropsName, oldPropertyName);
			});
		});
	});
}

function moveDateTimePickerProps(
	j: JSCodeshift,
	collection: Collection<any>,
	formulas: ToPickerFormula[],
) {
	const importDeclarationCollection = getImportDeclarationCollection(j, collection, importPath);
	const importSpecifierCollection = getImportSpecifierCollection(
		j,
		importDeclarationCollection,
		dateTimePickerImportName,
	);
	const importSpecifierName = getImportSpecifierName(importSpecifierCollection);

	// If we can't find our component, quit early
	if (importSpecifierName === null) {
		return;
	}

	// For each datetime picker import,
	collection.findJSXElements(dateTimePickerImportName).forEach((jsxElementPath) => {
		formulas.forEach((formula) => {
			const { oldPropName, destination } = formula;
			const [pickerPropsName, propertyName] = destination;

			const attributes = j(jsxElementPath).find(j.JSXAttribute).nodes();

			// Find the old prop
			const oldPropAttr = attributes?.find(
				(attr) => (attr.name?.name || attr.name) === oldPropName,
			);
			// Find the *pickerProps prop if it exists
			const datePickerPickerPropsAttr = attributes?.find(
				(attr) => attr.name && attr.name.name === pickerPropsName,
			);

			// Boolean attributes have `null` value
			if (!oldPropAttr || oldPropAttr.value === undefined) {
				return;
			}

			// Create one and put the old value inside of it
			let newValue = oldPropAttr.value;

			// Remove surrounding brackets when placed in object
			if (newValue === null) {
				newValue = j.booleanLiteral(true);
			} else if (newValue?.type === 'JSXExpressionContainer') {
				// @ts-ignore Type 'JSXEmptyExpression | ExpressionKind' is not assignable to type 'LiteralKind | JSXElement | JSXExpressionContainer | JSXFragment'.  Type 'Identifier' is not assignable to type 'LiteralKind | JSXElement | JSXExpressionContainer | JSXFragment'.  Property 'openingElement' is missing in type 'Identifier' but required in type 'JSXElement'.
				newValue = newValue.expression;
				// If boolean attribute without explicit value, make it `true`
			}

			// Just type guarding for TS
			if (!newValue) {
				return;
			}

			if (datePickerPickerPropsAttr) {
				// @ts-ignore -- Property 'expression' does not exist on type 'LiteralKind | JSXElement | JSXExpressionContainer | JSXFragment'. Property 'expression' does not exist on type 'Literal'.
				const pickerPropsObj = datePickerPickerPropsAttr.value?.expression.properties;

				// Create a new *pickerProps property and put the old prop inside of it
				// as an object property
				const newPickerProperty = j.property('init', j.identifier(propertyName), newValue);

				// Add this new property to the existing one
				pickerPropsObj.push(newPickerProperty);
				// Remove the old one
				attributes?.splice(attributes.indexOf(datePickerPickerPropsAttr), 1);

				// If there is no *pickerProps,
			} else {
				const newProp = j.jsxAttribute(
					j.jsxIdentifier(pickerPropsName),
					j.jsxExpressionContainer(
						// Adding `true` for boolean attributes that have no value;
						// This definitely exists on here. Can't coerce right. May god have mercy on my soul for this ts-ignore.
						// @ts-ignore Argument of type 'LiteralKind | JSXElement | JSXExpressionContainer | JSXFragment | null | undefined' is not assignable to parameter of type 'Literal | JSXText | StringLiteral | NumericLiteral | BigIntLiteral | NullLiteral | BooleanLiteral | ... 53 more ... | TSParameterProperty'. Type 'undefined' is not assignable to type 'Literal | JSXText | StringLiteral | NumericLiteral | BigIntLiteral | NullLiteral | BooleanLiteral | ... 53 more ... | TSParameterProperty'.
						j.objectExpression([j.property('init', j.identifier(propertyName), newValue)]),
					),
				);
				addJSXAttributeToJSXElement(j, jsxElementPath, newProp);
			}

			// Get the old prop we're migrating from
			getJSXAttributesByName(j, jsxElementPath, oldPropName).forEach((jsxAttribute) => {
				// Remove the original old prop we're migrating from
				j(jsxAttribute).remove();
			});
		});
	});
}

export default function transformer(fileInfo: FileInfo, { jscodeshift: j }: API, options: Options) {
	const { source } = fileInfo;
	const collection = j(source);

	// If our component is not here, skip the file
	if (!hasImportDeclaration(j, collection, importPath)) {
		return source;
	}

	// Move specific DTP props into *pickerProps
	moveDateTimePickerProps(j, collection, dtpPropsToMoveIntoPickerProps);
	// Move all *selectProps into the related *pickerProps.selectProps
	moveDateTimePickerSelectProps(j, collection);
	// Move all relevant *selectProps to *pickerProps
	moveDateTimePickerSelectPropsToPickerProps(j, collection, selectPropsToMoveIntoProps);

	// Move specific *pickerProps entries into top level
	moveSelectPropsToTop(j, collection, selectPropsToMoveIntoProps);

	return collection.toSource(options.printOptions || { quote: 'single' });
}
