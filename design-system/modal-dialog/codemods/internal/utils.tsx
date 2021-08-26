import core, {
  ASTPath,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSXAttribute,
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  ObjectExpression,
  ObjectProperty,
  StringLiteral,
  VariableDeclaration,
  VariableDeclarator,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import { getJSXAttributesByName } from '@atlaskit/codemod-utils';

import {
  APPEARANCE_PROP_NAME,
  IS_HEADING_MULTILINE_PROP_NAME,
  PACKAGE_NAME,
} from './constants';

export const getOverrideFromIndividualProp = (
  j: core.JSCodeshift,
  element: ASTPath<JSXElement>,
  attributeName: string,
) => {
  let override;
  getJSXAttributesByName(j, element, attributeName).forEach(
    (attribute: ASTPath<JSXAttribute>) => {
      const { value } = attribute.node;

      if (value && value.type === 'JSXExpressionContainer') {
        override = (value as JSXExpressionContainer).expression;
      }
    },
  );

  return override;
};

export const getOverrideFromComponentsProp = (
  j: core.JSCodeshift,
  element: ASTPath<JSXElement>,
  attributeName: string,
  keyName: string,
) => {
  let override;
  getJSXAttributesByName(j, element, attributeName).forEach(
    (attribute: ASTPath<JSXAttribute>) => {
      const { value } = attribute.node;

      if (value && value.type === 'JSXExpressionContainer') {
        if (
          (value as JSXExpressionContainer).expression.type ===
          'ObjectExpression'
        ) {
          const valueExpression = value.expression as ObjectExpression;
          const overrideFromComponentsProp = valueExpression.properties
            .filter((property) => property.type === 'ObjectProperty')
            .map((property) => property as ObjectProperty)
            .find(
              (property: ObjectProperty) =>
                property.key.type === 'Identifier' &&
                property.key.name === keyName,
            );

          if (overrideFromComponentsProp) {
            override = overrideFromComponentsProp.value;
            valueExpression.properties = valueExpression.properties.filter(
              (property: any) => property !== overrideFromComponentsProp,
            );
          }
        }
      }
    },
  );

  return override;
};

export const getAppearanceFromProp = (
  j: core.JSCodeshift,
  element: ASTPath<JSXElement>,
) => {
  let appearance;
  getJSXAttributesByName(j, element, APPEARANCE_PROP_NAME).forEach(
    (attribute: ASTPath<JSXAttribute>) => {
      const { value } = attribute.node;

      if (value && value.type === 'StringLiteral') {
        // <ModalDialog appearance="warning" />
        appearance = j.stringLiteral((value as StringLiteral).value);
      } else if (value && value.type === 'JSXExpressionContainer') {
        // <ModalDialog appearance={appearance} />
        appearance = (value as JSXExpressionContainer).expression;
      }
    },
  );

  return appearance;
};

export const getIsMultilineFromProp = (
  j: core.JSCodeshift,
  element: ASTPath<JSXElement>,
) => {
  let isMultiline;
  getJSXAttributesByName(j, element, IS_HEADING_MULTILINE_PROP_NAME).forEach(
    (attribute: ASTPath<JSXAttribute>) => {
      const { value } = attribute.node;
      if (value === null) {
        // <ModalDialog isHeadingMultiline />
        isMultiline = value;
        j(attribute).remove();
      } else if (value && value.type === 'JSXExpressionContainer') {
        // <ModalDialog isHeadingMultiline={true} />
        isMultiline = (value as JSXExpressionContainer).expression;
        j(attribute).remove();
      }
    },
  );

  return isMultiline;
};

export const replaceChildren = (
  j: core.JSCodeshift,
  element: ASTPath<JSXElement>,
  specifier: string,
  children: JSXElement | JSXExpressionContainer | JSXFragment | JSXSpreadChild,
) => {
  j(element)
    .find(j.JSXOpeningElement)
    .forEach((openingElement) => {
      const openingElementName = openingElement.value.name;
      if (
        openingElementName.type === 'JSXIdentifier' &&
        openingElementName.name === specifier
      ) {
        j(element).replaceWith(
          j.jsxElement(
            j.jsxOpeningElement(
              j.jsxIdentifier(specifier),
              openingElement.value.attributes,
            ),
            j.jsxClosingElement(j.jsxIdentifier(specifier)),
            [j.jsxText('\n'), children, j.jsxText('\n')],
          ),
        );
      }
    });
};

export const getComponentImportName = (
  j: core.JSCodeshift,
  componentDefaultName: string,
  componentAliasName: string,
) => {
  return isAliasImport(componentDefaultName, componentAliasName)
    ? j.importSpecifier(
        j.identifier(componentAliasName),
        j.identifier(componentDefaultName),
      )
    : j.importSpecifier(j.identifier(componentDefaultName));
};

const isAliasImport = (
  componentDefaultName: string,
  componentAliasName: string,
) => componentDefaultName !== componentAliasName;

export const addToImport = (
  j: core.JSCodeshift,
  source: Collection<Node>,
  specifiers: (
    | ImportSpecifier
    | ImportDefaultSpecifier
    | ImportNamespaceSpecifier
  )[],
  packageEndpoint?: string,
) => {
  const endpoint = packageEndpoint ?? PACKAGE_NAME;

  source
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) => path.node.source.value === endpoint,
    )
    .forEach((path: ASTPath<ImportDeclaration>) => {
      j(path).replaceWith(
        j.importDeclaration(
          [...(path.value.specifiers || []), ...specifiers],
          j.literal(endpoint),
        ),
      );
    });
};

export const getVariableDeclarationPathByName = (
  j: core.JSCodeshift,
  source: Collection<Node>,
  variableName: string,
) => {
  return source
    .find(j.VariableDeclaration)
    .filter((variableDeclarationPath: ASTPath<VariableDeclaration>) => {
      return (
        j(variableDeclarationPath)
          .find(j.VariableDeclarator)
          .filter(
            (variableDeclaratorPath: ASTPath<VariableDeclarator>) =>
              variableDeclaratorPath.node.id.type === 'Identifier' &&
              variableDeclaratorPath.node.id.name === variableName,
          ).length > 0
      );
    });
};
