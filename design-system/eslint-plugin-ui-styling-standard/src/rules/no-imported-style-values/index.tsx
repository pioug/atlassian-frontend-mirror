import { createLintRule } from '../utils/create-rule';
import {
  getImportSources,
  hasStyleObjectArguments,
} from '@atlaskit/eslint-utils/is-supported-import';
import type { JSONSchema4 } from '@typescript-eslint/utils/dist/json-schema';
import { findVariable } from '@atlaskit/eslint-utils/find-variable';
import type { Rule } from 'eslint';
import {
  type AllowList,
  getAllowedDynamicKeys,
  getAllowedFunctionCalls,
  isAllowListedVariable,
} from '@atlaskit/eslint-utils/allowed-function-calls';
import type { Identifier, Node } from 'eslint-codemod-utils';
import esquery from 'esquery';

const schema: JSONSchema4 = [
  {
    type: 'object',
    properties: {
      importSources: {
        type: 'array',
        items: { type: 'string' },
        uniqueItems: true,
      },
      allowedFunctionCalls: {
        type: 'array',
        items: {
          type: 'array',
          minItems: 2,
          maxItems: 2,
          items: [{ type: 'string' }, { type: 'string' }],
        },
        uniqueItems: true,
      },
      allowedDynamicKeys: {
        type: 'array',
        items: {
          type: 'array',
          minItems: 2,
          maxItems: 2,
          items: [{ type: 'string' }, { type: 'string' }],
        },
        uniqueItems: true,
      },
    },
  },
];

const isIdentifierImported = (
  identifier: Identifier,
  context: Rule.RuleContext,
  functionAllowList: AllowList,
  keysAllowList: AllowList,
): boolean => {
  const variable = findVariable({
    identifier: identifier,
    sourceCode: context.sourceCode,
  });
  if (!variable) {
    return false;
  }

  const isImported = variable.defs.some(
    (definition) => definition.type === 'ImportBinding',
  );

  // check if imported variable is allowed
  return (
    isImported &&
    !isAllowListedVariable({
      allowList: functionAllowList,
      variable,
    }) &&
    !isAllowListedVariable({ allowList: keysAllowList, variable })
  );
};

const checkIdentifier = (
  identifier: Identifier,
  context: Rule.RuleContext,
  functionAllowList: AllowList,
  keysAllowList: AllowList,
) => {
  if (
    isIdentifierImported(identifier, context, functionAllowList, keysAllowList)
  ) {
    context.report({
      node: identifier,
      messageId: 'no-imported-style-values',
    });
  }
};

export const rule = createLintRule({
  meta: {
    name: 'no-imported-style-values',
    docs: {
      description: 'Disallows imports of style values',
      recommended: true,
      severity: 'warn',
    },
    messages: {
      'no-imported-style-values':
        'Styles should not be imported to use in css, cssMap, styled, keyframes or xcss calls. All styles should be defined and used in the same file instead.',
    },
    type: 'problem',
    schema,
  },
  create(context) {
    const importSources = getImportSources(context);
    const functionAllowList = getAllowedFunctionCalls(context.options);
    const keysAllowList = getAllowedDynamicKeys(context.options);

    const checkForIdentifiers = (node: Node) => {
      const matches = esquery(node, 'Identifier');

      for (const match of matches) {
        if (match.type === 'Identifier') {
          checkIdentifier(match, context, functionAllowList, keysAllowList);
        }
      }
    };

    return {
      // Checking css/cssMap/keyframes/styled/xcss calls
      CallExpression(node) {
        const { references } = context.sourceCode.getScope(node.callee);

        if (!hasStyleObjectArguments(node.callee, references, importSources)) {
          return;
        }
        node.arguments.forEach(checkForIdentifiers);
      },
      'JSXAttribute[name.name="css"] Identifier': (node: Node) => {
        if (node.type !== 'Identifier') {
          return;
        }

        checkIdentifier(node, context, functionAllowList, keysAllowList);
      },
      'JSXAttribute[name.name="style"] Identifier': (node: Node) => {
        if (node.type !== 'Identifier') {
          return;
        }

        checkIdentifier(node, context, functionAllowList, keysAllowList);
      },
    };
  },
});

export default rule;
