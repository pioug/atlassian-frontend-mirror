import core from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';
import { findImportFromPackage } from '../utils';
/**
 * Generate a codemod to remove `allowMoreTextColors` field
 * from `allowTextColor` Editor prop.
 * Ref: ED-15849
 */
const createRemoveAllowMoreTextColorsPropTransform = (
  pkg: string,
  component: string,
) => {
  return (j: core.JSCodeshift, source: Collection<any>) => {
    // Find regular or renamed imports
    // of <Editor/> component from '@atlaskit/editor-core' package
    const importedNames: string[] = findImportFromPackage(
      j,
      source,
      '@atlaskit/editor-core',
      'Editor',
    );
    // Make the change on all instances of named imports found
    importedNames.forEach((importedComponentName) => {
      // Find `allowTextColor` prop
      const allowTextColorCollection = source.find(j.JSXAttribute, {
        name: {
          type: 'JSXIdentifier',
          name: 'allowTextColor',
        },
      });
      allowTextColorCollection
        .find(j.ObjectProperty, { key: { name: 'allowMoreTextColors' } })
        .forEach((x) => j(x).remove());
      // If the remaining `allowTextColor` prop is an empty object, set `allowTextColor` to `true`.
      allowTextColorCollection.forEach((allowTextColorPath) => {
        j(allowTextColorPath).find(j.ObjectExpression, (objectExpression) => {
          if (objectExpression.properties.length === 0) {
            j(allowTextColorPath).replaceWith(
              j.jsxAttribute(
                j.jsxIdentifier('allowTextColor'),
                j.jsxExpressionContainer(j.booleanLiteral(true)),
              ),
            );
          }
        });
      });
    });
  };
};
export const removeAllowMoreColorsProp =
  createRemoveAllowMoreTextColorsPropTransform(
    '@atlaskit/editor-core',
    'Editor',
  );
