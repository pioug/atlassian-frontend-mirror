import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';

const MODAL_DIALOG_IMPORT_SOURCES = new Set([
	'@atlaskit/modal-dialog',
	'@atlaskit/modal-dialog/modal-dialog',
]);

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-modal-label',
		type: 'suggestion',
		docs: {
			description: 'Disallows usage of the `label` prop on Atlassian Design System modal dialog.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noModalLabel:
				'Do not use the `label` prop on modal dialog. Use the `ModalTitle` component within the `ModalHeader`, or the `titleId` prop from `useModal()` on your heading element instead.',
		},
	},

	create(context: Rule.RuleContext) {
		const modalDefaultImports = new Set<string>();

		return {
			ImportDeclaration(node) {
				if (!MODAL_DIALOG_IMPORT_SOURCES.has(String(node.source.value))) {
					return;
				}

				node.specifiers.forEach((specifier) => {
					if (isNodeOfType(specifier, 'ImportDefaultSpecifier')) {
						modalDefaultImports.add(specifier.local.name);
					}
				});
			},

			JSXOpeningElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXOpeningElement')) {
					return;
				}

				if (!isNodeOfType(node.name, 'JSXIdentifier') || !modalDefaultImports.has(node.name.name)) {
					return;
				}

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
			},
		};
	},
});

export default rule;
