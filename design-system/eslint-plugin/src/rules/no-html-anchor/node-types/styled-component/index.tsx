/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { getJsxElementByName } from '../../utils/get-jsx-element-by-name';
import { isSupportedForLint } from '../supported';

import { getStyledComponentCall } from './get-styled-component-call';

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

    const jsxElement = getJsxElementByName(
      styles.id.name,
      context.getScope(),
    )?.parent;

    if (jsxElement && !isSupportedForLint(jsxElement, elementName)) {
      return;
    }

    context.report({
      node: styles,
      messageId: 'noHtmlAnchor',
      data: {
        name: node.callee.property.name,
      },
    });
  },
};
