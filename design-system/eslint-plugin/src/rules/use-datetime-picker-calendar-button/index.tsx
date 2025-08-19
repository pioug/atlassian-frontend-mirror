import type { Rule } from 'eslint';
import {
	type Identifier,
	type ImportSpecifier,
	isNodeOfType,
	type JSXElement,
	type ObjectExpression,
	type Property,
} from 'eslint-codemod-utils';

import { JSXAttribute } from '../../ast-nodes/jsx-attribute';
import { JSXElementHelper } from '../../ast-nodes/jsx-element';
import { createLintRule } from '../utils/create-rule';

const DATE_PICKER = 'DatePicker';
const DATETIME_PICKER = 'DateTimePicker';
const PROP_NAME = 'shouldShowCalendarButton';

// Lint rule message
const message =
	'`shouldShowCalendarButton` should be set to `true` to make date picker accessible.';

// Fix messages
export const addCalendarButtonProp = 'Add `shouldShowCalendarButton` prop.';
export const setCalendarButtonPropToTrue = 'Set `shouldShowCalendarButton` prop to `true`.';
export const addCalendarButtonProperty =
	'Add `shouldShowCalendarButton: true` to `datePickerProps`.';
export const setCalendarButtonPropertyToTrue =
	'Set `shouldShowCalendarButton` property in `datePickerProps` to `true`.';

const datePickerJSXElement = (node: JSXElement, context: Rule.RuleContext) => {
	const prop = JSXElementHelper.getAttributeByName(node, PROP_NAME);

	// If the prop exists
	if (prop) {
		const attrValue = JSXAttribute.getValue(prop);
		// If the value is a boolean with value `false`
		if (attrValue?.type === 'ExpressionStatement Literal' && attrValue?.value === false) {
			return context.report({
				node: prop,
				messageId: 'datePickerCalendarButtonShouldBeShown',
				suggest: [
					{
						desc: setCalendarButtonPropToTrue,
						fix: (fixer) => [fixer.replaceText(prop, PROP_NAME)],
					},
				],
			});
		}
		// If the prop does not exist
	} else {
		return context.report({
			node: node.openingElement,
			messageId: 'datePickerMissingCalendarButtonProp',
			suggest: [
				{
					desc: addCalendarButtonProp,
					fix: (fixer) => [fixer.insertTextAfter(node.openingElement.name, ` ${PROP_NAME}`)],
				},
			],
		});
	}
};

const dateTimePickerJSXElement = (node: JSXElement, context: Rule.RuleContext) => {
	const datePickerProp = JSXElementHelper.getAttributeByName(node, 'datePickerProps');

	// If the `datePickerProps` prop does not exist or is not an expression
	// container (the latter being essentially unprecedented, against type
	// guidelines, and useless)
	if (!datePickerProp || datePickerProp.value?.type !== 'JSXExpressionContainer') {
		return context.report({
			node: node.openingElement,
			messageId: 'dateTimePickerMissingCalendarButtonProp',
			suggest: [
				{
					desc: addCalendarButtonProperty,
					fix: (fixer) => [
						fixer.insertTextAfter(
							node.openingElement.name,
							` datePickerProps={{ ${PROP_NAME}: true }}`,
						),
					],
				},
			],
		});
	}

	// Had to cast all these things because ESLint can't hang here. The
	// types are just abjectly wrong from what I can log.
	const expression = datePickerProp.value.expression as ObjectExpression;
	// If it is not an analyzable expression, like a variable or something, skip
	// it.
	if (!isNodeOfType(datePickerProp.value.expression, 'ObjectExpression')) {
		return;
	}

	const prop = expression?.properties?.find(
		(property) => property.type === 'Property' && (property.key as Identifier).name === PROP_NAME,
	) as Property | undefined;

	// If the `shouldShowCalendarButton` prop does not exist in `datePickerProps`
	if (!prop) {
		return context.report({
			node: datePickerProp,
			messageId: 'dateTimePickerMissingCalendarButtonProp',
			suggest: [
				{
					desc: addCalendarButtonProperty,
					fix: (fixer) => {
						// If it has existing properties
						if (expression.properties.length > 0) {
							// Needs following comma to not disrupt existing properties inside `datePickerProps`
							return [fixer.insertTextBefore(expression.properties[0], `${PROP_NAME}: true,`)];
							// Else it's an empty object
						} else {
							return [fixer.replaceText(expression, `{ ${PROP_NAME}: true }`)];
						}
					},
				},
			],
		});
		// If the `shouldShowCalendarButton` property exists and it's value is `false`
	} else if (isNodeOfType(prop.value, 'Literal') && prop.value.value !== true) {
		return context.report({
			node: datePickerProp,
			messageId: 'dateTimePickerCalendarButtonShouldBeShown',
			suggest: [
				{
					desc: setCalendarButtonPropertyToTrue,
					// Needs following comma to not disrupt existing properties inside `datePickerProps`
					fix: (fixer) => [fixer.replaceText(prop, `${PROP_NAME}: true,`)],
				},
			],
		});
	}
};

const rule = createLintRule({
	meta: {
		name: 'use-datetime-picker-calendar-button',
		type: 'suggestion',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description:
				"Encourages makers to use calendar button in Atlassian Design System's date picker and datetime picker components.",
			recommended: true,
			severity: 'warn',
		},
		messages: {
			dateTimePickerMissingCalendarButtonProp: `In \`datePickerProps\`, ${message}`,
			datePickerMissingCalendarButtonProp: message,
			dateTimePickerCalendarButtonShouldBeShown: `In \`datePickerProps\`, ${message}`,
			datePickerCalendarButtonShouldBeShown: message,
		},
	},

	create(context: Rule.RuleContext) {
		// List of component's locally imported names that match
		const contextLocalIdentifier: string[] = [];
		const contextImportedIdentifier: string[] = [];

		return {
			// Only run rule in files where the package is imported
			ImportDeclaration(node) {
				const datetimePickerIdentifier = node.specifiers?.filter((spec) => {
					if (node.source.value === '@atlaskit/datetime-picker') {
						return (
							isNodeOfType(spec, 'ImportSpecifier') &&
							'name' in spec.imported &&
							[DATE_PICKER, DATETIME_PICKER].includes(spec.imported?.name)
						);
					}
				}) as ImportSpecifier[];

				datetimePickerIdentifier.forEach((identifier) => {
					if ('name' in identifier.imported) {
						const { imported, local } = identifier;
						contextLocalIdentifier.push(local.name);
						contextImportedIdentifier.push(imported.name);
					}
				});
			},

			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}

				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				const name = node.openingElement.name.name;
				const localIndex = contextLocalIdentifier.indexOf(name);

				// If this component does not match what we're looking for, quit early
				if (localIndex === -1) {
					return;
				}

				const importedName = contextImportedIdentifier[localIndex];

				if (importedName === DATE_PICKER) {
					return datePickerJSXElement(node, context);
				} else if (importedName === DATETIME_PICKER) {
					return dateTimePickerJSXElement(node, context);
				}
			},
		};
	},
});

export default rule;
