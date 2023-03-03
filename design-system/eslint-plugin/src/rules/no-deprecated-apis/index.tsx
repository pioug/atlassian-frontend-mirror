import fs from 'fs';
import path from 'path';

import {
  AST_NODE_TYPES,
  ASTUtils,
  ESLintUtils,
  TSESLint,
  type TSESTree,
} from '@typescript-eslint/utils';

interface DeprecatedConfigEntry {
  moduleSpecifier: string;
  namedSpecifiers?: string[];
  actionableVersion?: string;
}

export interface DeprecatedConfig {
  [key: string]: DeprecatedConfigEntry[];
}

const createRule = ESLintUtils.RuleCreator((name: string) => name);

export const noDeprecatedJSXAttributeMessageId = 'noDeprecatedJSXAttributes';

const isNodeOfType = <NodeType extends AST_NODE_TYPES>(
  node: TSESTree.Node,
  nodeType: NodeType,
) => ASTUtils.isNodeOfType(nodeType)(node);

const isImportDeclaration = (
  programStatement: TSESTree.ProgramStatement | undefined,
): programStatement is TSESTree.ImportDeclaration => {
  return programStatement?.type === 'ImportDeclaration';
};

const findJSXElementName = (
  jsxAttributeNode: TSESTree.JSXAttribute,
): string | undefined => {
  if (
    !jsxAttributeNode.parent ||
    !isNodeOfType(jsxAttributeNode.parent, AST_NODE_TYPES.JSXOpeningElement)
  ) {
    return;
  }

  const openingElement = jsxAttributeNode.parent as TSESTree.JSXOpeningElement;
  if (!isNodeOfType(openingElement.name, AST_NODE_TYPES.JSXIdentifier)) {
    return;
  }

  return (openingElement.name as TSESTree.JSXIdentifier).name;
};

const getConfig = () => {
  const configPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'configs',
    'deprecated.json',
  );
  const source = fs.readFileSync(configPath, 'utf8');
  const parsedConfig = JSON.parse(source) as DeprecatedConfig;

  return parsedConfig;
};

export const name = 'no-deprecated-apis';

const rule = createRule<
  [{ deprecatedConfig: DeprecatedConfig }],
  string,
  TSESLint.RuleListener
>({
  name,
  defaultOptions: [{ deprecatedConfig: getConfig() }],
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow specified APIs that have been marked as deprecated and/or discouraged.',
      recommended: 'warn',
    },
    messages: {
      noDeprecatedJSXAttributes:
        'The JSX attribute {{propName}} has been deprecated.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          deprecatedConfig: {
            type: 'object',
            properties: {
              '.+': {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    moduleSpecifier: { type: 'string' },
                    namedSpecifiers: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    actionableVersion: { type: 'string' },
                  },
                  required: ['moduleSpecifier'],
                  additionalProperites: false,
                },
              },
            },
          },
        },
      },
    ],
  },

  create(context, [options]) {
    // Get rule configuration
    const { deprecatedConfig: defaultDeprecatedConfig } = options;

    // Get the rule configuration specified otherwise use default config.
    // A bit confusing as it seems that the default options have precedence over the user specified options.
    const deprecatedConfig =
      context.options[0]?.deprecatedConfig || defaultDeprecatedConfig;

    return {
      // find JSX atribute - find name of attribute - get source and find relevant identifiers.
      JSXAttribute(node) {
        const jsxAttributeIdentifier = node.name;
        if (
          !isNodeOfType(jsxAttributeIdentifier, AST_NODE_TYPES.JSXIdentifier)
        ) {
          return;
        }
        const jsxAttributeName = jsxAttributeIdentifier.name as string;

        if (!deprecatedConfig[jsxAttributeName]) {
          return;
        }

        const jsxElementName = findJSXElementName(node);

        if (!jsxElementName) {
          return;
        }
        const source = context.getSourceCode();

        // find an import for the path of the banned api
        deprecatedConfig[jsxAttributeName].forEach((importItem) => {
          const importNode = source.ast.body
            .filter(isImportDeclaration)
            .find((node) => node.source.value === importItem.moduleSpecifier);

          if (!importNode) {
            return;
          }

          // find an import that matches our JSX element
          const targetNode = importNode.specifiers.find(
            (node) => node.local.name === jsxElementName,
          );

          // check if the import exists
          if (!targetNode) {
            return;
          }

          // if the import has named specifiers, check if the JSX element is one of them
          if (
            importItem?.namedSpecifiers?.length &&
            !importItem.namedSpecifiers.includes(targetNode.local.name)
          ) {
            return;
          }

          // if we're here, there is a valid lint error.
          context.report({
            node,
            messageId: 'noDeprecatedJSXAttributes',
            data: {
              propName: jsxAttributeName,
            },
          });
        });
      },
    };
  },
});

export default rule;
