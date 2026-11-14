import {
	type API,
	type FileInfo,
	type JSCodeshift,
	type Node,
	type ObjectExpression,
	type Options,
} from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

const PACKAGE = '@atlaskit/datetime-picker';
const DATE_PICKER_PATH = `${PACKAGE}/date-picker`;
const DATE_TIME_PICKER_PATH = `${PACKAGE}/date-time-picker`;
const PROP = 'shouldShowCalendarButton';

function stringField(node: unknown, field: 'type' | 'name' | 'value'): string | undefined {
	const value = (node as Partial<Record<typeof field, unknown>> | null | undefined)?.[field];
	return typeof value === 'string' ? value : undefined;
}

function isUndefinedIdentifier(node: unknown): boolean {
	return stringField(node, 'type') === 'Identifier' && stringField(node, 'name') === 'undefined';
}

function importedPickerNames(j: JSCodeshift, collection: Collection<Node>) {
	const datePickers = new Set<string>();
	const dateTimePickers = new Set<string>();

	collection.find(j.ImportDeclaration).forEach((path) => {
		const importPath = path.node.source.value;
		for (const specifier of path.node.specifiers ?? []) {
			if (importPath === PACKAGE && specifier.type === 'ImportSpecifier') {
				const importedName = stringField(specifier.imported, 'name');
				const localName = stringField(specifier.local, 'name') ?? importedName;
				if (!importedName || !localName) continue;
				if (importedName === 'DatePicker') datePickers.add(localName);
				if (importedName === 'DateTimePicker') dateTimePickers.add(localName);
			}
			if (specifier.type !== 'ImportDefaultSpecifier') continue;
			const defaultName = stringField(specifier.local, 'name');
			if (!defaultName) continue;
			if (importPath === DATE_PICKER_PATH) datePickers.add(defaultName);
			if (importPath === DATE_TIME_PICKER_PATH) dateTimePickers.add(defaultName);
		}
	});

	return { datePickers, dateTimePickers };
}

type ObjectExpressionProperty = NonNullable<ObjectExpression['properties']>[number];

function hasProperty(properties: ObjectExpressionProperty[], name: string) {
	return properties.some(
		(property) =>
			(property.type === 'Property' || property.type === 'ObjectProperty') &&
			(stringField(property.key, 'name') === name || stringField(property.key, 'value') === name),
	);
}

export default function transformer(
	fileInfo: FileInfo,
	{ jscodeshift: j }: API,
	options: Options,
): string {
	const collection = j(fileInfo.source);
	const { datePickers, dateTimePickers } = importedPickerNames(j, collection);
	let changed = false;

	collection.find(j.JSXOpeningElement).forEach((path) => {
		if (path.node.name.type !== 'JSXIdentifier') return;
		const attributes = path.node.attributes;
		if (!attributes) return;

		const name = path.node.name.name;

		const hasSpread = attributes.some((attribute) => attribute.type === 'JSXSpreadAttribute');

		if (datePickers.has(name)) {
			const calendarButtonAttribute = attributes.find(
				(attribute) => attribute.type === 'JSXAttribute' && attribute.name.name === PROP,
			);
			if (!calendarButtonAttribute) {
				const calendarButtonAttribute = j.jsxAttribute(
					j.jsxIdentifier(PROP),
					j.jsxExpressionContainer(j.booleanLiteral(false)),
				);

				if (hasSpread) return;
				attributes.push(calendarButtonAttribute);

				changed = true;
			} else if (
				calendarButtonAttribute.type === 'JSXAttribute' &&
				calendarButtonAttribute.value?.type === 'JSXExpressionContainer' &&
				isUndefinedIdentifier(calendarButtonAttribute.value.expression)
			) {
				if (hasSpread) return;
				calendarButtonAttribute.value = j.jsxExpressionContainer(j.booleanLiteral(false));
				changed = true;
			}
			return;
		}

		if (!dateTimePickers.has(name)) return;
		const datePickerProps = attributes.find(
			(attribute) => attribute.type === 'JSXAttribute' && attribute.name.name === 'datePickerProps',
		);
		if (!datePickerProps) {
			const hasDatePickerPropsSpread = attributes.some((attribute) => {
				if (attribute.type !== 'JSXSpreadAttribute') return false;
				if (attribute.argument.type !== 'ObjectExpression') return true;

				return hasProperty(
					attribute.argument.properties as ObjectExpressionProperty[],
					'datePickerProps',
				);
			});
			if (hasDatePickerPropsSpread) return;

			attributes.push(
				j.jsxAttribute(
					j.jsxIdentifier('datePickerProps'),
					j.jsxExpressionContainer(
						j.objectExpression([j.property('init', j.identifier(PROP), j.booleanLiteral(false))]),
					),
				),
			);
			changed = true;
			return;
		}
		if (
			datePickerProps.type !== 'JSXAttribute' ||
			datePickerProps.value?.type !== 'JSXExpressionContainer'
		)
			return;
		if (hasSpread) return;

		const calendarButtonProperty = j.property('init', j.identifier(PROP), j.booleanLiteral(false));
		const datePickerPropsExpression = datePickerProps.value.expression;
		if (isUndefinedIdentifier(datePickerPropsExpression)) {
			datePickerProps.value.expression = j.objectExpression([calendarButtonProperty]);
			changed = true;
			return;
		}
		if (datePickerPropsExpression.type !== 'ObjectExpression') return;

		const datePickerProperties = datePickerPropsExpression.properties as ObjectExpressionProperty[];
		const hasDatePickerPropsSpread = datePickerProperties.some(
			(property) => property.type === 'SpreadElement' || property.type === 'SpreadProperty',
		);
		for (const property of datePickerProperties) {
			if (
				(property.type === 'Property' || property.type === 'ObjectProperty') &&
				(stringField(property.key, 'name') === PROP ||
					stringField(property.key, 'value') === PROP) &&
				isUndefinedIdentifier(property.value)
			) {
				if (hasDatePickerPropsSpread) return;
				property.value = j.booleanLiteral(false);
				changed = true;
				return;
			}
		}
		if (!hasProperty(datePickerProperties, PROP)) {
			if (hasDatePickerPropsSpread) return;
			datePickerProperties.push(calendarButtonProperty);
			changed = true;
		}
	});

	return changed
		? collection.toSource(options.printOptions || { quote: 'single' })
		: fileInfo.source;
}
