/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, type Property } from 'eslint-codemod-utils';

import * as ast from '../../../../ast-nodes';
import { isStringOrNumber } from '../../utils';

import { styleMap } from './style-map';
import supported from './supported';

const messageId = 'noRawSpacingValues';

type Ref = {
	node: Property;
	token?: string;
	fallback?: string | number;
};

type Check =
	| {
			success: false;
			ref: undefined;
	  }
	| {
			success: true;
			ref: Ref;
	  };

export const StyleProperty = {
	lint(node: Rule.Node, { context }: { context: Rule.RuleContext }): void {
		// Check whether all criteria needed to make a transformation are met
		const { success, ref } = StyleProperty._check(node);

		if (!success) {
			return;
		}

		context.report({
			node: ref.node.value,
			messageId,
			fix: ref.token ? StyleProperty._fix(ref, context) : undefined,
		});
	},

	_check(node: Rule.Node): Check {
		if (!isNodeOfType(node, 'Property')) {
			return { success: false, ref: undefined };
		}

		/**
		 * Currently, we support values like:
		 * ```
		 * {
		 *   padding: '8px', // value.type is Literal
		 *   margin: -8, // value.type is UnaryExpression
		 * }
		 * ```
		 */
		if (!(isNodeOfType(node.value, 'Literal') || isNodeOfType(node.value, 'UnaryExpression'))) {
			return { success: false, ref: undefined };
		}

		const { value: property } = ast.ObjectEntry.getProperty(node);

		// Bail if the property is not `padding`, `margin`, etc
		if (!property || !styleMap[property]) {
			return { success: false, ref: undefined };
		}

		const value = ast.ObjectEntry.getValue(node);

		// This is mainly useful as a type guard, so the checks after don't have to have duplicate checks for other types.
		if (!isStringOrNumber(value)) {
			return { success: false, ref: undefined };
		}

		// ignore CSS vars. See: https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/74844/overview?commentId=6741571
		if (value.toString().startsWith('var(')) {
			return { success: false, ref: undefined };
		}

		// There are valid values to ignore, such as `margin: auto`
		if (supported.values.ignore.includes(value)) {
			return { success: false, ref: undefined };
		}

		// Don't report on stuff like `padding: '8px 16px'`.
		// We may iterate to handle values like this in future.
		if (value.toString().includes(' ')) {
			return { success: false, ref: undefined };
		}

		const ref = {
			node,
			token: styleMap[property][value],
			fallback: value,
		};
		return { success: true, ref };
	},

	/**
	 * All required validation steps have been taken care of before this
	 * transformer is called, so it just goes ahead providing all necessary fixes
	 */
	_fix(ref: Ref, context: Rule.RuleContext) {
		return (fixer: Rule.RuleFixer) => {
			const importFix = ast.Root.upsertNamedImportDeclaration(
				{
					module: '@atlaskit/tokens',
					specifiers: ['token'],
				},
				context,
				fixer,
			);

			const tokenCall = ref.fallback
				? `token('${ref.token}', '${ref.fallback}')`
				: `token('${ref.token}')`;
			const tokenFix = fixer.replaceText(ref.node.value, tokenCall);

			return [importFix, tokenFix].filter((fix): fix is Rule.Fix => Boolean(fix)); // Some of the transformers can return arrays with undefined, so filter them out
		};
	},
};
