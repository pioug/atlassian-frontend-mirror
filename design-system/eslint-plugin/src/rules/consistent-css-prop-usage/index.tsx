import type { Rule, Scope } from 'eslint';
import {
  CallExpression,
  EslintNode,
  Expression,
  getIdentifierInParentScope,
  isNodeOfType,
  ObjectExpression,
  SpreadElement,
} from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const declarationSuffix = 'Styles';

type IdentifierWithParent = Scope.Reference['identifier'] &
  Rule.NodeParentExtension;

function isCssCallExpression(node: EslintNode): node is CallExpression {
  return !!(
    isNodeOfType(node, 'CallExpression') &&
    node.callee &&
    node.callee.type === 'Identifier' &&
    (node.callee.name === 'css' || node.callee.name === 'xcss') &&
    node.arguments.length &&
    node.arguments[0].type === 'ObjectExpression'
  );
}

function findSpreadProperties(node: ObjectExpression): SpreadElement[] {
  // @ts-ignore
  return node.properties.filter(
    (property) =>
      property.type === 'SpreadElement' ||
      // @ts-ignore
      property.type === 'ExperimentalSpreadProperty',
  );
}

function analyzeIdentifier(
  context: Rule.RuleContext,
  sourceIdentifier: Scope.Reference['identifier'],
) {
  const scope = context.getScope();
  const [identifier] =
    (getIdentifierInParentScope(scope, sourceIdentifier.name)
      ?.identifiers as IdentifierWithParent[]) || [];
  if (!identifier || !identifier.parent) {
    // Identifier isn't in the module, skip!
    return;
  }

  if (identifier.parent.type !== 'VariableDeclarator') {
    // When variable is not in the file or coming from import
    context.report({
      node: sourceIdentifier,
      messageId: 'cssInModule',
    });
    return;
  }

  if (identifier.parent.parent.parent.type !== 'Program') {
    // When variable is declared inside the component
    context.report({
      node: sourceIdentifier,
      messageId: 'cssOnTopOfModule',
    });
    return;
  }

  if (
    identifier.parent &&
    identifier.parent.init &&
    !isCssCallExpression(identifier.parent.init)
  ) {
    // When variable value is not of type css({})
    context.report({
      node: identifier,
      messageId: 'cssObjectTypeOnly',
    });
    return;
  }

  const spreadProperties =
    isNodeOfType(identifier.parent.init!, 'CallExpression') &&
    findSpreadProperties(
      identifier.parent.init.arguments[0] as ObjectExpression,
    );
  if (spreadProperties) {
    // TODO: Recursively handle spread items in children properties.
    spreadProperties.forEach((prop: any) => {
      context.report({
        node: prop,
        messageId: 'cssArrayStylesOnly',
      });
    });
  }
}

function traverseExpression(
  context: Rule.RuleContext,
  expression: Expression | SpreadElement,
) {
  switch (expression.type) {
    case 'Identifier':
      // {styles}
      // We've found an identifier - time to analyze it!
      analyzeIdentifier(context, expression);
      break;

    case 'ArrayExpression':
      // {[styles, moreStyles]}
      // We've found an array expression - let's traverse again over each element individually.
      expression.elements.forEach((element) =>
        traverseExpression(context, element!),
      );
      break;

    case 'LogicalExpression':
      // {isEnabled && styles}
      // We've found a logical expression - we're only interested in the right expression so
      // let's traverse that and see what it is!
      traverseExpression(context, expression.right);
      break;

    case 'ConditionalExpression':
      // {isEnabled ? styles : null}
      // We've found a conditional expression - we're only interested in the consequent and
      // alternate (styles : null)
      traverseExpression(context, expression.consequent);
      traverseExpression(context, expression.alternate);
      break;

    case 'CallExpression':
    case 'ObjectExpression':
    case 'TaggedTemplateExpression':
    case 'TemplateLiteral':
      // We've found elements that shouldn't be here! Report an error.
      context.report({
        node: expression,
        messageId: 'cssOnTopOfModule',
      });
      break;

    default:
      // Do nothing!
      break;
  }
}

const rule = createLintRule({
  meta: {
    name: 'consistent-css-prop-usage',
    docs: {
      description: 'Ensures consistency with CSS and xCSS prop usages',
      url: 'https://developer.atlassian.com/cloud/framework/atlassian-frontend/development/styling',
      recommended: true,
      severity: 'error',
    },
    fixable: 'code',
    messages: {
      cssOnTopOfModule: `Create styles at the top of the module scope using the css function.`,
      cssObjectTypeOnly: `Create styles using objects passed to the css function.`,
      cssInModule: `Imported styles should not be used, instead define in the module, import a component, or use a design token.`,
      cssArrayStylesOnly: `Compose styles with an array on the CSS prop instead of using object spread.`,
      shouldEndInStyles: 'Declared styles should end in "styles".',
    },
  },
  create(context) {
    return {
      'CallExpression[callee.name=css], CallExpression[callee.name=xcss]': (
        node: Rule.Node,
      ) => {
        if (node.parent.type !== 'VariableDeclarator') {
          // We aren't interested in these that don't have a parent.
          return;
        }

        const identifier = node.parent.id;
        if (
          identifier.type === 'Identifier' &&
          identifier.name.endsWith(declarationSuffix)
        ) {
          // Already prefixed! Nothing to do.
          return;
        }

        context.report({
          node: identifier,
          messageId: 'shouldEndInStyles',
          fix: (fixer) => {
            const identifierName =
              identifier.type === 'Identifier' ? identifier.name : '';
            const references: Scope.Scope['references'] =
              context
                .getScope()
                .variables.find((varb) => varb.name === identifierName)
                ?.references || [];

            const newIdentifierName = `${identifierName
              // Remove "Style" if it is already defined.
              .replace(/Style$/, '')}${declarationSuffix}`;

            return references
              .filter((ref) => ref.identifier.name === identifierName)
              .map((ref: any) => {
                if (ref.identifier.parent && ref.identifier.parent.shorthand) {
                  return fixer.replaceText(
                    ref.identifier,
                    `${identifierName}: ${newIdentifierName}`,
                  );
                }

                return fixer.replaceText(ref.identifier, newIdentifierName);
              });
          },
        });
      },
      JSXAttribute(node: any) {
        const { name, value } = node;

        if (
          name.type === 'JSXIdentifier' &&
          (name.name === 'css' || name.name === 'xcss')
        ) {
          // When not a jsx expression. For eg. css=""
          if (value?.type !== 'JSXExpressionContainer') {
            context.report({
              node: value,
              messageId: 'cssOnTopOfModule',
            });

            return;
          }

          traverseExpression(context, value.expression);
        }
      },
    };
  },
});

export default rule;
