import { createRenameImportFor } from '../utils/create-rename-import-for';

export const renameCheckboxWithoutAnalyticsImport: (
	j: import('jscodeshift/src/core').JSCodeshift,
	source: import('jscodeshift/src/Collection').Collection<Node>,
) => void = createRenameImportFor({
	componentName: 'CheckboxWithoutAnalytics',
	newComponentName: 'Checkbox',
	oldPackagePath: '@atlaskit/checkbox/Checkbox',
	newPackagePath: '@atlaskit/checkbox',
});
