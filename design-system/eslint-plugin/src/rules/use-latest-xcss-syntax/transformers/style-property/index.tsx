/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, type Property as ObjectEntry } from 'eslint-codemod-utils';

import * as ast from '../../../../ast-nodes';
import { getSourceCode } from '../../../utils/context-compat';

import { styleMap } from './style-map';
import supported from './supported';

const messageId = 'noRawSpacingValues';

type Check =
	| {
			success: false;
			ref: undefined;
	  }
	| {
			success: true;
			ref: ObjectEntry;
	  };

export const StyleProperty = {
	lint(node: Rule.Node, { context }: { context: Rule.RuleContext }) {
		const { success, ref } = StyleProperty._check(node, { context });

		if (!success) {
			return;
		}

		context.report({
			node: ref,
			messageId,
		});
	},

	_check(node: Rule.Node, { context }: { context: Rule.RuleContext }): Check {
		if (!isNodeOfType(node, 'Property')) {
			return { success: false, ref: undefined };
		}

		const importDeclarations = ast.Root.findImportsByModule(
			getSourceCode(context).ast.body,
			'@atlaskit/primitives',
		);

		const isXcssImported = importDeclarations.some((importDeclaration) => {
			return ast.Import.containsNamedSpecifier(importDeclaration, 'xcss');
		});

		if (!isXcssImported) {
			return { success: false, ref: undefined };
		}

		/**
		 * Currently, we support values like:
		 * ```
		 * xcss({
		 *   margin: '8px', // value.type is Literal
		 * })
		 * ```
		 *
		 * More complex code, like:
		 * ```
		 * xcss({
		 *   margin: condition ? 'space.100' : 'space.200',
		 * })
		 * ```
		 * is too difficult to lint
		 */
		if (!isNodeOfType(node.value, 'Literal')) {
			return { success: false, ref: undefined };
		}

		const { value: property } = ast.ObjectEntry.getProperty(node);

		// Bail if the property is not `padding`, `margin`, etc
		if (!property || !styleMap.includes(property)) {
			return { success: false, ref: undefined };
		}

		const value = ast.ObjectEntry.getValue(node);

		if (typeof value !== 'string') {
			return { success: false, ref: undefined };
		}

		// There are valid values to ignore, such as tokens, or `margin: auto`
		if (supported.values.ignore.includes(value)) {
			return { success: false, ref: undefined };
		}

		return { success: true, ref: node };
	},
};
