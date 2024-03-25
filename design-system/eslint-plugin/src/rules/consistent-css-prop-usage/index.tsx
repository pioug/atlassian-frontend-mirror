// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule, Scope } from 'eslint';
import {
  type EslintNode,
  getIdentifierInParentScope,
  insertAtStartOfFile,
  insertImportDeclaration,
  isNodeOfType,
} from 'eslint-codemod-utils';
import estraverse from 'estraverse';
import type ES from 'estree';
import type { JSXAttribute } from 'estree-jsx';
import assign from 'lodash/assign';

import { Import } from '../../ast-nodes';
import { createLintRule } from '../utils/create-rule';
import { getFirstSupportedImport } from '../utils/get-first-supported-import';
import { getModuleOfIdentifier } from '../utils/get-import-node-by-source';
import { CSS_IN_JS_IMPORTS } from '../utils/is-supported-import';

import type { RuleConfig } from './types';

type IdentifierWithParent = Scope.Reference['identifier'] &
  Rule.NodeParentExtension;

type NodeWithParent = EslintNode & Rule.NodeParentExtension;

type JSXAttributeWithParent = JSXAttribute & Rule.NodeParentExtension;

type CssAttributeName = 'css' | 'xcss';
type HoistableNode =
  | ES.ObjectExpression
  | ES.CallExpression
  | ES.TaggedTemplateExpression
  | ES.TemplateLiteral;

const isDOMElementName = (elementName: string): boolean =>
  elementName.charAt(0) !== elementName.charAt(0).toUpperCase() &&
  elementName.charAt(0) === elementName.charAt(0).toLowerCase();

function isCssCallExpression(
  node: EslintNode,
  cssFunctions: string[],
): node is ES.CallExpression {
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

function findSpreadProperties(node: ES.ObjectExpression): ES.SpreadElement[] {
  return node.properties.filter(
    (property): property is ES.SpreadElement =>
      property.type === 'SpreadElement' ||
      // @ts-expect-error
      property.type === 'ExperimentalSpreadProperty',
  );
}

const getProgramNode = (expression: NodeWithParent) => {
  while (expression.parent.type !== 'Program') {
    expression = expression.parent;
  }
  return expression.parent;
};

const isDeclaredInsideComponent = (expression: NodeWithParent) => {
  // These nodes imply that there is a distinct own scope (function scope / block scope),
  // and so the presence of them means that expression was not defined in the module scope.
  const NOT_MODULE_SCOPE = [
    'ArrowFunctionExpression',
    'BlockStatement',
    'ClassDeclaration',
    'FunctionExpression',
  ];
  while (expression.type !== 'Program') {
    if (NOT_MODULE_SCOPE.includes(expression.type)) {
      return true;
    }

    expression = expression.parent;
  }
  return false;
};

class JSXExpressionLinter {
  // File-level tracking of styles hoisted from the cssAtTopOfModule/cssAtBottomOfModule fixers.
  private hoistedCss: string[];

  /**
   * Traverses and lints a expression found in a JSX css or xcss prop, e.g.
   * <div css={expressionToLint} />
   *
   * @param context The context of the rule. Used to find the current scope and the source code of the file.
   * @param cssAttributeName Used to encapsulate ObjectExpressions when cssAtTopOfModule/cssAtBottomOfModule violations are triggered.
   * @param configuration What css-related functions to account for (eg. css, xcss, cssMap), and whether to detect bottom vs top expressions.
   * @param expression The expression to traverse and lint.
   */
  constructor(
    private context: Rule.RuleContext,
    private cssAttributeName: CssAttributeName,
    private configuration: Required<RuleConfig>,
    private expression: ES.Expression | ES.SpreadElement,
  ) {
    this.hoistedCss = [];
  }

  /**
   * Generates the declarator string when fixing the cssAtTopOfModule/cssAtBottomOfModule cases.
   * When `styles` already exists, `styles_1, styles_2, ..., styles_X` are incrementally created for each unhoisted style.
   *
   * The generated `styles` varibale declaration names must be manually modified to be more informative at the discretion of owning teams.
   */
  private getDeclaratorString() {
    let scope = this.context.getScope();

    // Get to ModuleScope
    while (scope && scope.upper && scope.upper.type !== 'global') {
      scope = scope?.upper;
    }
    const variables = scope.variables
      .map((variable) => variable.name)
      .concat(this.hoistedCss);
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
    this.hoistedCss = [...this.hoistedCss, `${declaratorName}${count}`];
    return `${declaratorName}${count}`;
  }

  private analyzeIdentifier(sourceIdentifier: Scope.Reference['identifier']) {
    const scope = this.context.getScope();
    const [identifier] = (getIdentifierInParentScope(
      scope,
      sourceIdentifier.name,
    )?.identifiers ?? []) as IdentifierWithParent[];

    if (!identifier || !identifier.parent) {
      // Identifier isn't in the module, skip!
      return;
    }

    if (identifier.parent.type !== 'VariableDeclarator') {
      // When variable is not in the file or coming from import
      this.context.report({
        node: sourceIdentifier,
        messageId: 'cssInModule',
      });
      return;
    }

    if (isDeclaredInsideComponent(identifier)) {
      // When variable is declared inside the component
      this.context.report({
        node: sourceIdentifier,
        messageId:
          this.configuration.stylesPlacement === 'bottom'
            ? 'cssAtBottomOfModule'
            : 'cssAtTopOfModule',
        fix: (fixer) => {
          if (!this.configuration.autoFix) {
            return [];
          }

          return this.fixCssNotInModuleScope(fixer, identifier, false);
        },
      });
      return;
    }

    if (
      identifier.parent &&
      identifier.parent.init &&
      !isCssCallExpression(
        identifier.parent.init,
        this.configuration.cssFunctions,
      )
    ) {
      // When variable value is not of type css({})
      const value = (identifier.parent as ES.VariableDeclarator).init;
      if (!value) {
        return;
      }

      const valueExpression =
        // @ts-expect-error remove once eslint types are switched to @typescript-eslint
        value.type === 'TSAsExpression' ? value.expression : value;
      if (
        ['ObjectExpression', 'TemplateLiteral'].includes(valueExpression.type)
      ) {
        this.context.report({
          node: identifier,
          messageId: 'cssObjectTypeOnly',
          fix: (fixer) => {
            if (!this.configuration.autoFix) {
              return [];
            }

            return this.addCssFunctionCall(fixer, identifier.parent);
          },
        });
      } else {
        this.context.report({
          node: identifier,
          messageId: 'cssObjectTypeOnly',
        });
      }
      return;
    }

    const spreadProperties =
      isNodeOfType(identifier.parent.init!, 'CallExpression') &&
      findSpreadProperties(
        identifier.parent.init.arguments[0] as ES.ObjectExpression,
      );
    if (spreadProperties) {
      // TODO: Recursively handle spread items in children properties.
      spreadProperties.forEach((prop: any) => {
        this.context.report({
          node: prop,
          messageId: 'cssArrayStylesOnly',
        });
      });
    }
  }

  /**
   * Returns a fixer that adds `import { css } from 'import-source'` or
   * `import { xcss } from 'import-source'` to the start of the file, depending
   * on the value of cssAttributeName and importSource.
   */
  private addImportSource(fixer: Rule.RuleFixer) {
    const importSource =
      this.cssAttributeName === 'xcss'
        ? this.configuration.xcssImportSource
        : this.configuration.cssImportSource;

    // Add the `import { css } from 'my-css-in-js-library';` statement
    const packageImport = getFirstSupportedImport(this.context, [importSource]);
    if (packageImport) {
      const addCssImport = Import.insertNamedSpecifiers(
        packageImport,
        [this.cssAttributeName],
        fixer,
      );
      if (addCssImport) {
        return addCssImport;
      }
    } else {
      return insertAtStartOfFile(
        fixer,
        `${insertImportDeclaration(importSource, [this.cssAttributeName])};\n`,
      );
    }
  }

  /**
   * Returns a list of fixes that:
   * - add the `css` or `xcss` function call around the current node.
   * - add an import statement for the package from which `css` is imported
   */
  private addCssFunctionCall(fixer: Rule.RuleFixer, node: Rule.Node) {
    const fixes: Rule.Fix[] = [];
    const sourceCode = this.context.getSourceCode();

    if (
      node.type !== 'VariableDeclarator' ||
      !node.init ||
      !this.cssAttributeName
    ) {
      return [];
    }

    const compiledImportFix = this.addImportSource(fixer);
    if (compiledImportFix) {
      fixes.push(compiledImportFix);
    }

    const init = node.init;
    const initString = sourceCode.getText(init);

    if (node.init.type === 'TemplateLiteral') {
      fixes.push(
        fixer.replaceText(init, `${this.cssAttributeName}${initString}`),
      );
    } else {
      fixes.push(
        fixer.replaceText(init, `${this.cssAttributeName}(${initString})`),
      );
    }

    return fixes;
  }

  /**
   * Check if the expression has or potentially has a local variable
   * (as opposed to an imported one), erring on the side ot "yes"
   * when an expression is too complicated to analyse.
   *
   * This is useful because expressions containing local variables
   * cannot be easily hoisted, whereas this is not a problem with imported
   * variables.
   *
   * @param context Context of the rule.
   * @param node Any node that is potentially hoistable.
   * @returns Whether the node potentially has a local variable (and thus is not safe to hoist).
   */
  private potentiallyHasLocalVariable(node: HoistableNode) {
    let hasPotentiallyLocalVariable = false;
    const isImportedVariable = (identifier: string) =>
      !!getModuleOfIdentifier(this.context.getSourceCode(), identifier);

    estraverse.traverse(node, {
      enter: function (node: EslintNode, _parent: EslintNode | null) {
        if (
          isNodeOfType(node, 'SpreadElement') ||
          // @ts-expect-error remove once we can be sure that no parser interprets
          // the spread operator as ExperimentalSpreadProperty anymore
          isNodeOfType(node, 'ExperimentalSpreadProperty')
        ) {
          // Spread elements could contain anything... so we don't bother.
          //
          // e.g. <div css={css({ ...(!height && { visibility: 'hidden' })} />
          hasPotentiallyLocalVariable = true;
          this.break();
        }

        if (!isNodeOfType(node, 'Property')) {
          return;
        }

        switch (node.value.type) {
          case 'Literal':
            break;

          case 'Identifier':
            // e.g. css({ margin: myVariable })
            if (!isImportedVariable(node.value.name)) {
              hasPotentiallyLocalVariable = true;
            }
            this.break();
            break;

          case 'MemberExpression':
            // e.g. css({ margin: props.color })
            //      css({ margin: props.media.color })
            if (
              node.value.object.type === 'Identifier' &&
              isImportedVariable(node.value.object.name)
            ) {
              // We found an imported variable, don't do anything.
            } else {
              // e.g. css({ margin: [some complicated expression].media.color })
              // This can potentially get too complex, so we assume there's a local
              // variable in there somewhere.
              hasPotentiallyLocalVariable = true;
            }
            this.break();
            break;

          case 'TemplateLiteral':
            if (!!node.value.expressions.length) {
              // Too many edge cases here, don't bother...
              // e.g. css({ animation: `${expandStyles(right, rightExpanded, isExpanded)} 0.2s ease-in-out` });
              hasPotentiallyLocalVariable = true;
              this.break();
            }
            break;

          default:
            // Catch-all for values such as "A && B", "A ? B : C"
            hasPotentiallyLocalVariable = true;
            this.break();
            break;
        }
      },
    });
    return hasPotentiallyLocalVariable;
  }

  /**
   * Fixer for the cssAtTopOfModule/cssAtBottomOfModule violation cases.
   *
   * This deals with Identifiers and Expressions passed from the traverseExpressionWithConfig() function.
   *
   * @param fixer The ESLint RuleFixer object
   * @param context The context of the rule
   * @param configuration The configuration of the rule, determining whether the fix is implmeneted at the top or bottom of the module
   * @param node Any potentially hoistable node, or an identifier.
   * @param cssAttributeName An optional parameter only added when we fix an ObjectExpression
   */
  private fixCssNotInModuleScope(
    fixer: Rule.RuleFixer,
    node: HoistableNode | ES.Identifier,
    isObjectExpression: boolean,
  ) {
    const sourceCode = this.context.getSourceCode();

    // Get the program node in order to properly position the hoisted styles
    const programNode = getProgramNode(node as NodeWithParent);
    let fixerNodePlacement: ES.Node = programNode;

    if (this.configuration.stylesPlacement === 'bottom') {
      // The last value is the bottom of the file
      fixerNodePlacement = programNode.body[programNode.body.length - 1];
    } else {
      // Place after the last ImportDeclaration
      fixerNodePlacement =
        (programNode.body.length === 1
          ? programNode.body[0]
          : programNode.body.find(
              (node: ES.Node) => node.type !== 'ImportDeclaration',
            )) ?? fixerNodePlacement;
    }

    let moduleString;
    let fixes: Rule.Fix[] = [];

    if (node.type === 'Identifier') {
      const identifier = node as IdentifierWithParent;
      const declarator = identifier.parent.parent;
      moduleString = sourceCode.getText(declarator);
      fixes.push(fixer.remove(declarator));
    } else {
      if (this.potentiallyHasLocalVariable(node)) {
        return [];
      }

      const declarator = this.getDeclaratorString();
      const text = sourceCode.getText(node);

      // If this has been passed, then we know it's an ObjectExpression
      if (isObjectExpression) {
        moduleString = `const ${declarator} = ${this.cssAttributeName}(${text});`;

        const compiledImportFix = this.addImportSource(fixer);
        if (compiledImportFix) {
          fixes.push(compiledImportFix);
        }
      } else {
        moduleString = `const ${declarator} = ${text};`;
      }
      fixes.push(fixer.replaceText(node, declarator));
    }

    return [
      ...fixes,
      // Insert the node either before or after, depending on the rule configuration
      this.configuration.stylesPlacement === 'bottom'
        ? fixer.insertTextAfter(fixerNodePlacement, '\n' + moduleString)
        : fixer.insertTextBefore(fixerNodePlacement, moduleString + '\n'),
    ];
  }

  /**
   * Handle different cases based on what's been passed in the css-related JSXAttribute.
   *
   * @param expression the expression of the JSXAttribute value.
   */
  private traverseExpression(expression: ES.Expression | ES.SpreadElement) {
    switch (expression.type) {
      case 'Identifier':
        // {styles}
        // We've found an identifier - time to analyze it!
        this.analyzeIdentifier(expression);
        break;

      case 'ArrayExpression':
        // {[styles, moreStyles]}
        // We've found an array expression - let's traverse again over each element individually.
        expression.elements.forEach((element) =>
          this.traverseExpression(element!),
        );
        break;

      case 'LogicalExpression':
        // {isEnabled && styles}
        // We've found a logical expression - we're only interested in the right expression so
        // let's traverse that and see what it is!
        this.traverseExpression(expression.right);
        break;

      case 'ConditionalExpression':
        // {isEnabled ? styles : null}
        // We've found a conditional expression - we're only interested in the consequent and
        // alternate (styles : null)
        this.traverseExpression(expression.consequent);
        this.traverseExpression(expression.alternate);
        break;

      case 'ObjectExpression':
      case 'CallExpression':
      case 'TaggedTemplateExpression':
      case 'TemplateLiteral':
        if (
          expression.type === 'CallExpression' &&
          expression.callee.type === 'Identifier' &&
          expression.callee.name === 'cx'
        ) {
          expression.arguments.forEach(
            (exp) => exp && this.traverseExpression(exp),
          );
          return;
        }

        // We've found elements that shouldn't be here! Report an error.
        this.context.report({
          node: expression,
          messageId:
            this.configuration.stylesPlacement === 'bottom'
              ? 'cssAtBottomOfModule'
              : 'cssAtTopOfModule',
          fix: (fixer) => {
            if (!this.configuration.autoFix) {
              return [];
            }

            // Don't fix CallExpressions unless they're from cssFunctions or cssMap
            if (
              expression.type === 'CallExpression' &&
              !isCssCallExpression(expression, this.configuration.cssFunctions)
            ) {
              return [];
            }

            if (expression.type === 'ObjectExpression') {
              return this.fixCssNotInModuleScope(fixer, expression, true);
            }

            return this.fixCssNotInModuleScope(fixer, expression, false);
          },
        });
        break;

      // @ts-expect-error - our ESLint-related types assume vanilla JS, when in fact
      // it is running @typescript-eslint
      //
      // Switching to the more accurate @typescript-eslint types would break
      // eslint-codemod-utils and all ESLint rules in packages/design-system,
      // so we just leave this as-is.
      case 'TSAsExpression':
        // @ts-expect-error
        this.traverseExpression(expression.expression);
        break;

      default:
        // Do nothing!
        break;
    }
  }

  run() {
    return this.traverseExpression(this.expression);
  }
}

const defaultConfig: RuleConfig = {
  cssFunctions: ['css', 'xcss'],
  stylesPlacement: 'top',
  cssImportSource: CSS_IN_JS_IMPORTS.compiled,
  xcssImportSource: CSS_IN_JS_IMPORTS.atlaskitPrimitives,
  excludeReactComponents: false,
  autoFix: true,
};

const rule = createLintRule({
  meta: {
    type: 'problem',
    name: 'consistent-css-prop-usage',
    docs: {
      description: 'Ensures consistency with `css` and `xcss` prop usages',
      url: 'https://hello.atlassian.net/wiki/spaces/AF/pages/2630143294/Styling+Components',
      recommended: true,
      severity: 'error',
    },
    fixable: 'code',
    messages: {
      cssAtTopOfModule: `Create styles at the top of the module scope using the respective css function.`,
      cssAtBottomOfModule: `Create styles at the bottom of the module scope using the respective css function.`,
      cssObjectTypeOnly: `Create styles using objects passed to a css function call, e.g. \`css({ textAlign: 'center'; })\`.`,
      cssInModule: `Imported styles should not be used; instead define in the module, import a component, or use a design token.`,
      cssArrayStylesOnly: `Compose styles with an array on the css prop instead of using object spread.`,
      noMemberExpressions: `Styles should be a regular variable (e.g. 'buttonStyles'), not a member of an object (e.g. 'myObject.styles').`,
    },
    schema: [
      {
        type: 'object',
        properties: {
          cssFunctions: {
            type: 'array',
            items: [
              {
                type: 'string',
              },
            ],
          },
          stylesPlacement: {
            type: 'string',
            enum: ['top', 'bottom'],
          },
          cssImportSource: {
            type: 'string',
          },
          xcssImportSource: {
            type: 'string',
          },
          excludeReactComponents: {
            type: 'boolean',
          },
          autoFix: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context: Rule.RuleContext) {
    const mergedConfig: Required<RuleConfig> = assign(
      {},
      defaultConfig,
      context.options[0],
    );

    return {
      JSXAttribute(nodeOriginal: any) {
        const node = nodeOriginal as JSXAttributeWithParent;
        const { name, value } = node;
        if (
          mergedConfig.excludeReactComponents &&
          node.parent.type === 'JSXOpeningElement'
        ) {
          // e.g. <item.before />
          if (node.parent.name.type === 'JSXMemberExpression') {
            return;
          }
          // e.g. <div />, <MenuItem />
          if (
            node.parent.name.type === 'JSXIdentifier' &&
            !isDOMElementName(node.parent.name.name)
          ) {
            return;
          }
        }

        if (
          name.type === 'JSXIdentifier' &&
          mergedConfig.cssFunctions.includes(name.name)
        ) {
          // When not a jsx expression. For eg. css=""
          if (value?.type !== 'JSXExpressionContainer') {
            context.report({
              node,
              messageId:
                mergedConfig.stylesPlacement === 'bottom'
                  ? 'cssAtBottomOfModule'
                  : 'cssAtTopOfModule',
            });

            return;
          }

          if (value.expression.type === 'JSXEmptyExpression') {
            // e.g. the comment in
            //      <div css={/* Hello there */} />
            return;
          }

          const linter = new JSXExpressionLinter(
            context,
            name.name as CssAttributeName,
            mergedConfig,
            value.expression,
          );
          linter.run();
        }
      },
    };
  },
});

export default rule;
