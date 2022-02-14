import { createRenameImportFor } from '../utils';

// As you could access everything in Checkbox with the old entry points
// there are a lot of possible things to fix. Having searched on SourceTree
// these are the only things that need to be fixed

export const renameTypeImport = createRenameImportFor({
  componentName: 'CheckboxProps',
  oldPackagePath: '@atlaskit/checkbox/types',
  newPackagePath: '@atlaskit/checkbox',
});

export const renameDeepTypeImport = createRenameImportFor({
  componentName: 'CheckboxProps',
  oldPackagePath: '@atlaskit/checkbox/dist/cjs/types',
  newPackagePath: '@atlaskit/checkbox',
});

export const renameCheckboxWithoutAnalyticsImport = createRenameImportFor({
  componentName: 'CheckboxWithoutAnalytics',
  newComponentName: 'Checkbox',
  oldPackagePath: '@atlaskit/checkbox/Checkbox',
  newPackagePath: '@atlaskit/checkbox',
});
