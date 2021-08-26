import core, {
  ASTPath,
  Collection,
  JSXAttribute,
  JSXElement,
  StringLiteral,
} from 'jscodeshift/src/core';

import {
  addDynamicImport,
  getDefaultSpecifier,
  getDynamicImportName,
  getJSXAttributesByName,
  getSafeImportName,
} from '@atlaskit/codemod-utils';

import {
  APPEARANCE_PROP_NAME,
  HEADING_PROP_NAME,
  IS_MULTILINE_PROP_NAME,
  MODAL_HEADER_COMPONENT_FALLBACK_NAME,
  MODAL_HEADER_COMPONENT_NAME,
  MODAL_HEADER_ENDPOINT,
  MODAL_TITLE_COMPONENT_FALLBACK_NAME,
  MODAL_TITLE_COMPONENT_NAME,
  MODAL_TITLE_ENDPOINT,
  PACKAGE_NAME,
} from '../internal/constants';
import {
  addToImport,
  getAppearanceFromProp,
  getComponentImportName,
  getIsMultilineFromProp,
  getVariableDeclarationPathByName,
} from '../internal/utils';

export const mapHeadingPropToModalTitle = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  let doesHeadingPropExist;
  const defaultSpecifierName = getDefaultSpecifier(j, source, PACKAGE_NAME);
  const dynamicImportName = getDynamicImportName(j, source, PACKAGE_NAME);
  const modalDialogComponentName = defaultSpecifierName || dynamicImportName;

  if (!modalDialogComponentName) {
    return;
  }

  const modalHeaderComponentName = getSafeImportName({
    j,
    base: source,
    currentDefaultSpecifierName: null,
    desiredName: MODAL_HEADER_COMPONENT_NAME,
    fallbackName: MODAL_HEADER_COMPONENT_FALLBACK_NAME,
  });
  const modalTitleComponentName = getSafeImportName({
    j,
    base: source,
    currentDefaultSpecifierName: null,
    desiredName: MODAL_TITLE_COMPONENT_NAME,
    fallbackName: MODAL_TITLE_COMPONENT_FALLBACK_NAME,
  });

  source
    .findJSXElements(modalDialogComponentName)
    .forEach((element: ASTPath<JSXElement>) => {
      getJSXAttributesByName(j, element, HEADING_PROP_NAME).forEach(
        (attribute: ASTPath<JSXAttribute>) => {
          const headingPropValue = attribute.node.value;
          doesHeadingPropExist = true;

          j(attribute).remove();
          element.node.openingElement.selfClosing = false;
          element.node.closingElement = j.jsxClosingElement(
            j.jsxIdentifier(modalDialogComponentName),
          );

          const headerComponent = getHeaderComponent(
            j,
            element,
            modalHeaderComponentName,
            modalTitleComponentName,
            headingPropValue,
          );

          if (element.node.children) {
            element.node.children.unshift(
              j.jsxText('\n'),
              headerComponent,
              j.jsxText('\n'),
            );
          } else {
            element.node.children = [
              j.jsxText('\n'),
              headerComponent,
              j.jsxText('\n'),
            ];
          }
        },
      );
    });

  if (doesHeadingPropExist) {
    if (defaultSpecifierName) {
      addToImport(j, source, [
        getComponentImportName(
          j,
          modalTitleComponentName,
          MODAL_TITLE_COMPONENT_NAME,
        ),
        getComponentImportName(
          j,
          modalHeaderComponentName,
          MODAL_HEADER_COMPONENT_NAME,
        ),
      ]);
    } else if (dynamicImportName) {
      addDynamicImport(
        j,
        getVariableDeclarationPathByName(j, source, dynamicImportName),
        modalHeaderComponentName,
        MODAL_HEADER_ENDPOINT,
      );
      addDynamicImport(
        j,
        getVariableDeclarationPathByName(j, source, dynamicImportName),
        modalTitleComponentName,
        MODAL_TITLE_ENDPOINT,
      );
    }
  }
};

const getModalTitleAttributes = (
  j: core.JSCodeshift,
  element: ASTPath<JSXElement>,
) => {
  const appearance = getAppearanceFromProp(j, element);
  const isMultiline = getIsMultilineFromProp(j, element);

  const attributes = [];

  if (appearance !== undefined) {
    const appearanceValue =
      (appearance as StringLiteral).type === 'StringLiteral'
        ? appearance
        : j.jsxExpressionContainer(appearance);

    const appearanceAttr = j.jsxAttribute(
      j.jsxIdentifier(APPEARANCE_PROP_NAME),
      appearanceValue,
    );

    attributes.push(appearanceAttr);
  }

  if (isMultiline !== undefined) {
    const isMultilineAttr = j.jsxAttribute(
      j.jsxIdentifier(IS_MULTILINE_PROP_NAME),
      isMultiline ? j.jsxExpressionContainer(isMultiline) : isMultiline,
    );

    attributes.push(isMultilineAttr);
  }

  return attributes;
};

const getHeaderComponent = (
  j: core.JSCodeshift,
  element: ASTPath<JSXElement>,
  headerComponentName: string,
  titleComponentName: string,
  heading: any,
) => {
  return j.jsxElement(
    j.jsxOpeningElement(j.jsxIdentifier(headerComponentName)),
    j.jsxClosingElement(j.jsxIdentifier(headerComponentName)),
    [
      j.jsxText('\n'),
      j.jsxElement(
        j.jsxOpeningElement(
          j.jsxIdentifier(titleComponentName),
          getModalTitleAttributes(j, element),
        ),
        j.jsxClosingElement(j.jsxIdentifier(titleComponentName)),
        [j.jsxText('\n'), heading, j.jsxText('\n')],
      ),
      j.jsxText('\n'),
    ],
  );
};
