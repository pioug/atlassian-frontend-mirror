import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { Root } from '../../ast-nodes/root';

export const isDecendantOfPrimitive = (node: Rule.Node, context: Rule.RuleContext): boolean => {
	const primitivesToCheck = ['Box', 'Text', 'Tile'];

	if (isNodeOfType(node, 'JSXElement')) {
		// @ts-ignore
		if (primitivesToCheck.includes(node.openingElement.name.name)) {
			const importDeclaration = Root.findImportsByModule(getSourceCode(context).ast.body, [
				'@atlaskit/primitives',
				'@atlaskit/primitives/box',
				'@atlaskit/primitives/text',
				'@atlaskit/primitives/compiled',
				'@atlaskit/tile',
			]);

			if (importDeclaration.length) {
				return true;
			}
		}
	}

	if (node.parent) {
		return isDecendantOfPrimitive(node.parent, context);
	}

	return false;
};
