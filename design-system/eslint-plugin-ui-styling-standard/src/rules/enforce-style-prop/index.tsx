import { type Identifier, isNodeOfType, type Node } from 'eslint-codemod-utils';
import type { SpreadElement, Property } from 'estree-jsx';

import { createLintRule } from '../utils/create-rule';
import type { Rule, Scope } from 'eslint';
import {
  getAllowedFunctionCalls,
  isAllowListedVariable,
} from '@atlaskit/eslint-utils/allowed-function-calls';
import { findVariable } from '@atlaskit/eslint-utils/find-variable';

type ObjPropertyType = Property | SpreadElement;
type IdentifierWithParent = Scope.Reference['identifier'] &
  Rule.NodeParentExtension;

const isParameter = (
  context: Rule.RuleContext,
  identifier: Identifier,
): boolean => {
  const definitions = findVariable({
    sourceCode: context.sourceCode,
    identifier: identifier,
  })?.defs;
  if (!definitions || !definitions.length) {
    return false;
  }

  const result = definitions[0];
  return result.type === 'Parameter';
};

const isIdentifierAllowed = (
  context: Rule.RuleContext,
  identifier: Identifier,
): boolean => {
  const variable = findVariable({
    sourceCode: context.sourceCode,
    identifier: identifier,
  });

  if (!variable) {
    return false;
  }

  const variableDefinition = variable.defs[0].node;

  // If identifier is a RestElement, report warning
  if (
    (variable.identifiers[0] as IdentifierWithParent).parent?.type ===
    'RestElement'
  ) {
    return false;
  }

  // Checking if identifier has been destructured from props within function
  if (variableDefinition.type === 'VariableDeclarator') {
    // If it's a let variable, ignore
    if (variableDefinition.parent.kind === 'let') {
      return true;
    }
    // If it's initialised by a call expression, ignore
    if (variableDefinition.init?.type === 'CallExpression') {
      return true;
    }
    // Destructured from member expression
    // e.g. const width = props.width
    if (variableDefinition.init?.type === 'MemberExpression') {
      return isParameter(context, variableDefinition.init.object);
    }
    // Destructured from object pattern
    // e.g. const { width } = props
    return isParameter(context, variableDefinition.init);
  }
  // If identifier has not been deconstructed from parameter or is a RestElement, report warning
  return isParameter(context, identifier);
};

function isPropertyValueAllowed(
  property: ObjPropertyType,
  context: Rule.RuleContext,
): boolean {
  if (property.type === 'SpreadElement') {
    return false;
  }
  // property.type === 'Property', moving on to check if value is static
  if (property.value.type === 'Literal') {
    return false;
  } else if (property.value.type === 'Identifier') {
    return isIdentifierAllowed(context, property.value);
  } else if (
    property.value.type === 'CallExpression' &&
    property.value.callee.type === 'Identifier'
  ) {
    const variable = findVariable({
      sourceCode: context.sourceCode,
      identifier: property.value.callee,
    });
    // Anything returned by getAllowedFunctionCalls should be used in css prop instead
    const functionAllowList = getAllowedFunctionCalls(context.options);
    if (
      !variable ||
      isAllowListedVariable({
        allowList: functionAllowList,
        variable,
      })
    ) {
      return false;
    }
  } else if (
    property.value.type === 'MemberExpression' &&
    property.value.object.type === 'Identifier'
  ) {
    const definitions = findVariable({
      sourceCode: context.sourceCode,
      identifier: property.value.object,
    })?.defs;
    if (!definitions || !definitions.length) {
      return false;
    }
    const variable = definitions[0];
    if (!variable) {
      return false;
    }
    const varType = variable.type;

    if (varType === 'Variable') {
      if (!variable.node.init) {
        return false;
      }
      const varSource = variable.node.init.type;
      // Variables initialised by a call expression or object expression are ok
      if (varSource === 'CallExpression' || varSource === 'ObjectExpression') {
        return true;
      }
      // Check if member expression matches with function argument
    } else if (varType !== 'Parameter') {
      return false;
    }
  }
  return true;
}

export const rule = createLintRule({
  meta: {
    name: 'enforce-style-prop',
    docs: {
      description:
        'Disallows usage of static styles in the `style` attribute in components',
      recommended: true,
      severity: 'warn',
    },
    messages: {
      'enforce-style-prop':
        'Avoid adding static values to the style prop. Use the css prop for static styles instead.',
    },
    type: 'problem',
  },
  create(context) {
    return {
      'JSXAttribute[name.name="style"] > JSXExpressionContainer': (
        node: Node,
      ) => {
        if (!isNodeOfType(node, 'JSXExpressionContainer')) {
          return;
        }
        // we've reached an attribute named style

        if (node.expression.type === 'ObjectExpression') {
          node.expression.properties.forEach((value) => {
            if (!isPropertyValueAllowed(value, context)) {
              context.report({
                node: value,
                messageId: 'enforce-style-prop',
              });
            }
          });
        } else {
          context.report({
            node: node,
            messageId: 'enforce-style-prop',
          });
        }
      },
    };
  },
});

export default rule;
