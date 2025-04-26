/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { getScope } from '@atlaskit/eslint-utils/context-compat';

import { getJsxElementByName } from '../../../utils/get-jsx-element-by-name';
import { getStyledComponentCall } from '../../../utils/get-styled-component-call';
import { isSupportedForLint } from '../supported';

interface MetaData {
	context: Rule.RuleContext;
}

export const StyledComponent = {
	lint(node: Rule.Node, { context }: MetaData) {
		if (
			!isNodeOfType(node, 'CallExpression') ||
			!isNodeOfType(node.callee, 'MemberExpression') ||
			!isNodeOfType(node.callee.object, 'Identifier') ||
			!isNodeOfType(node.callee.property, 'Identifier')
		) {
			return;
		}

		const styles = getStyledComponentCall(node);

		const elementName = node.callee.property.name;

		if (!styles || !isNodeOfType(styles.id, 'Identifier')) {
			return;
		}

		const jsxElement = getJsxElementByName(styles.id.name, getScope(context, node))?.parent;

		if (!jsxElement) {
			// If there's no JSX element, we can't determine if it's being used as an select or not
			return;
		}

		if (jsxElement && !isSupportedForLint(jsxElement, elementName)) {
			return;
		}

		context.report({
			node: styles,
			messageId: 'noHtmlSelect',
			data: {
				name: node.callee.property.name,
			},
		});
	},
};
