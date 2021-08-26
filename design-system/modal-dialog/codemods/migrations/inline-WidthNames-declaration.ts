import core, {
  Identifier,
  TSCallSignatureDeclaration,
  TSConstructSignatureDeclaration,
  TSIndexSignature,
  TSMethodSignature,
  TSPropertySignature,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import { getNamedSpecifier, removeImport } from '@atlaskit/codemod-utils';

import {
  SHARED_VARIABLES_ENDPOINT,
  WIDTH_NAMES_TYPE_NAME,
} from '../internal/constants';

export const inlineWidthNamesDeclaration = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  const namedSpecifier = getNamedSpecifier(
    j,
    source,
    SHARED_VARIABLES_ENDPOINT,
    WIDTH_NAMES_TYPE_NAME,
  );

  if (!namedSpecifier) {
    return;
  }

  source.find(j.TSTypeAliasDeclaration).forEach((declaration) => {
    const annotation = declaration.value.typeAnnotation;

    if (annotation.type === 'TSTypeLiteral') {
      replaceTypeAnnotationForWidthNames(j, namedSpecifier, annotation.members);
    }
  });

  source.find(j.TSInterfaceDeclaration).forEach((declaration) => {
    replaceTypeAnnotationForWidthNames(
      j,
      namedSpecifier,
      declaration.value.body.body,
    );
  });

  /**
   * Remove import from /shared-variables as it's no longer supported
   * and this is the only use case of that entry point.
   */
  removeImport(j, source, SHARED_VARIABLES_ENDPOINT);
};

const replaceTypeAnnotationForWidthNames = (
  j: core.JSCodeshift,
  specifier: string,
  typeAnnotations: (
    | TSPropertySignature
    | TSCallSignatureDeclaration
    | TSConstructSignatureDeclaration
    | TSIndexSignature
    | TSMethodSignature
  )[],
) => {
  const widthNames = ['small', 'medium', 'large', 'x-large'];

  typeAnnotations
    .filter((property) => property.type === 'TSPropertySignature')
    .map((property) => property as TSPropertySignature)
    .filter((property: TSPropertySignature) => {
      const typeAnnotation = property.typeAnnotation?.typeAnnotation;

      if (!typeAnnotation) {
        return false;
      }

      return (
        typeAnnotation.type === 'TSTypeReference' &&
        typeAnnotation.typeName.type === 'Identifier' &&
        (typeAnnotation.typeName as Identifier).name === specifier
      );
    })
    .forEach((property: TSPropertySignature) => {
      property.typeAnnotation = j.tsTypeAnnotation(
        j.tsUnionType(
          widthNames.map((name) => j.tsLiteralType(j.stringLiteral(name))),
        ),
      );
    });
};
