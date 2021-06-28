import core from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';
import { findImportFromPackage } from '../utils';

const createRemoveComponentPropTransform = (
  pkg: string,
  component: string,
  propName: string,
) => {
  return (j: core.JSCodeshift, source: Collection<any>) => {
    // Find regular or renamed imports
    const importedNames: string[] = findImportFromPackage(
      j,
      source,
      pkg,
      component,
    );

    // Make the change on all instances of named imports found
    importedNames.forEach((importedComponentName) => {
      source
        .findJSXElements(importedComponentName)
        .find(j.JSXAttribute, {
          name: {
            type: 'JSXIdentifier',
            name: propName,
          },
        })
        .forEach((x) => j(x).remove());
    });
  };
};

export const removeConfigPanelWidthProp = createRemoveComponentPropTransform(
  '@atlaskit/editor-core',
  'ContextPanel',
  'width',
);
