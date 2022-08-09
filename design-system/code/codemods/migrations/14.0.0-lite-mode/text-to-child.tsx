import core, { ASTPath, JSXAttribute, JSXElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  getJSXAttributesByName,
  getNamedSpecifier,
} from '@atlaskit/codemod-utils';

const textToChild = (j: core.JSCodeshift, source: Collection<Node>) => {
  const specifier = getNamedSpecifier(j, source, '@atlaskit/code', 'Code');

  if (!specifier) {
    return;
  }

  source.findJSXElements(specifier).forEach((element: ASTPath<JSXElement>) => {
    getJSXAttributesByName(j, element, 'text').forEach(
      (attribute: ASTPath<JSXAttribute>) => {
        const { value } = attribute.node;
        if (!value) {
          return;
        }

        let codeChild = value;
        switch (value.type) {
          // case when object value is provided
          case 'JSXExpressionContainer':
            const { expression } = value;

            // case when string is provided inside JSX expression
            // e.g.: text={"rm -rf"}
            if (expression.type === 'StringLiteral') {
              codeChild = j.jsxText(expression.value);
            }
            // case when a variable is provided as value
            // e.g.: text={someVariable}
            else {
              codeChild = j.jsxExpressionContainer(expression);
            }

            break;

          // case when string value is provided
          // e.g.: text="rm -rf"
          case 'StringLiteral':
            codeChild = j.jsxText(value.value);
        }

        // Remove text prop
        j(attribute).remove();

        j(element)
          .find(j.JSXOpeningElement)
          .forEach((openingElement) => {
            // @ts-ignore
            if (openingElement.value.name.name === specifier) {
              // Create opening and closing tag with the text content as a child
              j(openingElement).replaceWith(
                j.jsxElement(
                  j.jsxOpeningElement(
                    j.jsxIdentifier(specifier),
                    openingElement.value.attributes,
                  ),
                  j.jsxClosingElement(j.jsxIdentifier(specifier)),
                  [codeChild],
                ),
              );
            }
          });
      },
    );
  });
};

export default textToChild;
