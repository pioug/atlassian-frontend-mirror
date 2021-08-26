import core, { ASTPath, JSXElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  addDynamicImport,
  getDefaultSpecifier,
  getDynamicImportName,
  getNamedSpecifier,
  getSafeImportName,
} from '@atlaskit/codemod-utils';

import {
  BODY_PROP_NAME,
  COMPONENTS_PROP_NAME,
  MODAL_BODY_COMPONENT_FALLBACK_NAME,
  MODAL_BODY_COMPONENT_NAME,
  MODAL_BODY_ENDPOINT,
  PACKAGE_NAME,
} from '../internal/constants';
import {
  addToImport,
  getComponentImportName,
  getOverrideFromComponentsProp,
  getOverrideFromIndividualProp,
  getVariableDeclarationPathByName,
  replaceChildren,
} from '../internal/utils';

export const mapBodyFromProps = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, PACKAGE_NAME);
  const dynamicImportSpecifier = getDynamicImportName(j, source, PACKAGE_NAME);
  const modalDialogComponentName = defaultSpecifier || dynamicImportSpecifier;

  if (!modalDialogComponentName) {
    return;
  }

  let shouldImportModalBody;

  const modalBodySpecifier = getNamedSpecifier(
    j,
    source,
    PACKAGE_NAME,
    MODAL_BODY_COMPONENT_NAME,
  );

  const modalBodyComponentName =
    modalBodySpecifier ||
    getSafeImportName({
      j,
      base: source,
      currentDefaultSpecifierName: null,
      desiredName: MODAL_BODY_COMPONENT_NAME,
      fallbackName: MODAL_BODY_COMPONENT_FALLBACK_NAME,
    });

  source
    .findJSXElements(modalDialogComponentName)
    .forEach((element: ASTPath<JSXElement>) => {
      const bodyFromIndividualProp = getOverrideFromIndividualProp(
        j,
        element,
        BODY_PROP_NAME,
      );
      const bodyFromComponentsProp = getOverrideFromComponentsProp(
        j,
        element,
        COMPONENTS_PROP_NAME,
        'Body',
      );

      /**
       * If both overrides are declared, use the body passed to the components prop
       * to replicate the logic in the source code (pre-lite mode).
       */
      const body = bodyFromComponentsProp || bodyFromIndividualProp;

      if (!body) {
        const isSelfClosing = j(element)
          .find(j.JSXOpeningElement)
          .at(0)
          .get('selfClosing').value;

        /**
         * We only wrap the default ModalBody around the remaining children
         * if the consumer hasn't already imported/used it, and if
         * their ModalDialog is not self-closing (because that means
         * there's no children to be wrapped around).
         */
        if (isSelfClosing || modalBodySpecifier) {
          return;
        }

        shouldImportModalBody = true;

        const wrappedChildren = j.jsxElement(
          j.jsxOpeningElement(j.jsxIdentifier(modalBodyComponentName)),
          j.jsxClosingElement(j.jsxIdentifier(modalBodyComponentName)),
          element.value.children,
        );

        replaceChildren(j, element, modalDialogComponentName, wrappedChildren);

        return;
      }

      const props = j.objectExpression([
        j.objectProperty(
          j.identifier('children'),
          j.jsxFragment(
            j.jsxOpeningFragment(),
            j.jsxClosingFragment(),
            element.value.children,
          ),
        ),
      ]);

      replaceChildren(
        j,
        element,
        modalDialogComponentName,
        j.jsxExpressionContainer(j.callExpression(body, [props])),
      );
    });

  if (shouldImportModalBody) {
    if (defaultSpecifier) {
      addToImport(j, source, [
        getComponentImportName(
          j,
          modalBodyComponentName,
          MODAL_BODY_COMPONENT_NAME,
        ),
      ]);
    } else if (dynamicImportSpecifier) {
      addDynamicImport(
        j,
        getVariableDeclarationPathByName(j, source, dynamicImportSpecifier),
        modalBodyComponentName,
        MODAL_BODY_ENDPOINT,
      );
    }
  }
};
