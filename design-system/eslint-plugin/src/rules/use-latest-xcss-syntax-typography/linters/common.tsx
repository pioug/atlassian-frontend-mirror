import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { type RuleConfig } from '../config';

export type MetaData = {
	context: Rule.RuleContext;
	config: RuleConfig;
};

export function isPropertyName(node: Rule.Node, name: string): boolean {
	return (
		(isNodeOfType(node, 'Identifier') && node.name === name) ||
		(isNodeOfType(node, 'Literal') && node.value === name)
	);
}
