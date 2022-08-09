import core, { ASTPath, ImportDeclaration, JSXElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  addCommentToStartOfFile,
  getDefaultSpecifier,
  getJSXAttributesByName,
} from '@atlaskit/codemod-utils';

import {
  createRemoveFuncWithDefaultSpecifierFor,
  doesIdentifierExist,
} from '../utils';

const spreadComment = `
This file is spreading props on the Tabs component.

The API has changed to be composable and a number of props have changed.
- isSelectedTest no longer exists.
- onSelect is now onChange and has a different type.
- components prop has been removed in favour of the hooks, useTab and useTabPanel.
- isContentPersisted is now called shouldUnmountTabPanelOnChange and its behaviour is inverted.

If you were using any of these props, check the docs for the new API at
https://atlassian.design/components/tabs/examples
`;

const getImportSpecifiers = (j: core.JSCodeshift, defined: Array<string>) => {
  return ['Tab', 'TabList', 'TabPanel'].map((specifier) => {
    if (!defined.includes(specifier)) {
      return j.importSpecifier(
        j.identifier(specifier),
        j.identifier(`Atlaskit${specifier}`),
      );
    } else {
      return j.importSpecifier(j.identifier(specifier));
    }
  });
};

const packageName = '@atlaskit/tabs';
export const mapTabsProp = (j: core.JSCodeshift, source: Collection<Node>) => {
  const specifier = getDefaultSpecifier(j, source, packageName);

  if (!specifier) {
    return;
  }

  const tabTagName = doesIdentifierExist({ j, base: source, name: 'Tab' })
    ? 'AtlaskitTab'
    : 'Tab';
  const tabListTagName = doesIdentifierExist({
    j,
    base: source,
    name: 'TabList',
  })
    ? 'AtlaskitTabList'
    : 'TabList';
  const tabPanelTagName = doesIdentifierExist({
    j,
    base: source,
    name: 'TabPanel',
  })
    ? 'AtlaskitTabPanel'
    : 'TabPanel';

  source.findJSXElements(specifier).forEach((element: ASTPath<JSXElement>) => {
    let tabs;

    getJSXAttributesByName(j, element, 'tabs').forEach((attribute: any) => {
      tabs = attribute.value.value.expression;
    });
    if (!tabs) {
      j(element)
        .find(j.JSXOpeningElement)
        .find(j.JSXSpreadAttribute)
        .forEach((spreadAttribute) => {
          // If using spread then leave a comment indicating further research being needed
          addCommentToStartOfFile({ j, base: source, message: spreadComment });
          const spreadArgument = spreadAttribute.value.argument;
          tabs = j.memberExpression(spreadArgument, j.identifier('tabs'));
        });
    }

    if (!tabs) {
      return;
    }

    const newLine = j.jsxText('\n');

    const tabList = j.jsxElement(
      j.jsxOpeningElement(j.jsxIdentifier(tabListTagName)),
      j.jsxClosingElement(j.jsxIdentifier(tabListTagName)),
      [
        j.jsxText('\n'),
        j.jsxExpressionContainer(
          j.callExpression(j.memberExpression(tabs, j.identifier('map')), [
            j.arrowFunctionExpression(
              [j.identifier('tab'), j.identifier('index')],
              j.jsxElement(
                j.jsxOpeningElement(j.jsxIdentifier(tabTagName), [
                  j.jsxAttribute(
                    j.jsxIdentifier('testId'),
                    j.jsxExpressionContainer(j.identifier('tab.testId')),
                  ),
                  j.jsxAttribute(
                    j.jsxIdentifier('key'),
                    j.jsxExpressionContainer(j.identifier('index')),
                  ),
                ]),
                j.jsxClosingElement(j.jsxIdentifier(tabTagName)),
                [j.jsxExpressionContainer(j.identifier('tab.label'))],
              ),
            ),
          ]),
        ),
        j.jsxText('\n'),
      ],
    );

    const tabPanels = j.jsxExpressionContainer(
      j.callExpression(j.memberExpression(tabs, j.identifier('map')), [
        j.arrowFunctionExpression(
          [j.identifier('tab'), j.identifier('index')],
          j.jsxElement(
            j.jsxOpeningElement(j.jsxIdentifier(tabPanelTagName), [
              j.jsxAttribute(
                j.jsxIdentifier('key'),
                j.jsxExpressionContainer(j.identifier('index')),
              ),
            ]),
            j.jsxClosingElement(j.jsxIdentifier(tabPanelTagName)),
            [j.jsxExpressionContainer(j.identifier('tab.content'))],
          ),
        ),
      ]),
    );

    const tabsChildren = [newLine, tabList, newLine, tabPanels, newLine];

    j(element)
      .find(j.JSXOpeningElement)
      .forEach((openingElement) => {
        // @ts-ignore
        if (openingElement.value.name.name === specifier) {
          j(openingElement).replaceWith(
            j.jsxElement(
              j.jsxOpeningElement(
                j.jsxIdentifier(specifier),
                openingElement.value.attributes,
              ),
              j.jsxClosingElement(j.jsxIdentifier(specifier)),
              tabsChildren,
            ),
          );
        }
      });
  });

  const specifiers = getImportSpecifiers(j, [
    tabTagName,
    tabListTagName,
    tabPanelTagName,
  ]);

  source
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) =>
        path.node.source.value === packageName,
    )
    .forEach((path: ASTPath<ImportDeclaration>) => {
      j(path).replaceWith(
        j.importDeclaration(
          // @ts-ignore
          [...path.value.specifiers, ...specifiers],

          j.literal(packageName),
        ),
      );
    });
};

export const removeTabsProp = createRemoveFuncWithDefaultSpecifierFor(
  '@atlaskit/tabs',
  'tabs',
);
