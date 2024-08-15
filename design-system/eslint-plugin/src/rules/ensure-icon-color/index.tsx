// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { isNodeOfType, type JSXElement } from 'eslint-codemod-utils';

import { createIsFromImportSourceFor } from '../no-custom-icons/checks/is-from-import-source';
import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

/**
 * Returns if the node is a JSXElement with a prop that matches the given name.
 */
function hasProp(node: JSXElement, propName: string) {
	return (
		isNodeOfType(node.openingElement, 'JSXOpeningElement') &&
		node.openingElement.attributes.some(
			(a) => a.type === 'JSXAttribute' && a.name.name === propName,
		)
	);
}

const rule = createLintRule({
	meta: {
		name: 'ensure-icon-color',
		docs: {
			description:
				'Enforces that upcoming icon components have a color prop set, to enable a migration of the default value.',
			recommended: false,
			severity: 'error',
		},
		messages: {
			missingColorProp:
				'The default value of the `color` prop is about to change. To assist in the migration, the color prop must be set on new icons from `@atlaskit/icon/(core|utility)`.',
		},
	},

	create(context) {
		/**
		 * Contains a map of imported icon components from any atlaskit icon package.
		 */
		const isNewIcon = createIsFromImportSourceFor(
			/^@(atlaskit\/icon|atlassian\/icon-lab)\/(core|utility)\/*/,
		);

		return errorBoundary({
			JSXElement(node: Rule.Node) {
				if (!isNewIcon(node) || hasProp(node, 'color')) {
					return;
				}
				const importSource = isNewIcon.getImportSource(node) ?? '';
				context.report({
					node: node.openingElement,
					messageId: 'missingColorProp',
					data: { importSource },
				});
			},

			ImportDeclaration: isNewIcon.importDeclarationHook,
		});
	},
});

export default rule;
