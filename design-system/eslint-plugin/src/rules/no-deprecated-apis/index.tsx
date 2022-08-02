import type { Rule } from 'eslint';
import {
  closestOfType,
  isNodeOfType,
  JSXAttribute,
} from 'eslint-codemod-utils';

import { getImportedNodeBySource } from '../utils/get-import-node-by-source';

const unsafeOverridesConfig = {
  cssFn: ['@atlaskit/menu', '@atlaskit/side-navigation'],
  overrides: [
    '@atlaskit/drawer',
    '@atlaskit/menu',
    '@atlaskit/side-navigation',
  ],
  innerRef: ['@atlaskit/banner'],
  isOpen: ['@atlaskit/banner'],
};

type BannedAPIs = keyof typeof unsafeOverridesConfig;

const unsafeOverrides: BannedAPIs[] = [
  'cssFn',
  'overrides',
  'innerRef',
  'isOpen',
];

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow specified APIs that have been marked as deprecated and/or discouraged.',
      recommended: true,
    },
    messages: {
      noDeprecatedApis: `The prop "{{propName}}" has been deprecated. It will be removed in the next major release.`,
    },
  },

  create(context) {
    return {
      // find JSX atribute - find name of attribute - get source and find relevant identifiers.
      JSXAttribute(node: JSXAttribute & Rule.NodeParentExtension) {
        if (!unsafeOverrides.includes(node?.name?.name as BannedAPIs)) {
          return;
        }

        const source = context.getSourceCode();
        const bannedApi = node.name.name as BannedAPIs;

        // traverse the tree to the nearest JSX Element and get its name
        const closesetJSXElement = closestOfType(node, 'JSXOpeningElement')!;

        const jsxElementName =
          isNodeOfType(closesetJSXElement?.name, 'JSXIdentifier') &&
          closesetJSXElement.name.name;

        if (!jsxElementName) {
          return;
        }

        // find an import for the path of the banned api
        unsafeOverridesConfig[bannedApi].forEach((path) => {
          const importNode = getImportedNodeBySource(source, path);

          if (!importNode) {
            return;
          }

          // find an import that matches our JSX element
          const hasTargetNode = importNode.specifiers.some(
            (node) => node.local.name === jsxElementName,
          );

          if (!hasTargetNode) {
            return;
          }

          // if we're here the import exists and there is a valid lint error.
          context.report({
            node: node as any,
            messageId: 'noDeprecatedApis',
            data: {
              propName: bannedApi,
            },
          });
        });
      },
    };
  },
};

export default rule;
