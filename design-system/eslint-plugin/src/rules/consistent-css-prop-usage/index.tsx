// eslint-disable-next-line import/no-extraneous-dependencies
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
import assign from 'lodash/assign';

import { createLintRule } from '../utils/create-rule';

import { RuleConfig } from './types';

type IdentifierWithParent = Scope.Reference['identifier'] &
  Rule.NodeParentExtension;

// File-level tracking of styles hoisted from the cssOnTopOfModule/cssAtBottomOfModule fixers
let hoistedCss: string[] = [];

function isCssCallExpression(
  node: EslintNode,
  cssFunctions: string[],
): node is CallExpression {
  cssFunctions = [...cssFunctions, 'cssMap'];
  return !!(
    isNodeOfType(node, 'CallExpression') &&
    node.callee &&
    node.callee.type === 'Identifier' &&
    cssFunctions.includes(node.callee.name) &&
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

const getProgramNode = (expression: any) => {
  while (expression.parent.type !== 'Program') {
    expression = expression.parent;
  }
  return expression.parent;
};

// TODO: This can be optimised by implementing a fixer at the very end (Program:exit) and handling all validations at once
/**
 * Generates the declarator string when fixing the cssOnTopOfModule/cssAtBottomOfModule cases.
 * When `styles` already exists, `styles_1, styles_2, ..., styles_X` are incrementally created for each unhoisted style.
 * The generated `styles` varibale declaration names must be manually modified to be more informative at the discretion of owning teams.
 */
const getDeclaratorString = (context: Rule.RuleContext) => {
  let scope = context.getScope();

  // Get to ModuleScope
  while (scope && scope.upper && scope.upper.type !== 'global') {
    scope = scope?.upper;
  }
  const variables = scope.variables
    .map((variable) => variable.name)
    .concat(hoistedCss);
  let count = 2;
  let declaratorName = 'styles';

  // Base case
  if (!variables.includes(declaratorName)) {
    return declaratorName;
  } else {
    // If styles already exists, increment the number
    while (variables.includes(`${declaratorName}${count}`)) {
      count++;
    }
  }

  // Keep track of it by adding it to the hoistedCss global array
  hoistedCss = [...hoistedCss, `${declaratorName}${count}`];
  return `${declaratorName}${count}`;
};

function analyzeIdentifier(
  context: Rule.RuleContext,
  sourceIdentifier: Scope.Reference['identifier'],
  configuration: Required<RuleConfig>,
) {
  const scope = context.getScope();
  const [identifier] = (getIdentifierInParentScope(scope, sourceIdentifier.name)
    ?.identifiers ?? []) as IdentifierWithParent[];

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
      messageId:
        configuration.stylesPlacement === 'bottom'
          ? 'cssAtBottomOfModule'
          : 'cssOnTopOfModule',
      fix: (fixer) => {
        return fixCssNotInModuleScope(
          fixer,
          context,
          configuration,
          identifier,
        );
      },
    });
    return;
  }

  if (
    identifier.parent &&
    identifier.parent.init &&
    !isCssCallExpression(identifier.parent.init, configuration.cssFunctions)
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

/**
 * Fixer for the cssOnTopOfModule/cssAtBottomOfModule violation cases.
 * This deals with Identifiers and Expressions passed from the traverseExpressionWithConfig() function.
 * @param fixer The ESLint RuleFixer object
 * @param context The context of the node
 * @param configuration The configuration of the rule, determining whether the fix is implmeneted at the top or bottom of the module
 * @param node Either an IdentifierWithParent node. Expression, or SpreadElement that we handle
 * @param cssAttributeName An optional parameter only added when we fix an ObjectExpression
 */
const fixCssNotInModuleScope = (
  fixer: Rule.RuleFixer,
  context: Rule.RuleContext,
  configuration: Required<RuleConfig>,
  node: Rule.Node | Expression | SpreadElement,
  cssAttributeName?: String | undefined,
) => {
  const sourceCode = context.getSourceCode();

  // Get the program node in order to properly position the hoisted styles
  const programNode = getProgramNode(node);
  let fixerNodePlacement = programNode;

  if (configuration.stylesPlacement === 'bottom') {
    // The last value is the bottom of the file
    fixerNodePlacement = programNode.body[programNode.body.length - 1];
  } else {
    // Place after the last ImportDeclaration
    fixerNodePlacement =
      programNode.body.length === 1
        ? programNode.body[0]
        : programNode.body.find(
            (node: Rule.Node) => node.type !== 'ImportDeclaration',
          );
  }

  let moduleString;
  let implementFixer: Rule.Fix[] = [];

  if (node.type === 'Identifier') {
    const identifier = node as IdentifierWithParent;
    const declarator = identifier.parent.parent;
    moduleString = sourceCode.getText(declarator);
    implementFixer.push(fixer.remove(declarator));
  } else {
    const declarator = getDeclaratorString(context);
    const text = sourceCode.getText(node);

    // If this has been passed, then we know it's an ObjectExpression
    if (cssAttributeName) {
      moduleString = `const ${declarator} = ${cssAttributeName}(${text});`;
    } else {
      moduleString = moduleString = `const ${declarator} = ${text};`;
    }
    implementFixer.push(fixer.replaceText(node, declarator));
  }

  return [
    ...implementFixer,
    // Insert the node either before or after
    configuration.stylesPlacement === 'bottom'
      ? fixer.insertTextAfter(fixerNodePlacement, '\n' + moduleString)
      : fixer.insertTextBefore(fixerNodePlacement, moduleString + '\n'),
  ];
};

/**
 * Handle different cases based on what's been passed in the css-related JSXAttribute
 * @param context the context of the node
 * @param expression the expression of the JSXAttribute value
 * @param configuration what css-related functions to account for (eg. css, xcss, cssMap), and whether to detect bottom vs top expressions
 * @param cssAttributeName used to encapsulate ObjectExpressions when cssOnTopOfModule/cssAtBottomOfModule violations are triggered
 */
const traverseExpressionWithConfig = (
  context: Rule.RuleContext,
  expression: Expression | SpreadElement,
  configuration: Required<RuleConfig>,
  cssAttributeName?: string,
) => {
  function traverseExpression(expression: Expression | SpreadElement) {
    switch (expression.type) {
      case 'Identifier':
        // {styles}
        // We've found an identifier - time to analyze it!
        analyzeIdentifier(context, expression, configuration);
        break;

      case 'ArrayExpression':
        // {[styles, moreStyles]}
        // We've found an array expression - let's traverse again over each element individually.
        expression.elements.forEach((element) => traverseExpression(element!));
        break;

      case 'LogicalExpression':
        // {isEnabled && styles}
        // We've found a logical expression - we're only interested in the right expression so
        // let's traverse that and see what it is!
        traverseExpression(expression.right);
        break;

      case 'ConditionalExpression':
        // {isEnabled ? styles : null}
        // We've found a conditional expression - we're only interested in the consequent and
        // alternate (styles : null)
        traverseExpression(expression.consequent);
        traverseExpression(expression.alternate);
        break;

      case 'ObjectExpression':
      case 'CallExpression':
      case 'TaggedTemplateExpression':
      case 'TemplateLiteral':
        // We've found elements that shouldn't be here! Report an error.
        context.report({
          node: expression,
          messageId:
            configuration.stylesPlacement === 'bottom'
              ? 'cssAtBottomOfModule'
              : 'cssOnTopOfModule',
          fix: (fixer) => {
            // Don't fix CallExpressions unless they're from cssFunctions or cssMap
            if (
              expression.type === 'CallExpression' &&
              !isCssCallExpression(expression, configuration.cssFunctions)
            ) {
              return [];
            }

            if (expression.type === 'ObjectExpression') {
              return fixCssNotInModuleScope(
                fixer,
                context,
                configuration,
                expression,
                cssAttributeName,
              );
            }

            return fixCssNotInModuleScope(
              fixer,
              context,
              configuration,
              expression,
            );
          },
        });
        break;

      default:
        // Do nothing!
        break;
    }
  }
  traverseExpression(expression);
};

const defaultConfig: RuleConfig = {
  cssFunctions: ['css', 'xcss'],
  stylesPlacement: 'top',
};

const rule = createLintRule({
  meta: {
    name: 'consistent-css-prop-usage',
    docs: {
      description: 'Ensures consistency with `css` and `xcss` prop usages',
      url: 'https://hello.atlassian.net/wiki/spaces/AF/pages/2630143294/Styling+Components',
      recommended: true,
      severity: 'error',
    },
    fixable: 'code',
    messages: {
      cssOnTopOfModule: `Create styles at the top of the module scope using the respective css function.`,
      cssAtBottomOfModule: `Create styles at the bottom of the module scope using the respective css function.`,
      cssObjectTypeOnly: `Create styles using objects passed to the css function.`,
      cssInModule: `Imported styles should not be used, instead define in the module, import a component, or use a design token.`,
      cssArrayStylesOnly: `Compose styles with an array on the css prop instead of using object spread.`,
      shouldEndInStyles: 'Declared styles should end in "styles".',
    },
  },
  create(context: Rule.RuleContext) {
    const mergedConfig: Required<RuleConfig> = assign(
      {},
      defaultConfig,
      context.options[0],
    );

    const declarationSuffix = 'Styles';
    const callSelectorFunctions = [...mergedConfig.cssFunctions, 'cssMap'];
    const callSelector = callSelectorFunctions
      .map((fn) => `CallExpression[callee.name=${fn}]`)
      .join(',');
    return {
      [callSelector]: (node: Rule.Node) => {
        if (node.parent.type !== 'VariableDeclarator') {
          // We aren't interested in these that don't have a parent.
          return;
        }

        const identifier = node.parent.id;
        if (
          identifier.type === 'Identifier' &&
          (identifier.name.endsWith(declarationSuffix) ||
            identifier.name.startsWith(declarationSuffix.toLowerCase()) ||
            identifier.name === declarationSuffix.toLowerCase())
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

        // Always reset to empty array
        hoistedCss = [];

        if (
          name.type === 'JSXIdentifier' &&
          mergedConfig.cssFunctions.includes(name.name)
        ) {
          // When not a jsx expression. For eg. css=""
          if (value?.type !== 'JSXExpressionContainer') {
            context.report({
              node: value,
              messageId:
                mergedConfig.stylesPlacement === 'bottom'
                  ? 'cssAtBottomOfModule'
                  : 'cssOnTopOfModule',
            });

            return;
          }

          traverseExpressionWithConfig(
            context,
            value.expression,
            mergedConfig,
            name.name,
          );
        }
      },
    };
  },
});

export default rule;
