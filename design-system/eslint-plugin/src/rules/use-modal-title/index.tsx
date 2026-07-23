import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';

const MODAL_DIALOG_IMPORT_SOURCES = new Set([
	'@atlaskit/modal-dialog',
	'@atlaskit/modal-dialog/modal-title',
	'@atlaskit/modal-dialog/modal-header',
]);

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-modal-title',
		type: 'suggestion',
		docs: {
			description:
				'Encourages makers to include `ModalTitle` within `ModalHeader` when using Atlassian Design System modal dialog.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			modalHeaderMissingModalTitle: '`ModalHeader` should include `ModalTitle`.',
		},
	},

	create(context: Rule.RuleContext) {
		const localImports = {
			modalHeader: new Set<string>(),
			modalTitle: new Set<string>(),
		};

		const defaultImports = {
			modalHeader: new Set<string>(),
			modalTitle: new Set<string>(),
		};

		const containsModalTitle = (node: any): boolean => {
			if (!node) {
				return false;
			}

			if (Array.isArray(node)) {
				return node.some((childNode) => containsModalTitle(childNode));
			}

			if (isNodeOfType(node, 'JSXElement')) {
				if (
					isNodeOfType(node.openingElement.name, 'JSXIdentifier') &&
					(localImports.modalTitle.has(node.openingElement.name.name) ||
						defaultImports.modalTitle.has(node.openingElement.name.name))
				) {
					return true;
				}

				return node.children.some((child) => containsModalTitle(child));
			}

			if (isNodeOfType(node, 'JSXFragment')) {
				return node.children.some((child) => containsModalTitle(child));
			}

			if (isNodeOfType(node, 'JSXExpressionContainer')) {
				return containsModalTitle(node.expression);
			}

			if (isNodeOfType(node, 'LogicalExpression')) {
				return containsModalTitle(node.left) || containsModalTitle(node.right);
			}

			if (isNodeOfType(node, 'ConditionalExpression')) {
				return containsModalTitle(node.consequent) || containsModalTitle(node.alternate);
			}

			if (isNodeOfType(node, 'ArrayExpression')) {
				return containsModalTitle(node.elements as Rule.Node[]);
			}

			if (isNodeOfType(node, 'ArrowFunctionExpression')) {
				return containsModalTitle(node.body);
			}

			return false;
		};

		return {
			// Keeping this for barrel imports, though we are moving away from them.
			// This is mostly for non-internal usage.
			ImportDeclaration(node) {
				const importSource = String(node.source.value);

				if (!MODAL_DIALOG_IMPORT_SOURCES.has(importSource)) {
					return;
				}

				node.specifiers.forEach((specifier) => {
					if (isNodeOfType(specifier, 'ImportSpecifier') && 'name' in specifier.imported) {
						if (specifier.imported.name === 'ModalHeader') {
							localImports.modalHeader.add(specifier.local.name);
						}

						if (specifier.imported.name === 'ModalTitle') {
							localImports.modalTitle.add(specifier.local.name);
						}
					}

					if (isNodeOfType(specifier, 'ImportDefaultSpecifier')) {
						if (importSource === '@atlaskit/modal-dialog/modal-header') {
							defaultImports.modalHeader.add(specifier.local.name);
						}

						if (importSource === '@atlaskit/modal-dialog/modal-title') {
							defaultImports.modalTitle.add(specifier.local.name);
						}
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

				const elementName = node.openingElement.name.name;
				if (
					!localImports.modalHeader.has(elementName) &&
					!defaultImports.modalHeader.has(elementName)
				) {
					return;
				}

				if (!containsModalTitle(node.children as Rule.Node[])) {
					context.report({
						node: node.openingElement,
						messageId: 'modalHeaderMissingModalTitle',
					});
				}
			},
		};
	},
});

export default rule;
