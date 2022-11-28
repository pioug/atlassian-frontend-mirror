import type { Rule } from 'eslint';
import { isNodeOfType, JSXElement } from 'eslint-codemod-utils';

import { findProp } from '../utils/jsx';

const elements = [
  'AkButton',
  'AKButton',
  'Button',
  'MenuItem',
  'ButtonItem',
  'CustomItem',
  'CustomThemeButton',
  'LoadingButton',
  'BreadcrumbsItem',
];

const elementsIconProps = ['iconBefore', 'iconAfter', 'icon'];

const rule: Rule.RuleModule = {
  meta: {
    fixable: 'code',
    type: 'suggestion',
    docs: {
      url: 'http://go/adsc/icon/usage#accessibility-guidelines',
      description:
        'Enforces accessible usage of icon labels when composed with other Design System components.',
      recommended: true,
    },
    messages: {
      unneededLabelPropContents:
        'Label prop should be an empty string to prevent duplicate screen reader announcements. Learn more here: http://go/adsc/icon/usage#accessibility-guidelines.',
      missingLabelProp:
        'Missing label prop. If there is no supplementary text the label should describe what the icon is, else it should be an empty string. Learn more here: http://go/adsc/icon/usage#accessibility-guidelines.',
      labelPropShouldHaveContents:
        'Icon should have a meaningful label describing what the action is. Learn more here: http://go/adsc/icon/usage#accessibility-guidelines.',
    },
  },

  create(context) {
    /**
     * Contains a map of imported icon components from any atlaskit icon package.
     */
    const iconImports: Record<string, true> = {};

    return {
      ImportDeclaration(node) {
        const moduleSource = node.source.value;
        if (
          typeof moduleSource === 'string' &&
          ['@atlaskit/icon/glyph/'].find((val) =>
            moduleSource.startsWith(val),
          ) &&
          node.specifiers.length
        ) {
          const defaultImport = node.specifiers.find(
            (spec) => spec.type === 'ImportDefaultSpecifier',
          );
          if (!defaultImport) {
            return;
          }

          const defaultImportName = defaultImport.local.name;

          iconImports[defaultImportName] = true;
        }
      },

      JSXElement(node: any) {
        if (!isNodeOfType(node, 'JSXElement')) {
          return;
        }
        if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
          return;
        }

        const name = node.openingElement.name.name;

        if (elements.includes(name)) {
          // We've found a DS component that might use icons, let's check them.
          const iconProps = node.openingElement.attributes.filter(
            (attr) =>
              attr.type === 'JSXAttribute' &&
              attr.name.type === 'JSXIdentifier' &&
              elementsIconProps.includes(attr.name.name),
          );

          if (iconProps.length) {
            // This found element has icon props, and it has children. Let's make sure any icon usage has an empty string label.
            iconProps.forEach((prop) => {
              if (
                prop.type !== 'JSXAttribute' ||
                prop?.value?.type !== 'JSXExpressionContainer'
              ) {
                return;
              }

              const hasOtherDefinedLabel: boolean =
                !!node.children.length || !!findProp(node, 'aria-label');

              const expression = prop.value.expression as unknown as JSXElement;
              if (
                expression.type !== 'JSXElement' ||
                expression.openingElement.name.type !== 'JSXIdentifier'
              ) {
                return;
              }

              if (iconImports[expression.openingElement.name.name]) {
                // We've found an icon from @atlaskit - let's get to work.
                const labelProp = findProp(expression, 'label');

                if (
                  labelProp &&
                  labelProp.value &&
                  labelProp.value.type === 'Literal'
                ) {
                  const isEmptyStringLabel = labelProp.value.value === '';

                  if (hasOtherDefinedLabel && !isEmptyStringLabel) {
                    context.report({
                      node: labelProp as any,
                      messageId: 'unneededLabelPropContents',
                      fix: (fixer) => {
                        return fixer.replaceText(labelProp.value as any, '""');
                      },
                    });
                  } else if (!hasOtherDefinedLabel && isEmptyStringLabel) {
                    context.report({
                      node: labelProp as any,
                      messageId: 'labelPropShouldHaveContents',
                    });
                  }
                }
              }
            });
          }
        }

        if (iconImports[name]) {
          // We've found an icon from @atlaskit - let's get to work.
          const hasLabelProp = findProp(node, 'label');

          if (!hasLabelProp) {
            context.report({
              node: node.openingElement as any,
              messageId: 'missingLabelProp',
            });
            return;
          }
        }
      },
    };
  },
};

export default rule;
