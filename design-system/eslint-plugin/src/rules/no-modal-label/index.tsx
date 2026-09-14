import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';

const MODAL_DIALOG_IMPORT_SOURCES = new Set([
	'@atlaskit/modal-dialog',
	'@atlaskit/modal-dialog/modal-dialog',
]);

type SupportedNamedImport = {
	source: string;
	namedImport: string;
};

/**
 * Modal entry-point triggers forward modal dialog props via `modalProps`.
 * Do not flag top-level `label` on these components — IconButton-based triggers
 * use `label` for the trigger button itself.
 */
const MODAL_ENTRY_POINT_TRIGGERS: SupportedNamedImport[] = [
	{ source: '@atlassian/entry-points/modal-trigger', namedImport: 'ModalTrigger' },
	{ source: '@atlassian/entry-points/modal-button-trigger', namedImport: 'ModalButtonTrigger' },
	{
		source: '@atlassian/entry-points/modal-dropdown-item-trigger',
		namedImport: 'ModalDropdownItemTrigger',
	},
	{
		source: '@atlassian/entry-points/modal-icon-button-trigger',
		namedImport: 'ModalIconButtonTrigger',
	},
	{
		source: '@atlassian/entry-points/full-screen-modal-trigger',
		namedImport: 'FullScreenModalTrigger',
	},
];

const hasLabelInObjectExpression = (expression: Rule.Node): boolean => {
	if (!isNodeOfType(expression, 'ObjectExpression')) {
		return false;
	}

	return expression.properties.some((property) => {
		if (!isNodeOfType(property, 'Property') || property.computed) {
			return false;
		}

		if (isNodeOfType(property.key, 'Identifier')) {
			return property.key.name === 'label';
		}

		return isNodeOfType(property.key, 'Literal') && property.key.value === 'label';
	});
};

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-modal-label',
		type: 'suggestion',
		docs: {
			description:
				'Disallows usage of the `label` prop on Atlassian Design System modal dialog and modal entry-point triggers.',
			recommended: true,
			severity: 'error',
		},
		messages: {
			noModalLabel:
				'Do not use the `label` prop on modal dialog. Use the `ModalTitle` component within the `ModalHeader`, or the `titleId` prop from `useModal()` on your heading element instead.',
		},
	},

	create(context: Rule.RuleContext) {
		const modalDefaultImports = new Set<string>();
		const modalEntryPointTriggerImports = new Set<string>();

		return {
			ImportDeclaration(node) {
				const source = String(node.source.value);

				if (MODAL_DIALOG_IMPORT_SOURCES.has(source)) {
					node.specifiers.forEach((specifier) => {
						if (isNodeOfType(specifier, 'ImportDefaultSpecifier')) {
							modalDefaultImports.add(specifier.local.name);
						}
					});
					return;
				}

				const supportedImport = MODAL_ENTRY_POINT_TRIGGERS.find(
					(component) => component.source === source,
				);
				if (!supportedImport) {
					return;
				}

				node.specifiers.forEach((specifier) => {
					if (
						isNodeOfType(specifier, 'ImportSpecifier') &&
						isNodeOfType(specifier.imported, 'Identifier') &&
						specifier.imported.name === supportedImport.namedImport
					) {
						modalEntryPointTriggerImports.add(specifier.local.name);
					}
				});
			},

			JSXOpeningElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXOpeningElement')) {
					return;
				}

				if (!isNodeOfType(node.name, 'JSXIdentifier')) {
					return;
				}

				const componentName = node.name.name;

				if (modalDefaultImports.has(componentName)) {
					const labelProp = node.attributes.find(
						(attribute) =>
							isNodeOfType(attribute, 'JSXAttribute') &&
							isNodeOfType(attribute.name, 'JSXIdentifier') &&
							attribute.name.name === 'label',
					);

					if (!labelProp) {
						return;
					}

					context.report({
						node,
						messageId: 'noModalLabel',
					});
					return;
				}

				if (!modalEntryPointTriggerImports.has(componentName)) {
					return;
				}

				const modalPropsAttribute = node.attributes.find(
					(attribute) =>
						isNodeOfType(attribute, 'JSXAttribute') &&
						isNodeOfType(attribute.name, 'JSXIdentifier') &&
						attribute.name.name === 'modalProps',
				);

				if (
					!modalPropsAttribute ||
					!isNodeOfType(modalPropsAttribute, 'JSXAttribute') ||
					!modalPropsAttribute.value ||
					!isNodeOfType(modalPropsAttribute.value, 'JSXExpressionContainer') ||
					!hasLabelInObjectExpression(modalPropsAttribute.value.expression as Rule.Node)
				) {
					return;
				}

				context.report({
					node,
					messageId: 'noModalLabel',
				});
			},
		};
	},
});

export default rule;
