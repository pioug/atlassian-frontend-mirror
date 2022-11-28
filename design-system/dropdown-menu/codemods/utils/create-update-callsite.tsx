import core from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

export const createUpdateCallsite =
  ({
    componentName,
    newComponentName,
    packagePath,
  }: {
    componentName: string;
    newComponentName: string;
    packagePath: string;
  }) =>
  (j: core.JSCodeshift, source: Collection<Node>) => {
    source
      .find(j.JSXElement)
      // @ts-ignore
      .filter((path) => path.node.openingElement.name.name === componentName)
      .replaceWith((element) => {
        const elementName = j.jsxIdentifier(newComponentName);
        const newComponent = j.jsxElement(
          j.jsxOpeningElement(
            elementName,
            element.node.openingElement.attributes,
          ),
          j.jsxClosingElement(elementName),
          element.node.children,
        );

        return newComponent;
      });

    return source.toSource();
  };
