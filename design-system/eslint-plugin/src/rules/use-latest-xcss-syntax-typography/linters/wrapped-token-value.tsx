/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { type MetaData } from './common';

const messageId = 'noWrappedTokenTypographyValues';

export const WrappedTokenValue = {
	lint(node: Rule.Node, { context, config }: MetaData) {
		if (WrappedTokenValue._check(node, { context, config })) {
			context.report({
				node,
				messageId,
				fix: WrappedTokenValue._fix(node),
			});
		}
	},
	_check(node: Rule.Node, { config }: MetaData): boolean {
		if (!config.patterns.includes('wrapped-token-value')) {
			return false;
		}

		if (
			isNodeOfType(node.parent, 'Property') &&
			isNodeOfType(node.parent.value, 'CallExpression') &&
			isNodeOfType(node.parent.value.callee, 'Identifier') &&
			node.parent.value.callee.name === 'token' &&
			node.parent.value.arguments.length >= 1
		) {
			return true;
		}

		return false;
	},
	_fix(node: Rule.Node): Rule.ReportFixer {
		return (fixer) => {
			let wrappedTokenFix: Rule.Fix | undefined;
			if (
				isNodeOfType(node.parent, 'Property') &&
				isNodeOfType(node.parent.value, 'CallExpression') &&
				node.parent.value.arguments.length >= 1
			) {
				const firstArg = node.parent.value.arguments[0];
				if (isNodeOfType(firstArg, 'Literal') && typeof firstArg.value === 'string') {
					wrappedTokenFix = fixer.replaceText(node.parent.value, `'${firstArg.value}'`);
				}
			}

			return [wrappedTokenFix].filter((fix): fix is Rule.Fix => Boolean(fix)); // Some of the transformers can return arrays with undefined, so filter them out
		};
	},
};
