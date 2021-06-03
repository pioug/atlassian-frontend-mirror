import core, { ASTPath, JSXElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  addCommentToStartOfFile,
  getDefaultSpecifier,
  getJSXAttributesByName,
} from '@atlaskit/codemod-utils';

const comment = `
This file uses onSelect and this prop has been changed names to onChange.

The type of onChange has also changed from
(selected: TabData, selectedIndex: number, analyticsEvent: UIAnalyticsEvent) => void;
to
(index: number, analyticsEvent: UIAnalyticsEvent) => void;

The logic around selecting tabs has changed internally and there is no longer the concept of TabData.
Tabs is now composable and the tabs prop has been removed.

The codemod has changed your usage of onSelect to be one of onChange. We are using the tabs
array and the selected index to pass the "selected tab" to your old onSelect function. This is
functional but you may like to update your usage of tabs to fit with the new API.

If you are using the selected prop you will need to ensure that you are passing in the index
of the selected tab as it also doesn't accept TabData anymore.
`;

export const migrateOnSelectType = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  const specifier = getDefaultSpecifier(j, source, '@atlaskit/tabs');

  if (!specifier) {
    return;
  }

  source.findJSXElements(specifier).forEach((element: ASTPath<JSXElement>) => {
    let tabs: any;
    getJSXAttributesByName(j, element, 'tabs').forEach((attribute: any) => {
      tabs = attribute.value.value.expression;
    });

    if (!tabs) {
      j(element)
        .find(j.JSXOpeningElement)
        .find(j.JSXSpreadAttribute)
        .forEach((spreadAttribute) => {
          const spreadArgument = spreadAttribute.value.argument;
          tabs = j.memberExpression(spreadArgument, j.identifier('tabs'));
        });
    }

    if (!tabs) {
      return;
    }

    getJSXAttributesByName(j, element, 'onSelect').forEach((attribute: any) => {
      addCommentToStartOfFile({ j, base: source, message: comment });
      const onChangeValue = attribute.node.value.expression;

      let selectedTab = j.variableDeclaration('const', [
        j.variableDeclarator(
          j.identifier('selectedTab'),
          j.memberExpression(tabs, j.identifier('index'), true),
        ),
      ]);

      // Wrap arrow functions to create an IIFE
      let onChangeCall = onChangeValue.name
        ? onChangeValue
        : j.parenthesizedExpression(onChangeValue);

      const newVersionOfFn = j.arrowFunctionExpression(
        [j.identifier('index'), j.identifier('analyticsEvent')],
        j.blockStatement([
          selectedTab,
          j.expressionStatement(
            j.callExpression(onChangeCall, [
              j.identifier('selectedTab'),
              j.identifier('index'),
              j.identifier('analyticsEvent'),
            ]),
          ),
        ]),
      );

      j(attribute).replaceWith(
        j.jsxAttribute(
          j.jsxIdentifier('onChange'),
          j.jsxExpressionContainer(newVersionOfFn),
        ),
      );
    });
  });
};
