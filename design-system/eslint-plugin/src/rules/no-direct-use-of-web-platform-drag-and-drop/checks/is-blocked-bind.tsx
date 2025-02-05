// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { type CallExpression, isNodeOfType } from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { getModuleOfIdentifier } from '../../utils/get-import-node-by-source';
import { isBlockedEventBinding } from '../shared/is-blocked-event-binding';

export function isBlockedBind(context: Rule.RuleContext, node: CallExpression): boolean {
	const callee = node.callee;

	if (!isNodeOfType(callee, 'Identifier')) {
		return false;
	}

	if (callee.name !== 'bind') {
		return false;
	}

	const module = getModuleOfIdentifier(getSourceCode(context), 'bind');

	if (module?.moduleName !== 'bind-event-listener') {
		return false;
	}

	const secondArg = node.arguments[1];

	if (!isNodeOfType(secondArg, 'ObjectExpression')) {
		return false;
	}

	// using a for loop for speed 🚀

	for (const property of secondArg.properties) {
		if (isBlockedEventBinding(property)) {
			return true;
		}
	}

	// no exit conditions hit
	return false;
}
