import { createRenameImportFor } from '../utils';

// As you could access everything in Checkbox with the old entry points
// there are a lot of possible things to fix. Having searched on SourceTree
// these are the only things that need to be fixed

export const renameTypeImport: (j: import("jscodeshift/src/core").JSCodeshift, source: import("jscodeshift/src/Collection").Collection<Node>) => void = createRenameImportFor({
	componentName: 'CheckboxProps',
	oldPackagePath: '@atlaskit/checkbox/types',
	newPackagePath: '@atlaskit/checkbox',
});

export const renameDeepTypeImport: (j: import("jscodeshift/src/core").JSCodeshift, source: import("jscodeshift/src/Collection").Collection<Node>) => void = createRenameImportFor({
	componentName: 'CheckboxProps',
	oldPackagePath: '@atlaskit/checkbox/dist/cjs/types',
	newPackagePath: '@atlaskit/checkbox',
});

export const renameCheckboxWithoutAnalyticsImport: (j: import("jscodeshift/src/core").JSCodeshift, source: import("jscodeshift/src/Collection").Collection<Node>) => void = createRenameImportFor({
	componentName: 'CheckboxWithoutAnalytics',
	newComponentName: 'Checkbox',
	oldPackagePath: '@atlaskit/checkbox/Checkbox',
	newPackagePath: '@atlaskit/checkbox',
});
