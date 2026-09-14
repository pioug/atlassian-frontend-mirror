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
			severity: 'error',
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

		/**
		 * Stack of open ModalHeader elements awaiting a ModalTitle descendant.
		 *
		 * Each frame records whether a ModalTitle has been found anywhere inside
		 * the corresponding ModalHeader's subtree. We use ESLint's own DFS traversal
		 * rather than a hand-rolled recursive search, which avoids the O(subtree)
		 * double-traversal that `containsModalTitle` caused.
		 *
		 * Invariant: frames are pushed in DFS enter-order and popped in exit-order,
		 * so the array is always a valid ancestor chain (outermost frame at index 0).
		 */
		const modalHeaderStack: Array<{ satisfied: boolean }> = [];

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
					localImports.modalHeader.has(elementName) ||
					defaultImports.modalHeader.has(elementName)
				) {
					// Push a new frame when entering a ModalHeader. It starts unsatisfied
					// and will be marked satisfied if a ModalTitle is found in its subtree.
					modalHeaderStack.push({ satisfied: false });
					return;
				}

				if (
					modalHeaderStack.length > 0 &&
					(localImports.modalTitle.has(elementName) || defaultImports.modalTitle.has(elementName))
				) {
					// A ModalTitle anywhere inside the current ModalHeader's subtree satisfies
					// the requirement. Mark all enclosing ModalHeaders satisfied so that
					// ModalTitle inside a nested ModalHeader also satisfies outer ones — matching
					// the original containsModalTitle full-subtree-search semantics.
					for (const entry of modalHeaderStack) {
						entry.satisfied = true;
					}
				}
			},

			'JSXElement:exit'(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}

				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				const elementName = node.openingElement.name.name;

				if (
					localImports.modalHeader.has(elementName) ||
					defaultImports.modalHeader.has(elementName)
				) {
					// Pop on exit (handles both regular and self-closing ModalHeader elements).
					const entry = modalHeaderStack.pop();
					if (entry && !entry.satisfied) {
						context.report({
							node: node.openingElement,
							messageId: 'modalHeaderMissingModalTitle',
						});
					}
				}
			},
		};
	},
});

export default rule;
