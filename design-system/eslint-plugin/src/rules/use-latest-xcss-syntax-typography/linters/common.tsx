import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { type RuleConfig } from '../config';

export type MetaData = {
	context: Rule.RuleContext;
	config: RuleConfig;
};

export function isPropertyName(node: Rule.Node, name: string): boolean {
	return (
		// @ts-ignore - Node type compatibility issue with EslintNode
		(isNodeOfType(node, 'Identifier') && node.name === name) ||
		// @ts-ignore - Node type compatibility issue with EslintNode
		(isNodeOfType(node, 'Literal') && node.value === name)
	);
}
