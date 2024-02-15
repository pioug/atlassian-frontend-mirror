// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const elementsAccessibleNameProps = ['label', 'titleId'];

const rule = createLintRule({
  meta: {
    name: 'use-button-group-label',
    type: 'suggestion',
    docs: {
      description:
        'Ensures button groups are described to assistive technology by a direct label or by another element.',
      recommended: true,
      severity: 'warn',
    },
    messages: {
      missingLabelProp:
        'Missing accessible name. If there is no visible content to associate use `label` prop, otherwise pass id of element to `titleId` prop to be associated as label.',
      labelPropShouldHaveContents:
        'Define string that labels the interactive element.',
      titleIdShouldHaveValue:
        '`titleId` should reference the id of element that define accessible name.',
      noBothPropsUsage:
        'Do not include both `titleId` and `label` properties. Use `titleId` if the label text is available in the DOM to reference it, otherwise use `label` to provide accessible name explicitly.',
    },
    hasSuggestions: true,
  },

  create(context: Rule.RuleContext) {
    const contextLocalIdentifier: string[] = [];

    return {
      ImportDeclaration(node) {
        const buttonGroupIdentifier = node.specifiers?.filter((spec) => {
          if (node.source.value === '@atlaskit/button') {
            return (
              spec.type === 'ImportSpecifier' &&
              spec.imported?.name === 'ButtonGroup'
            );
          } else if (node.source.value === '@atlaskit/button/button-group') {
            return spec.type === 'ImportDefaultSpecifier';
          }
        });
        if (buttonGroupIdentifier?.length) {
          const { local } = buttonGroupIdentifier[0];
          contextLocalIdentifier.push(local.name);
        }
      },

      JSXElement(node: Rule.Node) {
        if (!isNodeOfType(node, 'JSXElement')) {
          return;
        }

        if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
          return;
        }

        const name = node.openingElement.name.name;
        if (contextLocalIdentifier.includes(name)) {
          const componentLabelProps = node.openingElement.attributes.filter(
            (attr) =>
              isNodeOfType(attr, 'JSXAttribute') &&
              isNodeOfType(attr.name, 'JSXIdentifier') &&
              elementsAccessibleNameProps.includes(attr.name.name),
          );

          if (componentLabelProps.length === 1) {
            const prop = componentLabelProps[0];

            if ('value' in prop && prop.value) {
              if (
                (isNodeOfType(prop.value, 'Literal') && !prop.value.value) ||
                (isNodeOfType(prop.value, 'JSXExpressionContainer') &&
                  !prop.value.expression)
              ) {
                context.report({
                  node: prop,
                  messageId:
                    prop.name.name === 'label'
                      ? 'labelPropShouldHaveContents'
                      : 'titleIdShouldHaveValue',
                });
              }
            }
          } else if (componentLabelProps.length > 1) {
            context.report({
              node: node.openingElement,
              messageId: 'noBothPropsUsage',
            });
          } else {
            context.report({
              node: node.openingElement,
              messageId: 'missingLabelProp',
            });
          }
        }
      },
    };
  },
});

export default rule;
