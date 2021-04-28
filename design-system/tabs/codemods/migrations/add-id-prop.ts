import core, { ASTPath, JSXElement, JSXOpeningElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  addCommentToStartOfFile,
  getDefaultSpecifier,
} from '@atlaskit/codemod-utils';

const component = '@atlaskit/tabs';
const newProp = 'id';

function generateUniqueId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export const addIdProp = (j: core.JSCodeshift, source: Collection<Node>) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, component);

  if (!defaultSpecifier) {
    return;
  }

  source
    .findJSXElements(defaultSpecifier)
    .forEach((element: ASTPath<JSXElement>) => {
      j(element)
        .find(j.JSXOpeningElement)
        .filter(
          (openingElement: ASTPath<JSXOpeningElement>) =>
            openingElement.node.name.type === 'JSXIdentifier' &&
            openingElement.node.name.name === defaultSpecifier,
        )
        .forEach((openingElement: ASTPath<JSXOpeningElement>) => {
          const { attributes } = openingElement.node;
          const idAttribute = j.jsxAttribute(
            j.jsxIdentifier(newProp),
            j.stringLiteral(generateUniqueId()),
          );

          // @ts-ignore
          attributes.push(idAttribute);

          addCommentToStartOfFile({
            j,
            base: source,
            message: `We have added an "${newProp}" prop to "${defaultSpecifier}" for accessibility reasons.
              The codemod has added a random ID but you can add one that makes sense for your use case.`,
          });
        });
    });
};
