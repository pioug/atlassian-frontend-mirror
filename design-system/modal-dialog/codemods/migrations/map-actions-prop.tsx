import core, {
  ArrayExpression,
  ASTPath,
  Collection,
  Identifier,
  JSXAttribute,
  JSXElement,
  JSXExpressionContainer,
  ObjectExpression,
  Property,
  VariableDeclaration,
  VariableDeclarator,
} from 'jscodeshift/src/core';

import {
  addCommentBefore,
  addDynamicImport,
  getDefaultSpecifier,
  getDynamicImportName,
  getJSXAttributesByName,
  getSafeImportName,
  tryCreateImport,
} from '@atlaskit/codemod-utils';

import {
  ACTIONS_PROP_NAME,
  APPEARANCE_PROP_NAME,
  AUTOFOCUS_PROP_NAME,
  BUTTON_COMPONENT_FALLBACK_NAME,
  BUTTON_COMPONENT_NAME,
  BUTTON_ENDPOINT,
  MODAL_FOOTER_COMPONENT_FALLBACK_NAME,
  MODAL_FOOTER_COMPONENT_NAME,
  MODAL_FOOTER_ENDPOINT,
  PACKAGE_NAME,
} from '../internal/constants';
import {
  addToImport,
  getAppearanceFromProp,
  getComponentImportName,
  getVariableDeclarationPathByName,
} from '../internal/utils';

const comment = `
In this codemod, we are moving the position of the primary button to the right-hand side of
modal footer to align with the design guidelines while we convert your usage of 'actions' prop.

However, we could not definitively determine if the 'appearance' prop has been included in the 'actions' prop in this file,
so in this case, we have converted the 'actions' prop into Button components without moving the position of the primary button.
To complete the migration and align with the design guidelines, please make the necessary changes manually.`;

export const mapActionsProp = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  let isActionsPropPresent;
  const defaultSpecifierName = getDefaultSpecifier(j, source, PACKAGE_NAME);
  const buttonDefaultSpecifierName = getDefaultSpecifier(
    j,
    source,
    BUTTON_ENDPOINT,
  );

  const dynamicImportName = getDynamicImportName(j, source, PACKAGE_NAME);
  const modalDialogComponentName = defaultSpecifierName || dynamicImportName;

  if (!modalDialogComponentName) {
    return;
  }
  const modalFooterComponentName = getSafeImportName({
    j,
    base: source,
    desiredName: MODAL_FOOTER_COMPONENT_NAME,
    fallbackName: MODAL_FOOTER_COMPONENT_FALLBACK_NAME,
    currentDefaultSpecifierName: null,
  });
  const buttonComponentName = getSafeImportName({
    j,
    base: source,
    desiredName: BUTTON_COMPONENT_NAME,
    fallbackName: BUTTON_COMPONENT_FALLBACK_NAME,
    currentDefaultSpecifierName: buttonDefaultSpecifierName,
  });

  source
    .findJSXElements(modalDialogComponentName)
    .forEach((element: ASTPath<JSXElement>) => {
      getJSXAttributesByName(j, element, ACTIONS_PROP_NAME).forEach(
        (attribute: ASTPath<JSXAttribute>) => {
          const actionsPropValue = (attribute.node
            .value as JSXExpressionContainer)?.expression;

          if (
            !actionsPropValue ||
            actionsPropValue.type === 'JSXEmptyExpression'
          ) {
            return;
          }

          isActionsPropPresent = true;

          j(attribute).remove();

          element.node.openingElement.selfClosing = false;
          element.node.closingElement = j.jsxClosingElement(
            j.jsxIdentifier(modalDialogComponentName),
          );

          const footerComponent = getFooterComponent(
            j,
            source,
            element,
            modalFooterComponentName,
            buttonComponentName,
            actionsPropValue,
          );

          if (element.node.children) {
            element.node.children.push(footerComponent, j.jsxText('\n'));
          } else {
            element.node.children = [footerComponent, j.jsxText('\n')];
          }
        },
      );
    });

  if (isActionsPropPresent) {
    if (defaultSpecifierName) {
      addToImport(j, source, [
        getComponentImportName(
          j,
          modalFooterComponentName,
          MODAL_FOOTER_COMPONENT_NAME,
        ),
      ]);

      if (!buttonDefaultSpecifierName) {
        tryCreateImport(j, source, PACKAGE_NAME, BUTTON_ENDPOINT);
        addToImport(
          j,
          source,
          [j.importDefaultSpecifier(j.identifier(buttonComponentName))],
          BUTTON_ENDPOINT,
        );
      }
    }
    if (dynamicImportName) {
      addDynamicImport(
        j,
        getVariableDeclarationPathByName(j, source, dynamicImportName),
        modalFooterComponentName,
        MODAL_FOOTER_ENDPOINT,
      );
      addDynamicImport(
        j,
        getVariableDeclarationPathByName(j, source, dynamicImportName),
        buttonComponentName,
        BUTTON_ENDPOINT,
      );
    }
  }
};

const getAppearanceForButton = (
  j: core.JSCodeshift,
  element: ASTPath<JSXElement>,
  isAppearanceSetInActions: boolean,
  defaultValue: string,
) => {
  const modalDialogAppearance = getAppearanceFromProp(j, element);
  const shouldUseModalDialogAppearance =
    modalDialogAppearance && defaultValue === 'primary';

  if (isAppearanceSetInActions && shouldUseModalDialogAppearance) {
    return j.logicalExpression(
      '||',
      j.logicalExpression(
        '||',
        j.memberExpression(
          j.identifier('props'),
          j.identifier(APPEARANCE_PROP_NAME),
        ),
        // @ts-ignore
        modalDialogAppearance,
      ),
      j.stringLiteral(defaultValue),
    );
  }

  if (isAppearanceSetInActions && !shouldUseModalDialogAppearance) {
    return j.logicalExpression(
      '||',
      j.memberExpression(
        j.identifier('props'),
        j.identifier(APPEARANCE_PROP_NAME),
      ),
      j.stringLiteral(defaultValue),
    );
  }

  if (!isAppearanceSetInActions && shouldUseModalDialogAppearance) {
    return j.logicalExpression(
      '||',
      // @ts-ignore
      modalDialogAppearance,
      j.stringLiteral(defaultValue),
    );
  }

  return j.stringLiteral(defaultValue);
};

const getFooterComponent = (
  j: core.JSCodeshift,
  source: Collection<Node>,
  element: ASTPath<JSXElement>,
  footerComponentName: string,
  buttonComponentName: string,
  actions: any,
) => {
  const isAppearanceSetInActions = findAppearanceInActions(
    j,
    source,
    element,
    actions,
  );

  return j.jsxElement(
    j.jsxOpeningElement(j.jsxIdentifier(footerComponentName)),
    j.jsxClosingElement(j.jsxIdentifier(footerComponentName)),
    [
      j.jsxText('\n'),
      j.jsxExpressionContainer(
        /**
         * We reverse the button order only if
         * appearance is NOT set in actions.
         */
        isAppearanceSetInActions
          ? mapActionsAndKeepOrder(j, element, buttonComponentName, actions)
          : mapActionsAndReverseOrder(j, element, buttonComponentName, actions),
      ),
      j.jsxText('\n'),
    ],
  );
};

const mapActionsAndReverseOrder = (
  j: core.JSCodeshift,
  element: core.ASTPath<JSXElement>,
  buttonComponentName: string,
  actions: any,
) => {
  return j.callExpression(
    j.memberExpression(
      j.callExpression(j.memberExpression(actions, j.identifier('map')), [
        j.arrowFunctionExpression(
          [j.identifier('props'), j.identifier('index')],
          j.jsxElement(
            j.jsxOpeningElement(
              j.jsxIdentifier(buttonComponentName),
              getAttributesForReversedButtons(j, element),
            ),
            j.jsxClosingElement(j.jsxIdentifier(buttonComponentName)),
            [
              j.jsxExpressionContainer(
                j.memberExpression(j.identifier('props'), j.identifier('text')),
              ),
            ],
          ),
        ),
      ]),
      j.identifier('reverse'),
    ),
    [],
  );
};

const mapActionsAndKeepOrder = (
  j: core.JSCodeshift,
  element: core.ASTPath<JSXElement>,
  buttonComponentName: string,
  actions: any,
) => {
  return j.callExpression(j.memberExpression(actions, j.identifier('map')), [
    j.arrowFunctionExpression(
      [j.identifier('props'), j.identifier('index')],
      j.jsxElement(
        j.jsxOpeningElement(
          j.jsxIdentifier(buttonComponentName),
          getAttributesForButtons(j, element),
        ),
        j.jsxClosingElement(j.jsxIdentifier(buttonComponentName)),
        [
          j.jsxExpressionContainer(
            j.memberExpression(j.identifier('props'), j.identifier('text')),
          ),
        ],
      ),
    ),
  ]);
};

const getAttributesForReversedButtons = (
  j: core.JSCodeshift,
  element: core.ASTPath<JSXElement>,
) => {
  return [
    j.jsxSpreadAttribute(j.identifier('props')),
    j.jsxAttribute(
      j.jsxIdentifier(AUTOFOCUS_PROP_NAME),
      j.jsxExpressionContainer(
        j.binaryExpression('===', j.identifier('index'), j.numericLiteral(0)),
      ),
    ),
    j.jsxAttribute(
      j.jsxIdentifier(APPEARANCE_PROP_NAME),
      j.jsxExpressionContainer(
        j.conditionalExpression(
          j.binaryExpression('===', j.identifier('index'), j.numericLiteral(0)),
          /**
           * This function is called only when appearance is NOT found
           * in actions – hence hardcoding it to 'false'.
           */
          getAppearanceForButton(j, element, false, 'primary'),
          getAppearanceForButton(j, element, false, 'subtle'),
        ),
      ),
    ),
  ];
};

const getAttributesForButtons = (
  j: core.JSCodeshift,
  element: core.ASTPath<JSXElement>,
) => {
  return [
    j.jsxSpreadAttribute(j.identifier('props')),
    j.jsxAttribute(
      j.jsxIdentifier(APPEARANCE_PROP_NAME),
      j.jsxExpressionContainer(
        j.conditionalExpression(
          j.binaryExpression('===', j.identifier('index'), j.numericLiteral(0)),
          /**
           * This function is called only when appearance is found
           * in actions – hence hardcoding it to 'true'.
           */
          getAppearanceForButton(j, element, true, 'primary'),
          getAppearanceForButton(j, element, true, 'subtle'),
        ),
      ),
    ),
  ];
};

const findAppearanceInActions = (
  j: core.JSCodeshift,
  source: Collection<Node>,
  element: core.ASTPath<JSXElement>,
  actions: any,
) => {
  if (actions.type === 'Identifier') {
    const actionPropVariableName = (actions as Identifier).name;

    const actionsVariableDeclaration = getVariableDeclarationByName(
      source,
      j,
      actionPropVariableName,
    );

    /**
     * If there are multiple variables declared with the same name,
     * we assume that it is and keep the button order the same.
     */
    if (actionsVariableDeclaration.length > 1) {
      addCommentBefore(j, j(element), comment);

      return true;
    } else {
      /**
       * If actions prop is declared as variable, and we can find the declaration
       * in the same file, we check if there's any appearance property set.
       */
      const actionPropVariableValue = (actionsVariableDeclaration as any)?.nodes()[0]
        .declarations[0]?.init;

      return checkAppearancePropertyExistence(actionPropVariableValue);
    }
  } else if (actions.type === 'ArrayExpression') {
    /**
     * If actions prop is declared inline, we check if there's any appearance property set.
     */
    return checkAppearancePropertyExistence(actions);
  } else {
    /**
     * If we cannot definitively determine whether appearance is set in any of the actions,
     * we assume that it is and keep the button order the same.
     */
    return true;
  }
};

const checkAppearancePropertyExistence = (actions: any) => {
  return (actions as ArrayExpression).elements.some((elem) => {
    return (elem as ObjectExpression).properties.some((property) => {
      return (
        ((property as Property).key as Identifier).name === APPEARANCE_PROP_NAME
      );
    });
  });
};

const getVariableDeclarationByName = (
  source: core.Collection<Node>,
  j: core.JSCodeshift,
  variableName: string,
) => {
  return source
    .find(j.VariableDeclaration)
    .filter((variableDeclaration: ASTPath<VariableDeclaration>) => {
      return variableDeclaration.node.declarations.some(
        (variableDeclarator) => {
          const variableDeclaratorTyped = variableDeclarator as VariableDeclarator;
          return (
            variableDeclaratorTyped.id.type === 'Identifier' &&
            variableDeclaratorTyped.id.name === variableName
          );
        },
      );
    });
};
