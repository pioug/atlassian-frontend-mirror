import type { Rule } from 'eslint';
import { isNodeOfType, type Property } from 'eslint-codemod-utils';

import { isDecendantOfType } from './is-decendant-of-type';

export const isPropertyKey = (node: Rule.Node): boolean => {
	if (isNodeOfType(node, 'Identifier') && isDecendantOfType(node, 'Property')) {
		const parent = node.parent as Property;
		return node === parent.key || parent.shorthand;
	}
	return false;
};
