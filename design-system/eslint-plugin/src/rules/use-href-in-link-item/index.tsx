import type { Rule } from 'eslint';
import { isNodeOfType, JSXAttribute } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

import { getLinkItemImportName, hrefHasInvalidValue } from './utils';

const rule = createLintRule({
  meta: {
    name: 'use-href-in-link-item',
    type: 'suggestion',
    hasSuggestions: true,
    docs: {
      description:
        'Inform developers of eventual requirement of `href` prop in `LinkItem` component. Elements with a `link` role require an `href` attribute for users to properly navigate, particularly those using assistive technologies. If no valid `href` is required for your use case, consider using a `ButtonItem` instead.',
      recommended: true,
      severity: 'warn',
    },
    messages: {
      hrefRequired:
        'The `href` prop will be required in future releases. Please use a valid `href` attribute on `LinkItem`. If no valid `href` is needed for your use case, consider using `ButtonItem`.',
    },
  },
  create(context) {
    return {
      JSXElement(node: Rule.Node) {
        if (!isNodeOfType(node, 'JSXElement')) {
          return;
        }

        if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
          return;
        }

        // Get the name of the LinkItem import
        const linkItemImportName = getLinkItemImportName(context.getScope());

        if (node.openingElement.name.name === linkItemImportName) {
          // and if href prop does not exist
          const linkProps = node.openingElement.attributes
            .filter((attr): attr is JSXAttribute =>
              isNodeOfType(attr, 'JSXAttribute'),
            )
            .filter((attr: JSXAttribute) => attr.name.type === 'JSXIdentifier');

          const href = linkProps.find(
            (attr: JSXAttribute) => attr.name.name === 'href',
          );

          if (hrefHasInvalidValue(context.getScope(), href)) {
            context.report({
              node: node,
              messageId: 'hrefRequired',
            });
          }
        }
      },
    };
  },
});

export default rule;
