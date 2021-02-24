import core, { ASTPath, ImportDeclaration } from 'jscodeshift';

import { getDefaultSpecifierName, getJSXAttributesByName } from './utils';

const isConvertable = (arrowFunction: any) => {
  return (
    arrowFunction.value.params.length === 1 &&
    arrowFunction.value.params[0].type === 'Identifier'
  );
};
const spreadErrorMessage = (j: core.JSCodeshift, source: any) => {
  const defaultSpecifier = getDefaultSpecifierName(
    j,
    source,
    '@atlaskit/inline-edit',
  );

  if (!defaultSpecifier) {
    return;
  }

  const createObjectProperty = (name: string) => {
    const obj = j.objectProperty(j.identifier(name), j.identifier(name));
    obj.shorthand = true;
    obj.loc = null;

    return obj;
  };

  source
    .findJSXElements(defaultSpecifier)
    .forEach((element: ASTPath<ImportDeclaration>) => {
      getJSXAttributesByName(j, element, 'editView').forEach(editView => {
        const arrowFunction = j(editView)
          .find(j.JSXExpressionContainer)
          .find(j.ArrowFunctionExpression)
          .get();

        if (isConvertable(arrowFunction)) {
          const name = arrowFunction.value.params[0].name;
          const replacement = j.jsxExpressionContainer(
            j.arrowFunctionExpression(
              [
                j.objectPattern([
                  createObjectProperty('errorMessage'),
                  j.restProperty(j.identifier(name)),
                ]),
              ],
              arrowFunction.value.body,
            ),
          );

          j(editView).replaceWith(
            j.jsxAttribute(j.jsxIdentifier('editView'), replacement),
          );
        }
      });
    });
};

export default spreadErrorMessage;
