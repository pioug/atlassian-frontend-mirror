import {
  addCommentToStartOfFile,
  getJSXAttributesByName,
  getSpecifierName,
  hasImportDeclaration,
  isUsingProp,
} from './utils/helpers';

import core, { API, ASTPath, FileInfo, JSXElement, Options } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

function updatePopperProps(
  j: core.JSCodeshift,
  source: Collection<any>,
  specifier: string,
) {
  source.findJSXElements(specifier).forEach((path: ASTPath<JSXElement>) => {
    if (
      isUsingProp({
        j,
        base: source,
        element: path,
        propName: 'popperProps',
      })
    ) {
      // Get value from prop
      getJSXAttributesByName({
        j,
        element: path,
        attributeName: 'popperProps',
      }).forEach((attribute) => {
        // convert positionFixed
        j(attribute)
          .find(j.JSXExpressionContainer)
          .find(j.ObjectExpression)
          .find(j.ObjectProperty)
          // @ts-ignore
          .filter((property) => property.node.key.name === 'positionFixed')
          .forEach((property) => {
            // @ts-ignore
            const strategy = property.node.value.value ? 'fixed' : 'absolute';
            property.replace(
              j.objectProperty(
                j.identifier('strategy'),
                j.stringLiteral(strategy),
              ),
            );
          });

        // warn about modifiers prop
        j(attribute)
          .find(j.JSXExpressionContainer)
          .find(j.ObjectExpression)
          .find(j.ObjectProperty)
          //@ts-ignore
          .filter((property) => property.node.key.name === 'modifiers')
          .forEach(() => {
            addCommentToStartOfFile({
              j,
              base: source,
              message: `
                Popper.js has been upgraded from 1.14.1 to 2.4.2,
                and as a result the modifier prop has changed significantly. The format has been
                changed from object of objects, to array of objects, with the key for each modifier
                replaced with a name key:value pair inside the modifier object, and an options:object
                pair for configuration and other changes unique to each modifier.
                Further details can be found in the popper docs: https://popper.js.org/docs/v2/modifiers/
                `,
            });
          });
      });
    }
  });
}

export default function transformer(
  file: FileInfo,
  { jscodeshift: j }: API,
  options: Options,
) {
  const source = j(file.source);

  // Exit early if not relevant
  // We are doing this so we don't touch the formatting of unrelated files
  if (!hasImportDeclaration(j, file.source, '@atlaskit/select')) {
    return file.source;
  }

  // Get imported name for the component
  const specifier = getSpecifierName({
    j,
    base: source,
    packageName: '@atlaskit/select',
    component: 'PopupSelect',
  });
  if (!specifier) {
    return file.source;
  }

  // Convert boundaries prop
  updatePopperProps(j, source, specifier);

  return source.toSource(options.printOptions || { quote: 'single' });
}
