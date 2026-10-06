import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { getScope } from '@atlaskit/eslint-utils/context-compat';

import { findIdentifierInParentScope } from '../utils/find-in-parent';
import { getIsException } from '../utils/get-is-exception';
import { includesHardCodedColor } from '../utils/includes-hard-coded-color';
import { isHardCodedColor } from '../utils/is-hard-coded-color';
import { isLegacyColor } from '../utils/is-legacy-color';
import { getTokenSuggestion } from './get-token-suggestion';
import type { RuleConfig } from './types';

// JSXExpressionContainer > Identifier
export const lintJSXIdentifierForColor = (
	node: Rule.Node,
	context: Rule.RuleContext,
	config: RuleConfig,
): void => {
	// To force the correct node type
	if (node.type !== 'Identifier') {
		return;
	}

	const isException = getIsException(config.exceptions);
	if (isException(node)) {
		return;
	}

	const variable = findIdentifierInParentScope({
		scope: getScope(context, node),
		identifierName: node.name,
	});
	const definition = variable?.defs[0];
	if (
		definition?.type === 'Variable' &&
		definition.parent?.kind === 'const' &&
		isNodeOfType(definition.node, 'VariableDeclarator') &&
		definition.node.init &&
		isNodeOfType(definition.node.init, 'Literal')
	) {
		const value = definition.node.init.value;
		// A color word in an identifier does not make an account ID or other constant a color.
		if (typeof value !== 'string' || (!isHardCodedColor(value) && !includesHardCodedColor(value))) {
			return;
		}
	}

	if (isLegacyColor(node.name) || includesHardCodedColor(node.name)) {
		context.report({
			messageId: 'hardCodedColor',
			node,
			suggest: getTokenSuggestion(node, node.name, config),
		});
		return;
	}
};
